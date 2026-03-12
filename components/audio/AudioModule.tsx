"use client";

import { useState, useCallback } from "react";
import { Loader2, Send } from "lucide-react";
import { LanguageSelector, type Language } from "./LanguageSelector";
import { ReadingPassage, getReferenceText } from "./ReadingPassage";
import { AudioRecorder } from "./AudioRecorder";
import { EvaluationResults, type EvaluationData } from "./EvaluationResults";
import { useLanguage } from "@/components/LanguageProvider";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // Strip the data-url prefix, keep only base64
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function AudioModule() {
  const { t, locale } = useLanguage();
  const isHi = locale === "hi";
  const [language, setLanguage] = useState<Language>("english");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [criteria, setCriteria] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlob(blob);
    setResults(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setAudioBlob(null);
    setResults(null);
    setError(null);
  }, []);

  const handleEvaluate = async () => {
    if (!audioBlob) {
      setError(isHi ? "कृपया पहले ऑडियो रिकॉर्ड करें।" : "Please record audio first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const audioBase64 = await blobToBase64(audioBlob);
      const referenceText = getReferenceText(language);

      const response = await fetch("/api/evaluate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceText,
          audioBase64,
          mimeType: audioBlob.type || "audio/webm",
          optionalCriteria: criteria.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setResults(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Language Pills */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
          {t("core.audio.selectLanguage")}
        </h3>
        <LanguageSelector selected={language} onChange={setLanguage} />
      </div>

      {/* Reading Passage */}
      <ReadingPassage language={language} />

      {/* Audio Recorder */}
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        onClear={handleClear}
        hasRecording={!!audioBlob}
      />

      {/* Optional Criteria */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
        <label
          htmlFor="criteria"
          className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
        >
          {t("core.audio.customFocus")}
        </label>
        <textarea
          id="criteria"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          placeholder={t("core.audio.customFocusPlaceholder")}
          rows={3}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-colors"
        />
      </div>

      {/* Evaluate Button */}
      <button
        onClick={handleEvaluate}
        disabled={loading || !audioBlob}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-2xl text-sm font-bold transition-all touch-manipulation active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/10"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("core.audio.evaluating")}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {t("core.audio.evaluate")}
          </>
        )}
      </button>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 font-medium">
          {error}
        </div>
      )}

      {/* Results */}
      {results && <EvaluationResults data={results} />}
    </div>
  );
}
