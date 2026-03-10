const LANGUAGE_SUBJECTS = new Set(["English", "Hindi", "Sanskrit"]);

export interface SubjectLanguageRule {
  isLanguageSubject: boolean;
  lockedOutputLanguage?: "English" | "Hindi";
}

export function getSubjectLanguageRule(subject: string): SubjectLanguageRule {
  if (!subject || !LANGUAGE_SUBJECTS.has(subject)) {
    return { isLanguageSubject: false };
  }

  if (subject === "English") {
    return { isLanguageSubject: true, lockedOutputLanguage: "English" };
  }

  // Hindi and Sanskrit both lock output to Hindi for now.
  return { isLanguageSubject: true, lockedOutputLanguage: "Hindi" };
}

export function applySubjectLanguageRule(subject: string, currentOutputLanguage: string): string {
  const rule = getSubjectLanguageRule(subject);
  return rule.lockedOutputLanguage ?? currentOutputLanguage;
}
