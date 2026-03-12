"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PROFILE_STORAGE_KEY, type UserProfile } from "@/lib/profiles";

interface ProfileContextValue {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>("teacher");

  useEffect(() => {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored === "teacher" || stored === "student") {
      setProfileState(stored);
    }
  }, []);

  const setProfile = (nextProfile: UserProfile) => {
    setProfileState(nextProfile);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, nextProfile);
  };

  const value = useMemo(() => ({ profile, setProfile }), [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
