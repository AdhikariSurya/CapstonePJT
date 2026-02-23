import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ModuleCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ModuleCard({ href, icon, title, description }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 active:scale-[0.98] active:bg-neutral-50 transition-all touch-manipulation hover:shadow-md"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-50 text-neutral-900 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-neutral-900 leading-tight mb-0.5">{title}</h3>
          <p className="text-xs text-neutral-500 font-medium truncate">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-400 flex-shrink-0 ml-2" />
    </Link>
  );
}
