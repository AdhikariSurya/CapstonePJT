"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Loader2, Lock, Pencil, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PillSelector } from "@/components/worksheet/PillSelector";
import { ContextFileUpload } from "@/components/shared/ContextFileUpload";
import { VoiceInputAssist } from "@/components/shared/VoiceInputAssist";
import type { UploadedContextFile } from "@/lib/contextFiles";
import type { TeacherToolDefinition } from "@/lib/teacherTools";
import { getTeacherToolConfig } from "@/lib/teacherToolConfigs";
import type { TeacherToolField } from "@/lib/teacherToolConfigs";

interface TeacherToolModuleProps {
  tool: TeacherToolDefinition;
}

const OUTPUT_LANGUAGE_OPTIONS = [
  { id: "Auto", label: "Auto" },
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
];

function appendText(current: string, incoming: string) {
  return current.trim() ? `${current.trim()} ${incoming}` : incoming;
}

function getInitialFieldValues(fields: TeacherToolField[]): Record<string, string> {
  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.id] = field.defaultValue ?? "";
    return acc;
  }, {});
}

export function TeacherToolModule({ tool }: TeacherToolModuleProps) {
  const config = getTeacherToolConfig(tool.slug);
  const fields = useMemo(() => config?.fields ?? [], [config]);

  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() =>
    getInitialFieldValues(fields)
  );
  const [contextFiles, setContextFiles] = useState<UploadedContextFile[]>([]);
  const [outputLanguage, setOutputLanguage] = useState("Auto");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFieldValues(getInitialFieldValues(fields));
    setContextFiles([]);
    setOutputLanguage("Auto");
    setLoading(false);
    setLocked(false);
    setOutput("");
    setCopied(false);
    setError(null);
  }, [tool.slug, fields]);

  const isValid = useMemo(
    () =>
      fields
        .filter((field) => field.required)
        .every((field) => fieldValues[field.id]?.toString().trim().length > 0),
    [fields, fieldValues]
  );

  const speechLang =
    outputLanguage.toLowerCase().includes("hindi") ||
    fieldValues.outputLanguage?.toLowerCase().includes("hindi")
    ? "hi-IN"
    : "en-IN";

  const handleChange = (id: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
  };

  const generate = async () => {
    if (!config) return;
    setLoading(true);
    setCopied(false);
    setError(null);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: "teacher",
          toolSlug: tool.slug,
          toolName: tool.name,
          toolDescription: tool.description,
          inputs: fieldValues,
          outputLanguage,
          contextFiles,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate output");

      setOutput(data.output ?? "");
      setLocked(true);

      setTimeout(() => {
        document.getElementById("teacher-tool-output")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    if (!output.trim()) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleNew = () => {
    setFieldValues(getInitialFieldValues(fields));
    setContextFiles([]);
    setOutputLanguage("Auto");
    setOutput("");
    setLocked(false);
    setCopied(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      {!config && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-2xl p-4">
          Tool configuration is missing for this feature.
        </div>
      )}

      {locked && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100 rounded-xl">
          <div className="flex items-center gap-2 text-neutral-500">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Inputs locked</span>
          </div>
          <button
            type="button"
            onClick={() => setLocked(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      )}

      <div className={locked ? "pointer-events-none select-none opacity-60" : ""}>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
              <label
                htmlFor={`tool-field-${field.id}`}
                className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
              >
                {field.label}
                {field.required ? " *" : ""}
              </label>

              {field.type === "text" && (
                <>
                  <input
                    id={`tool-field-${field.id}`}
                    type="text"
                    value={fieldValues[field.id] ?? ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-colors"
                  />
                  {field.voiceInput && (
                    <VoiceInputAssist
                      language={speechLang}
                      disabled={locked}
                      onApply={(spokenText) =>
                        handleChange(field.id, appendText(fieldValues[field.id] ?? "", spokenText))
                      }
                    />
                  )}
                </>
              )}

              {field.type === "textarea" && (
                <>
                  <textarea
                    id={`tool-field-${field.id}`}
                    value={fieldValues[field.id] ?? ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    rows={field.rows ?? 4}
                    placeholder={field.placeholder ?? ""}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-colors"
                  />
                  {field.voiceInput && (
                    <VoiceInputAssist
                      language={speechLang}
                      disabled={locked}
                      onApply={(spokenText) =>
                        handleChange(field.id, appendText(fieldValues[field.id] ?? "", spokenText))
                      }
                    />
                  )}
                </>
              )}

              {field.type === "number" && (
                <input
                  id={`tool-field-${field.id}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={fieldValues[field.id] ?? ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-colors"
                />
              )}

              {field.type === "select" && (
                <PillSelector
                  options={field.options ?? []}
                  selected={fieldValues[field.id] ?? ""}
                  onChange={(optionValue) => handleChange(field.id, optionValue)}
                  wrap
                />
              )}
            </div>
          ))}

          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Output Language
            </label>
            <PillSelector
              options={OUTPUT_LANGUAGE_OPTIONS}
              selected={outputLanguage}
              onChange={setOutputLanguage}
              wrap
            />
          </div>

          {config?.includeContextFiles !== false && (
            <ContextFileUpload files={contextFiles} onChange={setContextFiles} />
          )}
        </div>
      </div>

      {!locked && config && (
        <button
          type="button"
          onClick={generate}
          disabled={loading || !isValid}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-2xl text-sm font-bold transition-all touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate {tool.name}
            </>
          )}
        </button>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 font-medium">
          {error}
        </div>
      )}

      {output && (
        <div id="teacher-tool-output" className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">Generated Output</h2>
            <button
              type="button"
              onClick={copyOutput}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="text-sm leading-relaxed text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl p-4 overflow-x-auto">
            <div className="prose prose-sm max-w-none prose-neutral prose-headings:mt-2 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={generate}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleNew}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 text-xs font-semibold"
            >
              New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
