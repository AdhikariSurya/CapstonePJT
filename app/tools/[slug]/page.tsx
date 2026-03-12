import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TeacherToolModule } from "@/components/tools/TeacherToolModule";
import { getTeacherToolBySlug } from "@/lib/teacherTools";

interface TeacherToolPageProps {
  params: {
    slug: string;
  };
}

export default function TeacherToolPage({ params }: TeacherToolPageProps) {
  const tool = getTeacherToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "More Tools", href: "/" },
          { label: tool.name, href: `/tools/${tool.slug}` },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{tool.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">{tool.description}</p>
        </div>

        <TeacherToolModule tool={tool} />
      </main>
    </div>
  );
}
