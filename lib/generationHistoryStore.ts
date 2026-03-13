import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type GenerationModule = "worksheet" | "planner" | "content";

export interface SaveGenerationHistoryInput {
  teacherName: string;
  moduleType: GenerationModule;
  title: string;
  summary: string;
  payload: unknown;
}

export interface GenerationHistoryEntry {
  id: string;
  teacherName: string;
  moduleType: GenerationModule;
  title: string;
  summary: string;
  payload: unknown;
  createdAt: string;
}

interface GenerationHistoryRow {
  id: string;
  teacher_name: string;
  module_type: GenerationModule;
  title: string;
  summary: string;
  payload_json: unknown;
  created_at: string;
}

function rowToEntry(row: GenerationHistoryRow): GenerationHistoryEntry {
  return {
    id: row.id,
    teacherName: row.teacher_name,
    moduleType: row.module_type,
    title: row.title,
    summary: row.summary,
    payload: row.payload_json,
    createdAt: row.created_at,
  };
}

export async function saveGenerationHistory(input: SaveGenerationHistoryInput) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("generation_history")
    .insert({
      teacher_name: input.teacherName.trim(),
      module_type: input.moduleType,
      title: input.title.trim(),
      summary: input.summary.trim(),
      payload_json: input.payload,
    })
    .select("id, teacher_name, module_type, title, summary, payload_json, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return rowToEntry(data as GenerationHistoryRow);
}

export async function listGenerationHistory(options?: { teacherName?: string; limit?: number }) {
  const supabase = getSupabaseAdmin();
  const limit = Math.min(Math.max(options?.limit ?? 25, 1), 100);

  let query = supabase
    .from("generation_history")
    .select("id, teacher_name, module_type, title, summary, payload_json, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.teacherName && options.teacherName.trim().length > 0) {
    query = query.eq("teacher_name", options.teacherName.trim());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => rowToEntry(row as GenerationHistoryRow));
}

export async function getGenerationHistoryById(id: string) {
  const supabase = getSupabaseAdmin();
  const normalizedId = id.trim();
  if (!normalizedId) return null;

  const { data, error } = await supabase
    .from("generation_history")
    .select("id, teacher_name, module_type, title, summary, payload_json, created_at")
    .eq("id", normalizedId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }
  if (!data) return null;

  return rowToEntry(data as GenerationHistoryRow);
}
