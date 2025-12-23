export interface AnalysisResult {
  summary: string;
  key_findings: KeyFinding[];
  abnormal_values: AbnormalValue[];
  risk_level: "Low" | "Moderate" | "High" | "Urgent";
  lifestyle_guidance: LifestyleGuidance;
  doctor_questions: string[];
  disclaimer: string;
}

export interface KeyFinding {
  test_name: string;
  value: string;
  reference_range: string;
  status: "Normal" | "Borderline" | "High-Risk";
}

export interface AbnormalValue {
  test_name: string;
  value: string;
  reference_range: string;
  explanation: string;
  possible_factors: string[];
}

export interface LifestyleGuidance {
  hydration: string;
  exercise: string;
  diet: string;
  sleep: string;
  follow_ups: string;
}
