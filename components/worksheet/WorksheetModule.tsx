"use client";

import { useState } from "react";
import { WorksheetForm, type WorksheetFormData } from "./WorksheetForm";
import { WorksheetOutput } from "./WorksheetOutput";
import { useProfile } from "@/components/ProfileProvider";
import { PROFILE_META } from "@/lib/profiles";

interface WorksheetResult {
  worksheets: Record<number, string>;
  metadata: {
    grades: number[];
    subject: string;
    topic: string;
    worksheetTypes: string[];
    questionCounts: Record<string, number>;
    outputLanguage: string;
    generatedAt: string;
  };
}

const DEFAULT_FORM: WorksheetFormData = {
  grades: [],
  subject: "",
  topic: "",
  worksheetTypes: [],
  questionCounts: {},
  outputLanguage: "English",
  details: "",
  contextFiles: [],
};

export function WorksheetModule() {
  const { profile } = useProfile();
  const [formData, setFormData] = useState<WorksheetFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorksheetResult | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (partial: Partial<WorksheetFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/worksheets/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setResult(data);
      setLocked(true);

      setTimeout(() => {
        document.getElementById("worksheet-output")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLocked(false);
    await generate();
  };

  const handleNew = () => {
    setFormData(DEFAULT_FORM);
    setResult(null);
    setLocked(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveToHistory = async () => {
    if (!result) return;

    const grades = [...result.metadata.grades].sort((a, b) => a - b).join(", ");
    const title = `Worksheet: ${result.metadata.topic}`;
    const summary = `Grades ${grades} · ${result.metadata.subject}`;

    const response = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherName: PROFILE_META[profile].name,
        moduleType: "worksheet",
        title,
        summary,
        payload: result,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to save history");
    }
  };

  return (
    <div className="space-y-6">
      <WorksheetForm
        formData={formData}
        onChange={handleChange}
        onSubmit={generate}
        onUnlock={() => setLocked(false)}
        loading={loading}
        locked={locked}
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 font-medium">
          {error}
        </div>
      )}

      {result && (
        <div id="worksheet-output">
          <WorksheetOutput
            worksheets={result.worksheets}
            metadata={result.metadata}
            onRegenerate={handleRegenerate}
            onNew={handleNew}
            onSaveToHistory={handleSaveToHistory}
            historyResetKey={result.metadata.generatedAt}
          />
        </div>
      )}
    </div>
  );
}
