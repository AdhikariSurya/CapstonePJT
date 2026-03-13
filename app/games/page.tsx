"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink, Gamepad2, GraduationCap } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useLanguage } from "@/components/LanguageProvider";
import { QuizModule } from "@/components/quiz/QuizModule";
import { TeacherQuizHub } from "@/components/quiz/TeacherQuizHub";
import { useProfile } from "@/components/ProfileProvider";

function GamesPageContent() {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isStudentQuizView = profile === "student" && mode === "quiz";
  const showStudentChooser = profile === "student" && mode !== "quiz";
  const writeRightUrl = "/games/write-right";

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: t("common.tools"), href: "/" },
          {
            label: isStudentQuizView ? t("core.quiz.pageTitle") : t("home.module.games.title"),
            href: "/games",
          },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">
            {showStudentChooser ? t("core.games.pageTitle") : t("core.quiz.pageTitle")}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {showStudentChooser ? t("core.games.pageDesc") : t("core.quiz.pageDesc")}
          </p>
        </div>

        {profile === "teacher" && <TeacherQuizHub />}

        {showStudentChooser && (
          <div className="space-y-3">
            <Link
              href="/games?mode=quiz"
              className="group flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-neutral-900">{t("core.games.quiz.title")}</h2>
                  <p className="truncate text-xs font-medium text-neutral-500">{t("core.games.quiz.desc")}</p>
                </div>
              </div>
              <Gamepad2 className="h-5 w-5 flex-shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-400" />
            </Link>

            <a
              href={writeRightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-neutral-900">{t("core.games.writeright.title")}</h2>
                  <p className="truncate text-xs font-medium text-neutral-500">
                    {t("core.games.writeright.desc")}
                  </p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 flex-shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-400" />
            </a>
          </div>
        )}

        {isStudentQuizView && (
          <div className="space-y-3">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("core.games.backToChoices")}
            </Link>
            <QuizModule />
          </div>
        )}
      </main>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <GamesPageContent />
    </Suspense>
  );
}
