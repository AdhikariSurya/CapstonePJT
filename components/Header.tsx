import Link from "next/link";
import { User } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-4 z-30">
      <div className="flex items-center gap-3">
        <Sidebar />
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            A
          </div>
          <span className="font-bold text-lg text-neutral-900 tracking-tight">ABCD AI</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
