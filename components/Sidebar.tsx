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
import { useLanguage } from "@/components/LanguageProvider";
import { useProfile } from "@/components/ProfileProvider";
import { PROFILE_META, type UserProfile } from "@/lib/profiles";

// Placeholder data — replace with real data later
const PLACEHOLDER_FOLDERS = [
  { id: "1", name: "Grade 3 Worksheets" },
  { id: "2", name: "Science Activities" },
  { id: "3", name: "Math Games" },
];

interface SidebarHistoryItem {
  id: string;
  title: string;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<SidebarHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [profileSwitchOpen, setProfileSwitchOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile, setProfile } = useProfile();

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

  useEffect(() => {
    if (!historyOpen) return;

    const loadHistoryItems = async () => {
      setHistoryLoading(true);
      try {
        const teacherName = PROFILE_META[profile].name;
        const response = await fetch(
          `/api/history?teacherName=${encodeURIComponent(teacherName)}&limit=5`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load history");
        }
        const entries = Array.isArray(data.entries) ? data.entries : [];
        setHistoryItems(
          entries.map((entry: { id: string; title: string }) => ({
            id: entry.id,
            title: entry.title,
          }))
        );
      } catch {
        setHistoryItems([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    void loadHistoryItems();
  }, [historyOpen, profile]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors active:bg-neutral-200"
        aria-label={t("sidebar.openMenu")}
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
                  aria-label={t("sidebar.closeMenu")}
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
                  {t("sidebar.home")}
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
                      {t("sidebar.folders")}
                    </Link>
                    <button
                      onClick={() => setFoldersOpen((v) => !v)}
                      className="px-3 py-3 hover:bg-black/10 transition-colors rounded-r-xl"
                      aria-label={t("sidebar.toggleFolders")}
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
                      {t("sidebar.history")}
                    </Link>
                    <button
                      onClick={() => setHistoryOpen((v) => !v)}
                      className="px-3 py-3 hover:bg-black/10 transition-colors rounded-r-xl"
                      aria-label={t("sidebar.toggleHistory")}
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
                      {historyLoading && (
                        <p className="px-2 py-1.5 text-[11px] text-neutral-400">Loading history...</p>
                      )}
                      {!historyLoading && historyItems.length === 0 && (
                        <p className="px-2 py-1.5 text-[11px] text-neutral-400">No saved items</p>
                      )}
                      {!historyLoading &&
                        historyItems.map((item) => (
                          <Link
                            key={item.id}
                            href={`/history/${item.id}`}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div className="px-3 py-4 border-t border-neutral-100">
                <div className="mb-3 space-y-2">
                  <button
                    onClick={() => setProfileSwitchOpen((v) => !v)}
                    className="flex items-center justify-between gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {PROFILE_META[profile].shortLabel}
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block text-sm font-semibold text-neutral-900 truncate">
                          {PROFILE_META[profile].name}
                        </span>
                        <span className="block text-xs text-neutral-500">
                          {PROFILE_META[profile].role} {t("sidebar.profile")}
                        </span>
                      </span>
                    </span>
                    {profileSwitchOpen ? (
                      <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    )}
                  </button>

                  {profileSwitchOpen && (
                    <div className="ml-2 pl-3 border-l-2 border-neutral-100 space-y-1">
                      {(["teacher", "student"] as UserProfile[]).map((profileKey) => {
                        const active = profile === profileKey;
                        return (
                          <button
                            key={profileKey}
                            onClick={() => setProfile(profileKey)}
                            className={clsx(
                              "w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
                              active
                                ? "bg-neutral-900 text-white"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            )}
                          >
                            {PROFILE_META[profileKey].name} ({PROFILE_META[profileKey].role})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  {t("sidebar.settings")}
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-0.5">
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {t("sidebar.signOut")}
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
