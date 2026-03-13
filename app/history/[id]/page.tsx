"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Loader2 } from "lucide-react";
import { WorksheetOutput } from "@/components/worksheet/WorksheetOutput";
import { PlannerOutput } from "@/components/planner/PlannerOutput";
import { ContentOutput } from "@/components/content/ContentOutput";

type ModuleType = "worksheet" | "planner" | "content";

interface HistoryEntry {
  id: string;
  teacherName: string;
  moduleType: ModuleType;
  title: string;
  summary: string;
  payload: unknown;
  createdAt: string;
}

interface WorksheetPayload {
  worksheets: Record<number, string>;
  metadata: {
    grades: number[];
    subject: string;
    topic: string;
    worksheetTypes: string[];
    questionCounts: Record<string, number>;
    generatedAt: string;
  };
}

interface PlannerPayload {
  plan: string;
  metadata: {
    grade: number;
    subject: string;
    topic: string;
    duration: number;
    generatedAt: string;
  };
}

interface ContentPayload {
  content: string;
  metadata: {
    language: string;
    contentType: string;
    description: string;
    generatedAt: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWorksheetPayload(value: unknown): value is WorksheetPayload {
  if (!isRecord(value)) return false;
  if (!isRecord(value.worksheets)) return false;
  if (!isRecord(value.metadata)) return false;
  return (
    Array.isArray(value.metadata.grades) &&
    typeof value.metadata.subject === "string" &&
    typeof value.metadata.topic === "string" &&
    Array.isArray(value.metadata.worksheetTypes) &&
    isRecord(value.metadata.questionCounts) &&
    typeof value.metadata.generatedAt === "string"
  );
}

function isPlannerPayload(value: unknown): value is PlannerPayload {
  if (!isRecord(value) || !isRecord(value.metadata)) return false;
  return (
    typeof value.plan === "string" &&
    typeof value.metadata.grade === "number" &&
    typeof value.metadata.subject === "string" &&
    typeof value.metadata.topic === "string" &&
    typeof value.metadata.duration === "number" &&
    typeof value.metadata.generatedAt === "string"
  );
}

function isContentPayload(value: unknown): value is ContentPayload {
  if (!isRecord(value) || !isRecord(value.metadata)) return false;
  return (
    typeof value.content === "string" &&
    typeof value.metadata.language === "string" &&
    typeof value.metadata.contentType === "string" &&
    typeof value.metadata.description === "string" &&
    typeof value.metadata.generatedAt === "string"
  );
}

const MODULE_LABEL: Record<ModuleType, string> = {
  worksheet: "Worksheet",
  planner: "Planner",
  content: "Content",
};

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => params?.id ?? "", [params]);
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/history/${encodeURIComponent(id)}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load history entry");
        }
        setEntry(data.entry ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load history entry");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "History", href: "/history" },
          { label: "Saved Item", href: `/history/${id}` },
        ]}
      />

      <main className="pt-20 px-4">
        <section className="max-w-3xl mx-auto space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-sm text-neutral-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading saved generation...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 font-medium">
              {error}
            </div>
          )}

          {!loading && !error && entry && (
            <>
              <article className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold px-2 py-1 uppercase tracking-wide">
                    {MODULE_LABEL[entry.moduleType]}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <h1 className="text-lg font-bold text-neutral-900 mt-2">{entry.title}</h1>
                <p className="text-sm text-neutral-500 mt-1">{entry.summary}</p>
              </article>

              {entry.moduleType === "worksheet" && isWorksheetPayload(entry.payload) && (
                <WorksheetOutput
                  worksheets={entry.payload.worksheets}
                  metadata={entry.payload.metadata}
                  readOnly
                />
              )}

              {entry.moduleType === "planner" && isPlannerPayload(entry.payload) && (
                <PlannerOutput plan={entry.payload.plan} metadata={entry.payload.metadata} readOnly />
              )}

              {entry.moduleType === "content" && isContentPayload(entry.payload) && (
                <ContentOutput
                  content={entry.payload.content}
                  metadata={entry.payload.metadata}
                  readOnly
                />
              )}

              {((entry.moduleType === "worksheet" && !isWorksheetPayload(entry.payload)) ||
                (entry.moduleType === "planner" && !isPlannerPayload(entry.payload)) ||
                (entry.moduleType === "content" && !isContentPayload(entry.payload))) && (
                <div className="bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-2xl p-4 font-medium">
                  Saved item cannot be rendered due to an unexpected payload shape.
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
