"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { STUDENT_TOOLS } from "@/lib/studentTools";

export function StudentMoreTools() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">{t("home.studentTools")}</h2>
      <div className="grid grid-cols-2 gap-4">
        {STUDENT_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/student-tools/${tool.slug}`}
            className="group flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-600 mb-2 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-neutral-700 text-center leading-tight">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
