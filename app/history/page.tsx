"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Clock, Loader2 } from "lucide-react";
import { useProfile } from "@/components/ProfileProvider";
import { PROFILE_META } from "@/lib/profiles";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  teacherName: string;
  moduleType: "worksheet" | "planner" | "content";
  title: string;
  summary: string;
  payload: unknown;
  createdAt: string;
}

const MODULE_LABEL: Record<HistoryEntry["moduleType"], string> = {
  worksheet: "Worksheet",
  planner: "Planner",
  content: "Content",
};

export default function HistoryPage() {
  const { profile } = useProfile();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const teacherName = PROFILE_META[profile].name;
        const response = await fetch(
          `/api/history?teacherName=${encodeURIComponent(teacherName)}&limit=100`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load history");
        }
        setEntries(data.entries ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [profile]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "History", href: "/history" },
        ]}
      />

      <main className="pt-20 px-4">
        <section className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">History</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Saved generations appear here for quick teacher reference.
            </p>
          </div>

          {loading && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-sm text-neutral-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading history...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 font-medium">
              {error}
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">No saved generations yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Generate content and tap Save to history to keep it here.
              </p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/history/${entry.id}`}
                  className="block bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 hover:border-neutral-200 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold px-2 py-1 uppercase tracking-wide">
                      {MODULE_LABEL[entry.moduleType]}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-neutral-900 mt-2">{entry.title}</h2>
                  <p className="text-xs text-neutral-500 mt-1">{entry.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
