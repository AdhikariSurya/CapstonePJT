export interface UploadedContextFile {
  name: string;
  mimeType: string;
  data: string; // base64 payload (without data: prefix)
  size: number;
}

export const MAX_CONTEXT_FILES = 3;
export const MAX_CONTEXT_FILE_SIZE_BYTES = 8 * 1024 * 1024;
export const CONTEXT_FILE_ACCEPT = "image/*,.pdf,.txt,.md,.csv";

const ALLOWED_TEXT_MIME_TYPES = new Set(["text/plain", "text/markdown", "text/csv"]);

export function isAllowedContextMimeType(mimeType: string): boolean {
  if (!mimeType) return false;
  if (mimeType.startsWith("image/")) return true;
  if (mimeType === "application/pdf") return true;
  return ALLOWED_TEXT_MIME_TYPES.has(mimeType);
}

export function sanitizeContextFiles(input: unknown): UploadedContextFile[] {
  if (!Array.isArray(input)) return [];

  return input
    .slice(0, MAX_CONTEXT_FILES)
    .filter((file): file is UploadedContextFile => {
      if (!file || typeof file !== "object") return false;
      const candidate = file as UploadedContextFile;
      return (
        typeof candidate.name === "string" &&
        typeof candidate.mimeType === "string" &&
        typeof candidate.data === "string" &&
        typeof candidate.size === "number"
      );
    })
    .filter((file) => file.size > 0 && file.size <= MAX_CONTEXT_FILE_SIZE_BYTES)
    .filter((file) => file.data.length > 0)
    .filter((file) => isAllowedContextMimeType(file.mimeType));
}

export function buildGeminiInput(prompt: string, files: UploadedContextFile[]) {
  if (files.length === 0) return prompt;

  const fileNames = files.map((file) => file.name).join(", ");
  return [
    {
      text: `${prompt}\n\nAdditional context files are attached: ${fileNames}. Use them while generating the response.`,
    },
    ...files.map((file) => ({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data,
      },
    })),
  ];
}
