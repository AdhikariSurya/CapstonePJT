import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuizModule } from "@/components/quiz/QuizModule";

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "Dynamic Quiz", href: "/games" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Dynamic Quiz</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Adaptive question flow with one-shot quiz generation
          </p>
        </div>

        <QuizModule />
      </main>
    </div>
  );
}
