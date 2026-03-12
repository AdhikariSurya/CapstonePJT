"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useLanguage } from "@/components/LanguageProvider";
import { QuizModule } from "@/components/quiz/QuizModule";

export default function GamesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: t("common.tools"), href: "/" },
          { label: t("core.quiz.pageTitle"), href: "/games" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{t("core.quiz.pageTitle")}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {t("core.quiz.pageDesc")}
          </p>
        </div>

        <QuizModule />
      </main>
    </div>
  );
}
