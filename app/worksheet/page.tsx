import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WorksheetModule } from "@/components/worksheet/WorksheetModule";

export default function WorksheetPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "Worksheet", href: "/worksheet" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Worksheet Module</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Generate differentiated worksheets for multiple grades in one go
          </p>
        </div>

        <WorksheetModule />
      </main>
    </div>
  );
}
