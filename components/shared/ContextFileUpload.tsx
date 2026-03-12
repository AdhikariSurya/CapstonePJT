"use client";

import type { ChangeEvent } from "react";
import { Camera, Paperclip, X } from "lucide-react";
import {
  CONTEXT_FILE_ACCEPT,
  MAX_CONTEXT_FILES,
  MAX_CONTEXT_FILE_SIZE_BYTES,
  UploadedContextFile,
  isAllowedContextMimeType,
} from "@/lib/contextFiles";
import { useLanguage } from "@/components/LanguageProvider";

interface ContextFileUploadProps {
  files: UploadedContextFile[];
  onChange: (files: UploadedContextFile[]) => void;
  label?: string;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      const [, base64 = ""] = result.split(",");
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function ContextFileUpload({
  files,
  onChange,
  label,
}: ContextFileUploadProps) {
  const { t } = useLanguage();
  const resolvedLabel = label ?? t("shared.referenceFiles");
  const remainingSlots = Math.max(0, MAX_CONTEXT_FILES - files.length);

  const onFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selected.length === 0 || remainingSlots === 0) return;

    const accepted = selected
      .slice(0, remainingSlots)
      .filter((file) => file.size <= MAX_CONTEXT_FILE_SIZE_BYTES)
      .filter((file) => isAllowedContextMimeType(file.type));

    const loaded = await Promise.all(
      accepted.map(async (file) => ({
        name: file.name,
        mimeType: file.type,
        size: file.size,
        data: await readFileAsBase64(file),
      }))
    );

    onChange([...files, ...loaded]);
  };

  const removeFile = (name: string) => {
    onChange(files.filter((file) => file.name !== name));
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
          {resolvedLabel}
        </label>
        <span className="text-[11px] text-neutral-400">
          Max {MAX_CONTEXT_FILES} files ({Math.floor(MAX_CONTEXT_FILE_SIZE_BYTES / (1024 * 1024))}MB each)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm font-medium text-neutral-600 cursor-pointer hover:bg-neutral-100 transition-colors">
          <Paperclip className="w-4 h-4" />
          {t("shared.uploadFile")}
          <input
            type="file"
            multiple
            accept={CONTEXT_FILE_ACCEPT}
            onChange={onFileSelect}
            className="hidden"
            disabled={remainingSlots === 0}
          />
        </label>

        <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm font-medium text-neutral-600 cursor-pointer hover:bg-neutral-100 transition-colors">
          <Camera className="w-4 h-4" />
          {t("shared.useCamera")}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFileSelect}
            className="hidden"
            disabled={remainingSlots === 0}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-700 truncate">{file.name}</p>
                <p className="text-[11px] text-neutral-500">
                  {file.mimeType} • {formatSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
