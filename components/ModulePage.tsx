import { Breadcrumbs } from "@/components/Breadcrumbs";

interface ModulePageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ModulePage({ title, description, icon }: ModulePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <Breadcrumbs 
        items={[
          { label: "Tools", href: "/" },
          { label: title.replace(" Module", ""), href: "#" }
        ]} 
      />

      {/* Main Content */}
      <main className="flex-1 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-6 text-neutral-900">
          <div className="transform scale-150">
            {icon}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">{title}</h2>
        <p className="text-neutral-500 mb-8 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
        
        <div className="px-6 py-2.5 bg-neutral-100 text-neutral-500 rounded-full text-sm font-bold tracking-wide uppercase">
          Coming Soon
        </div>
      </main>
    </div>
  );
}
