"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useLanguage } from "@/components/LanguageProvider";
import { ContentModule } from "@/components/content/ContentModule";

export default function ContentPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: t("common.tools"), href: "/" },
          { label: t("home.module.content.title"), href: "/content" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{t("core.content.pageTitle")}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {t("core.content.pageDesc")}
          </p>
        </div>

        <ContentModule />
      </main>
    </div>
  );
}
