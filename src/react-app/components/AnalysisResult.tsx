import { AlertCircle, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import type { AnalysisResult } from "@/shared/types";

interface AnalysisResultProps {
  result: AnalysisResult;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      case "Moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Urgent":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Normal":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Borderline":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "High-Risk":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Risk Level Badge */}
      <div className={`p-6 rounded-2xl border-2 ${getRiskColor(result.risk_level)}`}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="text-sm font-medium opacity-75">Overall Risk Level</p>
            <p className="text-2xl font-bold">{result.risk_level}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
        <p className="text-gray-600 leading-relaxed">{result.summary}</p>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Findings</h2>
        <div className="space-y-4">
          {Array.isArray(result.key_findings) && result.key_findings.map((finding, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {getStatusIcon(finding.status)}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{finding.test_name}</p>
                <div className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Value:</span> {finding.value} |{" "}
                  <span className="font-medium">Reference:</span> {finding.reference_range}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  finding.status === "Normal"
                    ? "bg-green-100 text-green-700"
                    : finding.status === "Borderline"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {finding.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Abnormal Values */}
      {Array.isArray(result.abnormal_values) && result.abnormal_values.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Understanding Abnormal Values
          </h2>
          <div className="space-y-6">
            {result.abnormal_values.map((value, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {value.test_name}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Your Value:</span> {value.value} |{" "}
                  <span className="font-medium">Normal Range:</span>{" "}
                  {value.reference_range}
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {value.explanation}
                </p>
                {Array.isArray(value.possible_factors) && value.possible_factors.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Common Contributing Factors:
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      {value.possible_factors.map((factor, idx) => (
                        <li key={idx}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Guidance */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-purple-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Wellness Recommendations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur rounded-xl p-5">
            <p className="font-semibold text-purple-900 mb-2">💧 Hydration</p>
            <p className="text-sm text-gray-700">{result.lifestyle_guidance.hydration}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-5">
            <p className="font-semibold text-purple-900 mb-2">🏃 Exercise</p>
            <p className="text-sm text-gray-700">{result.lifestyle_guidance.exercise}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-5">
            <p className="font-semibold text-purple-900 mb-2">🥗 Diet</p>
            <p className="text-sm text-gray-700">{result.lifestyle_guidance.diet}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-5">
            <p className="font-semibold text-purple-900 mb-2">😴 Sleep</p>
            <p className="text-sm text-gray-700">{result.lifestyle_guidance.sleep}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-xl p-5 md:col-span-2">
            <p className="font-semibold text-purple-900 mb-2">📅 Follow-ups</p>
            <p className="text-sm text-gray-700">{result.lifestyle_guidance.follow_ups}</p>
          </div>
        </div>
      </div>

      {/* Questions for Doctor */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Questions to Ask Your Doctor
        </h2>
        <ul className="space-y-3">
          {Array.isArray(result.doctor_questions) && result.doctor_questions.map((question, index) => (
            <li
              key={index}
              className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <p className="text-gray-700">{question}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 text-lg mb-2">
              Important Medical Disclaimer
            </h3>
            <p className="text-sm text-red-800 leading-relaxed">{result.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
