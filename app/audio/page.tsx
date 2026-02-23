import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AudioModule } from "@/components/audio/AudioModule";

export default function AudioPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/" },
          { label: "Audio", href: "/audio" },
        ]}
      />

      <main className="px-4 pt-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Audio Module</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Evaluate student oral reading with AI
          </p>
        </div>

        <AudioModule />
      </main>
    </div>
  );
}
