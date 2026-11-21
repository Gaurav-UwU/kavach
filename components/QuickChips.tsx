"use client";

import type { Language } from "@/lib/types";
import type { SampleMessage } from "@/lib/samples";
import { SAMPLE_MESSAGES } from "@/lib/samples";
import { STRINGS } from "@/lib/i18n";

interface QuickChipsProps {
  language: Language;
  disabled?: boolean;
  onPick: (sample: SampleMessage) => void;
}

export default function QuickChips({ language, disabled, onPick }: QuickChipsProps) {
  const t = STRINGS[language];
  return (
    <div className="border-t border-black/5 bg-[#F6F4EF]/95 px-3 pt-2 pb-1 backdrop-blur">
      <p className="px-1 pb-1.5 text-[11px] font-medium text-gray-500">{t.chipsTitle}</p>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1.5">
        {SAMPLE_MESSAGES.map((sample) => (
          <button
            key={sample.label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(sample)}
            className="shrink-0 rounded-full border border-[#128C7E]/30 bg-white px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-[#075E54] shadow-sm transition-colors hover:bg-[#E7FFDB] disabled:opacity-50"
          >
            {sample.emoji} {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
