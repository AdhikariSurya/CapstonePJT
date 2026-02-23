"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  FolderOpen,
  Clock,
  ChevronDown,
  ChevronRight,
  Folder,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

// Placeholder data — replace with real data later
const PLACEHOLDER_FOLDERS = [
  { id: "1", name: "Grade 3 Worksheets" },
  { id: "2", name: "Science Activities" },
  { id: "3", name: "Math Games" },
];

const PLACEHOLDER_HISTORY = [
  { id: "1", name: "Worksheet: Addition" },
  { id: "2", name: "Lesson Plan: Day 4" },
  { id: "3", name: "Audio: Phonics" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll while sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors active:bg-neutral-200"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className={clsx(
                "fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <div
              className={clsx(
                "fixed inset-y-0 left-0 w-[82%] max-w-[300px] bg-white z-[9999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              {/* Safe-area spacer — pushes content below the phone status bar */}
              <div style={{ height: "env(safe-area-inset-top, 16px)" }} />

              {/* Brand row */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                    A
                  </div>
                  <span className="font-bold text-lg text-neutral-900 tracking-tight">
                    ABCD AI
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {/* Home */}
                <Link
                  href="/"
                  className={clsx(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  Home
                </Link>

                {/* Folders — link + dropdown toggle */}
                <div>
                  <div
                    className={clsx(
                      "flex items-center rounded-xl text-sm font-medium transition-colors overflow-hidden",
                      pathname.startsWith("/folders")
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                  >
                    <Link
                      href="/folders"
                      className="flex items-center gap-3 px-3 py-3 flex-1 min-w-0"
                    >
                      <FolderOpen className="w-5 h-5 flex-shrink-0" />
                      Folders
                    </Link>
                    <button
                      onClick={() => setFoldersOpen((v) => !v)}
                      className="px-3 py-3 hover:bg-black/10 transition-colors rounded-r-xl"
                      aria-label="Toggle folders"
                    >
                      {foldersOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Folders dropdown */}
                  {foldersOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-neutral-100 pl-3">
                      {PLACEHOLDER_FOLDERS.map((folder) => (
                        <Link
                          key={folder.id}
                          href={`/folders/${folder.id}`}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                        >
                          <Folder className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{folder.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* History — link + dropdown toggle */}
                <div>
                  <div
                    className={clsx(
                      "flex items-center rounded-xl text-sm font-medium transition-colors overflow-hidden",
                      pathname.startsWith("/history")
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                  >
                    <Link
                      href="/history"
                      className="flex items-center gap-3 px-3 py-3 flex-1 min-w-0"
                    >
                      <Clock className="w-5 h-5 flex-shrink-0" />
                      History
                    </Link>
                    <button
                      onClick={() => setHistoryOpen((v) => !v)}
                      className="px-3 py-3 hover:bg-black/10 transition-colors rounded-r-xl"
                      aria-label="Toggle history"
                    >
                      {historyOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* History dropdown */}
                  {historyOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-neutral-100 pl-3">
                      {PLACEHOLDER_HISTORY.map((item) => (
                        <Link
                          key={item.id}
                          href={`/history/${item.id}`}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div className="px-3 py-4 border-t border-neutral-100">
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  Settings
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-0.5">
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  Sign Out
                </button>
                {/* Safe-area spacer at bottom */}
                <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
