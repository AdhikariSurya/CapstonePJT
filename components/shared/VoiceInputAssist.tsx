"use client";

import { useMemo, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface VoiceInputAssistProps {
  onApply: (text: string) => void;
  disabled?: boolean;
  language?: string;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  const maybeCtor = (
    window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    }
  ).SpeechRecognition;
  if (maybeCtor) return maybeCtor;
  return (
    window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    }
  ).webkitSpeechRecognition ?? null;
}

export function VoiceInputAssist({ onApply, disabled = false, language = "en-IN" }: VoiceInputAssistProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");

  const isSupported = useMemo(() => Boolean(getSpeechRecognitionCtor()), []);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    if (!isSupported || disabled) return;
    setError(null);

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError(t("shared.voiceUnsupported"));
      return;
    }

    const recognition = new Ctor();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      // Rebuild transcript from current recognition state to avoid duplicated stacking.
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = (result?.[0]?.transcript ?? "").trim();
        if (!piece) continue;
        if (result.isFinal) finalText += `${piece} `;
        else interimText += `${piece} `;
      }

      finalTranscriptRef.current = finalText.trim();
      setDraftText(`${finalTranscriptRef.current} ${interimText.trim()}`.trim());
    };

    recognition.onerror = (event) => {
      setError(
        event.error ? `${t("shared.voiceErrorPrefix")}: ${event.error}` : t("shared.voiceFailed")
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    finalTranscriptRef.current = "";
    recognition.start();
    setIsListening(true);
  };

  const applyText = () => {
    const clean = draftText.trim();
    if (!clean) return;
    onApply(clean);
    setDraftText("");
    setOpen(false);
    setError(null);
    stopListening();
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled || !isSupported}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-800 disabled:opacity-40"
      >
        <Mic className="w-3.5 h-3.5" />
        {t("shared.voiceInput")}
      </button>

      {open && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            {!isListening ? (
              <button
                type="button"
                onClick={startListening}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold"
              >
                <Mic className="w-3.5 h-3.5" />
                {t("common.start")}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopListening}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold"
              >
                <MicOff className="w-3.5 h-3.5" />
                {t("common.stop")}
              </button>
            )}
            <span className="text-[11px] text-neutral-500">
              {isListening ? t("shared.listening") : t("shared.tapStartSpeak")}
            </span>
          </div>

          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={3}
            placeholder={t("shared.voicePlaceholder")}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 resize-none"
          />

          {error && <p className="text-[11px] text-red-600">{error}</p>}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={applyText}
              disabled={!draftText.trim()}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold disabled:opacity-40"
            >
              {t("common.insert")}
            </button>
            <button
              type="button"
              onClick={() => {
                stopListening();
                setDraftText("");
                setOpen(false);
                setError(null);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 text-xs font-semibold"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
