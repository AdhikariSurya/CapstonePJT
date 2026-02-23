"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { clsx } from "clsx";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onClear: () => void;
  hasRecording: boolean;
}

export function AudioRecorder({
  onRecordingComplete,
  onClear,
  hasRecording,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Prefer webm; fall back to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onRecordingComplete(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      alert("Could not access microphone. Please allow microphone permissions.");
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClear = () => {
    setDuration(0);
    onClear();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
        Record Audio
      </h3>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={hasRecording}
            className={clsx(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all touch-manipulation",
              hasRecording
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-red-500 text-white active:scale-[0.97] hover:bg-red-600 shadow-sm"
            )}
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-neutral-900 text-white active:scale-[0.97] hover:bg-neutral-800 shadow-sm transition-all touch-manipulation"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop Recording
          </button>
        )}

        {hasRecording && !isRecording && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 bg-neutral-50 hover:bg-neutral-100 transition-colors touch-manipulation"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Recording indicator / status */}
      {isRecording && (
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-sm font-medium text-neutral-700">
            Recording… {formatTime(duration)}
          </span>
        </div>
      )}

      {hasRecording && !isRecording && (
        <p className="text-sm text-emerald-600 font-medium">
          Recording saved — {formatTime(duration)}
        </p>
      )}
    </div>
  );
}
