"use client";

import type { Language } from "@/lib/types";
import { ChevronRightIcon, ShieldAvatar, VerifiedBadge } from "./icons";

interface LanguageGateProps {
  onSelect: (language: Language) => void;
}

/**
 * First-run language gate, modeled on WhatsApp's own "choose your language"
 * onboarding screen. Titles are shown in multiple scripts because no language
 * has been chosen yet — the list itself is the answer.
 */
const OPTIONS: Array<{ value: Language; native: string; subtitle: string }> = [
  { value: "English", native: "English", subtitle: "Default" },
  { value: "Hindi", native: "हिंदी", subtitle: "Hindi" },
  { value: "Marathi", native: "मराठी", subtitle: "Marathi" },
  { value: "Hinglish", native: "Hinglish", subtitle: "हिंदी + English" },
];

export default function LanguageGate({ onSelect }: LanguageGateProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#EFE7DE]">
      <div className="flex flex-col items-center gap-2 bg-[#075E54] px-6 pb-10 pt-12 text-center text-white">
        <ShieldAvatar className="h-20 w-20" />
        <p className="flex items-center gap-2 text-2xl font-medium">
          Kavach
          <VerifiedBadge className="h-5 w-5" />
        </p>
        <p className="text-[15px] text-white/90">Check before you click</p>
        <p className="text-[13px] leading-relaxed text-white/70">
          क्लिक करने से पहले जाँचें · क्लिक करण्यापूर्वी तपासा
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <p className="mb-3 text-center text-[13px] font-medium text-[#54656F]">
          अपनी भाषा चुनें · तुमची भाषा निवडा · Choose your language
        </p>
        <div className="space-y-2 pb-6">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:bg-[#F0F2F5]"
            >
              <span>
                <span className="block text-[17px] font-medium text-[#111B21]">
                  {option.native}
                </span>
                <span className="block text-[13px] text-[#667781]">{option.subtitle}</span>
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#8696A0]" />
            </button>
          ))}
        </div>
        <p className="pb-6 text-center text-[11px] text-[#8696A0]">
          You can change this anytime from the language bar. · भाषा बाद में भी बदल सकते हैं।
        </p>
      </div>
    </div>
  );
}
