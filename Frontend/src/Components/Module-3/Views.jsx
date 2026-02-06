import React from "react";

// Mock data for multiple SOAP notes
const SOAP_NOTES = [
  {
    id: "SOAP-001",
    date: "2026-02-06 15:34",
    triageResult: "GREEN FLAG",
    findings: [
      {
        category: "Subjective (S)",
        points: ["Patient (21.0y) reports low-impact injury to the ankle."]
      },
      {
        category: "Objective (O)",
        points: ["Exam Findings: No focal bone tenderness noted."]
      },
      {
        category: "Assessment (A)",
        points: ["GREEN status.", "Ottawa Ankle Rules Negative/Inconclusive."]
      },
      {
        category: "Plan (P)",
        points: [
          "Home management via RICE protocol.",
          "Patient to monitor for increased pain or neurovascular changes."
        ]
      }
    ]
  },
  {
    id: "SOAP-002",
    date: "2026-02-07 12:20",
    triageResult: "YELLOW FLAG",
    findings: [
      {
        category: "Subjective (S)",
        points: ["Patient (25.0y) reports mild headache and fatigue."]
      },
      {
        category: "Objective (O)",
        points: ["BP: 120/80 mmHg, Temp: 37°C, No other abnormalities."]
      },
      {
        category: "Assessment (A)",
        points: ["YELLOW status.", "Monitor symptoms closely."]
      },
      {
        category: "Plan (P)",
        points: ["Hydration, rest, follow-up in 24 hours."]
      }
    ]
  }
];

export default function ClinicalReport({ soapId }) {
  // Find the SOAP note by ID dynamically
  const sessionData = SOAP_NOTES.find((note) => note.id === soapId) || SOAP_NOTES[0];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          CURAMIND CLINICAL ASSESSMENT
        </h1>

        {/* SOAP ID */}
        <p className="text-center text-gray-500 mb-4">
          Viewing SOAP Note ID: <span className="font-semibold">{sessionData.id}</span>
        </p>

        {/* Session Info */}
        <div className="mb-6">
          <p>
            <span className="font-semibold">Session ID:</span> {sessionData.id}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {sessionData.date}
          </p>
          <p>
            <span className="font-semibold">Triage Result:</span> {sessionData.triageResult}
          </p>
        </div>

        {/* Table: dynamically render each finding */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th className="p-3">Clinical Category</th>
                <th className="p-3">Findings</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.findings.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 border align-top">{item.category}</td>
                  <td className="p-3 border">
                    <ul className="list-disc list-inside space-y-1">
                      {item.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
