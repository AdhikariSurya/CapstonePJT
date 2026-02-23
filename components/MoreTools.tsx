import { BarChart3, FileText } from "lucide-react";

export function MoreTools() {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">More Tools</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-100 relative overflow-hidden group">
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-400">
            SOON
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 mb-3 group-hover:bg-neutral-100 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-neutral-400">Assessment</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-100 relative overflow-hidden group">
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-400">
            SOON
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 mb-3 group-hover:bg-neutral-100 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-neutral-400">Reports</span>
        </div>
      </div>
    </div>
  );
}
