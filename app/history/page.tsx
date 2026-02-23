import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: "History", href: "/history" }
        ]} 
      />
      
      <main className="px-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-6 text-neutral-400">
          <Clock className="w-8 h-8" />
        </div>
        
        <h2 className="text-xl font-bold text-neutral-900 mb-2">History</h2>
        <p className="text-neutral-500 mb-6 max-w-xs mx-auto">
          Your recent activities and generated content will appear here.
        </p>
        
        <div className="px-4 py-1.5 bg-neutral-100 text-neutral-400 rounded-full text-xs font-bold tracking-wide uppercase">
          Coming Soon
        </div>
      </main>
    </div>
  );
}
