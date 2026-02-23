"use client";

import type { Language } from "./LanguageSelector";

interface PassageData {
  sentences: string[];
}

const PASSAGES: Record<Language, PassageData> = {
  english: {
    sentences: [
      "The sun rises in the east and sets in the west.",
      "Rani went to the market to buy fresh vegetables.",
    ],
  },
  hindi: {
    sentences: [
      "सूरज पूर्व दिशा में उगता है और पश्चिम में अस्त होता है।",
      "रीमा हर दिन स्कूल समय पर जाती है।",
    ],
  },
  bengali: {
    sentences: [
      "সূর্য পূর্ব দিকে উদয় হয় এবং পশ্চিমে অস্ত যায়।",
      "রাহুল প্রতিদিন সময়মতো বিদ্যালয়ে যায়।",
    ],
  },
};

interface ReadingPassageProps {
  language: Language;
}

export function ReadingPassage({ language }: ReadingPassageProps) {
  const passage = PASSAGES[language];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
        Reading Passage
      </h3>
      <div className="space-y-4">
        {passage.sentences.map((sentence, idx) => (
          <p
            key={idx}
            className="text-lg leading-relaxed text-neutral-800 font-medium"
          >
            {idx + 1}. {sentence}
          </p>
        ))}
      </div>
    </div>
  );
}

export function getReferenceText(language: Language): string {
  return PASSAGES[language].sentences.join(" ");
}
