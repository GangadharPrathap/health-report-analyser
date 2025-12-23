import { useState } from "react";
import { Activity, ArrowLeft } from "lucide-react";
import FileUpload from "@/react-app/components/FileUpload";
import AnalysisResult from "@/react-app/components/AnalysisResult";
import type { AnalysisResult as AnalysisResultType } from "@/shared/types";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze report");
      }

      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HealthScan AI
              </h1>
              <p className="text-xs text-gray-500">Educational Medical Report Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!result ? (
          <div className="flex flex-col items-center space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Understand Your Health Reports
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Upload your medical reports and get a clear, easy-to-understand analysis
                powered by AI. For educational purposes only.
              </p>
            </div>

            {/* Upload Section */}
            <FileUpload onFileSelect={handleFileSelect} isLoading={isAnalyzing} />

            {/* Loading State */}
            {isAnalyzing && (
              <div className="flex flex-col items-center space-y-4 py-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    Analyzing your report...
                  </p>
                  <p className="text-sm text-gray-500">
                    This may take 10-30 seconds
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="w-full max-w-2xl bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <p className="text-red-800 font-medium">Error: {error}</p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Clear Explanations
                </h3>
                <p className="text-sm text-gray-600">
                  Get simple, easy-to-understand explanations of your test results
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Lifestyle Guidance
                </h3>
                <p className="text-sm text-gray-600">
                  Receive personalized wellness recommendations based on your results
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Doctor Questions
                </h3>
                <p className="text-sm text-gray-600">
                  Get suggested questions to ask your healthcare provider
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Analyze Another Report</span>
            </button>

            {/* Results */}
            <div className="flex justify-center">
              <AnalysisResult result={result} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-500">
            HealthScan AI is for educational and informational purposes only. Always
            consult with qualified healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
