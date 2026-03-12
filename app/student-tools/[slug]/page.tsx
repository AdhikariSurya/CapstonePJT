import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StudentToolModule } from "@/components/studentTools/StudentToolModule";
import { getStudentToolBySlug } from "@/lib/studentTools";

interface StudentToolPageProps {
  params: {
    slug: string;
  };
}

export default function StudentToolPage({ params }: StudentToolPageProps) {
  const tool = getStudentToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "Student Tools", href: "/" },
          { label: tool.name, href: `/student-tools/${tool.slug}` },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{tool.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">{tool.description}</p>
        </div>

        <StudentToolModule tool={tool} />
      </main>
    </div>
  );
}
