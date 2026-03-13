"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";

interface SaveToHistoryActionProps {
  onSave: () => Promise<void>;
  resetKey: string;
}

export function SaveToHistoryAction({ onSave, resetKey }: SaveToHistoryActionProps) {
  const [shouldSave, setShouldSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setShouldSave(false);
    setSaving(false);
    setSaved(false);
    setError(null);
  }, [resetKey]);

  const handleSave = async () => {
    if (!shouldSave || saving || saved) return;

    setSaving(true);
    setError(null);

    try {
      await onSave();
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save to history.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <input
          id={`save-history-${resetKey}`}
          type="checkbox"
          checked={shouldSave}
          onChange={(event) => setShouldSave(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
          disabled={saving || saved}
        />
        <div className="flex-1 min-w-0">
          <label
            htmlFor={`save-history-${resetKey}`}
            className="text-sm font-semibold text-neutral-800 cursor-pointer"
          >
            Save this generation to History
          </label>
          <p className="text-xs text-neutral-500 mt-0.5">
            Optional. Save only when you want to keep this output for later.
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!shouldSave || saving || saved}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : saved ? "Saved to history" : "Save now"}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            Saved
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
