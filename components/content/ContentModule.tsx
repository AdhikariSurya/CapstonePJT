"use client";

import { useState } from "react";
import { ContentForm, type ContentFormData } from "./ContentForm";
import { ContentOutput } from "./ContentOutput";

interface ContentResult {
  content: string;
  metadata: {
    language: string;
    contentType: string;
    description: string;
    generatedAt: string;
  };
}

const DEFAULT_FORM: ContentFormData = {
  language: "english",
  contentType: "",
  description: "",
  contextFiles: [],
};

export function ContentModule() {
  const [formData, setFormData] = useState<ContentFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (partial: Partial<ContentFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setResult(data);
      setLocked(true);

      setTimeout(() => {
        document.getElementById("content-output")?.scrollIntoView({ behavior: "smooth" });
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
      <ContentForm
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
        <div id="content-output">
          <ContentOutput
            content={result.content}
            metadata={result.metadata}
            onRegenerate={handleRegenerate}
            onNew={handleNew}
          />
        </div>
      )}
    </div>
  );
}
