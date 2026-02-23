"use client";

import { useState } from "react";
import { PlannerForm, type PlannerFormData } from "./PlannerForm";
import { PlannerOutput } from "./PlannerOutput";

interface PlannerResult {
  plan: string;
  metadata: {
    grade: number;
    subject: string;
    topic: string;
    duration: number;
    outputLanguage: string;
    generatedAt: string;
  };
}

const DEFAULT_FORM: PlannerFormData = {
  grade: null,
  subject: "",
  duration: "40",
  topic: "",
  details: "",
  outputLanguage: "English",
};

export function PlannerModule() {
  const [formData, setFormData] = useState<PlannerFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (partial: Partial<PlannerFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Generation failed");

      setResult(data);
      setLocked(true);

      setTimeout(() => {
        document.getElementById("planner-output")?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div className="space-y-6">
      <PlannerForm
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
        <div id="planner-output">
          <PlannerOutput
            plan={result.plan}
            metadata={result.metadata}
            onRegenerate={handleRegenerate}
            onNew={handleNew}
          />
        </div>
      )}
    </div>
  );
}
