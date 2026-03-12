"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useLanguage } from "@/components/LanguageProvider";
import { PlannerModule } from "@/components/planner/PlannerModule";

export default function PlannerPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: t("common.tools"), href: "/" },
          { label: t("home.module.planner.title"), href: "/planner" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{t("core.planner.pageTitle")}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {t("core.planner.pageDesc")}
          </p>
        </div>

        <PlannerModule />
      </main>
    </div>
  );
}
