"use client";

import { FileText, BookOpen, Gamepad2, Calendar, Mic } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { MoreTools } from "@/components/MoreTools";
import { StudentMoreTools } from "@/components/StudentMoreTools";
import { useLanguage } from "@/components/LanguageProvider";
import { useProfile } from "@/components/ProfileProvider";
import { PROFILE_META } from "@/lib/profiles";

export function HomeDashboard() {
  const { profile } = useProfile();
  const { t } = useLanguage();

  if (profile === "student") {
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <main className="pt-20 px-4 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
              {PROFILE_META.student.name} - {t("home.studentDashboard")}
            </h2>
            <div className="space-y-3">
              <ModuleCard
                href="/games"
                icon={<Gamepad2 className="w-6 h-6 text-violet-600" />}
                title={t("home.module.games.title")}
                description={t("home.module.games.description")}
              />
              <ModuleCard
                href="/audio"
                icon={<Mic className="w-6 h-6 text-rose-600" />}
                title={t("home.module.audio.title")}
                description={t("home.module.audio.description")}
              />
            </div>
          </section>

          <section>
            <StudentMoreTools />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="pt-20 px-4 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">{t("home.coreModules")}</h2>
          <div className="space-y-3">
            <ModuleCard
              href="/worksheet"
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              title={t("home.module.worksheet.title")}
              description={t("home.module.worksheet.description")}
            />
            <ModuleCard
              href="/content"
              icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
              title={t("home.module.content.title")}
              description={t("home.module.content.description")}
            />
            <ModuleCard
              href="/games"
              icon={<Gamepad2 className="w-6 h-6 text-violet-600" />}
              title={t("home.module.games.title")}
              description={t("home.module.games.description")}
            />
            <ModuleCard
              href="/planner"
              icon={<Calendar className="w-6 h-6 text-orange-600" />}
              title={t("home.module.planner.title")}
              description={t("home.module.planner.description")}
            />
            <ModuleCard
              href="/audio"
              icon={<Mic className="w-6 h-6 text-rose-600" />}
              title={t("home.module.audio.title")}
              description={t("home.module.audio.description")}
            />
          </div>
        </section>

        <section>
          <MoreTools />
        </section>
      </main>
    </div>
  );
}
