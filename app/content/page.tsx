import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentModule } from "@/components/content/ContentModule";

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "Content", href: "/content" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Content Module</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Generate culturally relevant content in English, Hindi & Bengali
          </p>
        </div>

        <ContentModule />
      </main>
    </div>
  );
}
