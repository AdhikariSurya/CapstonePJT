export type UserProfile = "teacher" | "student";

export const PROFILE_STORAGE_KEY = "abcd-active-profile";

export const PROFILE_META: Record<
  UserProfile,
  { name: string; role: "Teacher" | "Student"; shortLabel: string }
> = {
  teacher: {
    name: "Arun Kumar",
    role: "Teacher",
    shortLabel: "AK",
  },
  student: {
    name: "Haris Raghav",
    role: "Student",
    shortLabel: "HR",
  },
};
