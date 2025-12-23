import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

const uploadSchema = z.object({
  file: z.instanceof(File),
});

app.post("/api/analyze", zValidator("form", uploadSchema), async (c) => {
  try {
    const { file } = c.req.valid("form");
    
    if (!c.env.GEMINI_API_KEY) {
      return c.json({ error: "Gemini API key not configured" }, 500);
    }

    // Extract text from file
    let extractedText = "";
    let imageData: { mimeType: string; data: string } | null = null;
    
    if (file.type === "application/pdf") {
      // For PDF files, read as text (simplified approach)
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(arrayBuffer);
      extractedText = text;
    } else if (file.type.startsWith("image/")) {
      // For images, prepare for Gemini's vision capability
      const arrayBuffer = await file.arrayBuffer();
      const base64Image = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );
      imageData = {
        mimeType: file.type,
        data: base64Image
      };
    } else {
      return c.json({ error: "Unsupported file type. Please upload a PDF or image file." }, 400);
    }

    // Initialize Gemini client
    const ai = new GoogleGenAI({
      apiKey: c.env.GEMINI_API_KEY,
    });

    // Prepare the analysis prompt
    const systemInstruction = `You are a healthcare data analysis assistant designed strictly for educational and informational purposes, not for diagnosis or treatment. Your task is to analyze uploaded medical reports and generate a clear, structured, human-readable summary for a non-medical user.

Your responsibilities:
1. Extract key fields: patient metrics, test names, values, reference ranges, and flags
2. Classify results into Normal, Borderline, and High-Risk categories
3. Explain each abnormal value in very simple language (assume the user is a beginner)
4. Include possible lifestyle or dietary factors that commonly influence such results
5. Provide general wellness recommendations (hydration, exercise, diet, sleep, follow-ups) without prescribing medication
6. Clearly highlight urgent red-flag indicators that require consulting a certified doctor
7. Add a 'Questions to Ask Your Doctor' section
8. Include a final safety disclaimer

Output must be structured strictly in JSON with these sections:
- summary: Brief overview of the report
- key_findings: Array of {test_name, value, reference_range, status}
- abnormal_values: Array of {test_name, value, reference_range, explanation, possible_factors}
- risk_level: "Low", "Moderate", "High", or "Urgent"
- lifestyle_guidance: {hydration, exercise, diet, sleep, follow_ups}
- doctor_questions: Array of suggested questions
- disclaimer: Safety disclaimer text

Maintain a calm, supportive, non-alarming tone. Never give diagnoses, never suggest drugs, and never claim medical authority. If data is missing or unclear, explicitly state assumptions.`;

    let analysisResponse;

    if (imageData) {
      // Handle image analysis with vision
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { text: "Please analyze this medical report image and provide a structured analysis following the JSON format specified." },
          {
            inlineData: imageData
          }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      analysisResponse = response.text;
    } else {
      // Handle text-based analysis
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please analyze this medical report text and provide a structured analysis following the JSON format specified:\n\n${extractedText.substring(0, 10000)}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      analysisResponse = response.text;
    }

    if (!analysisResponse) {
      return c.json({ error: "Failed to generate analysis" }, 500);
    }

    const analysis: AnalysisResult = JSON.parse(analysisResponse);

    return c.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return c.json({ 
      error: error instanceof Error ? error.message : "Failed to analyze report" 
    }, 500);
  }
});

export default app;
