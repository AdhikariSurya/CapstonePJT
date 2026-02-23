import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlannerModule } from "@/components/planner/PlannerModule";

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "Planner", href: "/planner" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Lesson Planner</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create structured lesson plans in seconds
          </p>
        </div>

        <PlannerModule />
      </main>
    </div>
  );
}
