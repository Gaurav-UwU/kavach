"use client";

import { useState } from "react";
import type { Analysis, GuardContact, Language } from "@/lib/types";
import { STRINGS, VERDICT_DOT } from "@/lib/i18n";
import { speak, stopSpeaking } from "@/lib/speech";
import { buildWaMeLink, normalizeIndianPhone } from "@/lib/guard";

interface VerdictCardProps {
  analysis: Analysis;
  /** Language the analysis was generated in (drives voice + labels). */
  lang: Language;
  engine: "gemini" | "heuristic";
  guard: GuardContact;
  /** Called when the trusted contact has no valid phone and must be fixed first. */
  onFixGuard: () => void;
}

const PILL_STYLES: Record<Analysis["verdict"], string> = {
  HIGH_RISK: "bg-red-100 text-red-800 border-red-300",
  CAUTION: "bg-amber-100 text-amber-900 border-amber-300",
  LIKELY_SAFE: "bg-green-100 text-green-800 border-green-300",
};

export default function VerdictCard({ analysis, lang, engine, guard, onFixGuard }: VerdictCardProps) {
  const t = STRINGS[lang];
  const [speaking, setSpeaking] = useState(false);

  const handleListen = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const speech = [
      `${VERDICT_DOT[analysis.verdict]} ${t.verdictLabel[analysis.verdict]}`,
      analysis.scamType,
      t.why,
      ...analysis.reasons,
      t.doNow,
      analysis.nextAction,
    ].join(". ");
    if (speak(speech, lang)) setSpeaking(true);
  };

  const handleSendAlert = () => {
    const digits = normalizeIndianPhone(guard.phone);
    if (!digits) {
      onFixGuard();
      return;
    }
    window.open(
      buildWaMeLink({ ...guard, phone: digits }, analysis.familyAlertSummary),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const showActions = analysis.verdict !== "LIKELY_SAFE";

  return (
    <div className="space-y-2 text-[16px] leading-relaxed text-gray-900">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${PILL_STYLES[analysis.verdict]}`}
      >
        <span aria-hidden>{VERDICT_DOT[analysis.verdict]}</span>
        {t.verdictLabel[analysis.verdict]}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {analysis.scamType}
      </p>

      <p className="font-bold">{t.why}</p>
      <ul className="list-disc space-y-1 pl-5">
        {analysis.reasons.map((reason, i) => (
          <li key={i}>{reason}</li>
        ))}
      </ul>

      <p className="font-bold">{t.doNow}</p>
      <p>{analysis.nextAction}</p>

      {showActions && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleListen}
            className="rounded-full bg-[#075E54] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0a7a6d] active:scale-95"
          >
            {speaking ? `⏹ ${t.stopListening}` : `🔊 ${t.listen}`}
          </button>
          <button
            type="button"
            onClick={handleSendAlert}
            className="rounded-full bg-[#25D366] px-3.5 py-2 text-sm font-semibold text-[#07341c] shadow-sm transition-colors hover:bg-[#1fb959] active:scale-95"
          >
            📲 {t.sendAlert}
          </button>
        </div>
      )}

      {engine === "heuristic" && (
        <p className="pt-0.5 text-[11px] text-gray-400">⚡ {t.offlineNote}</p>
      )}
    </div>
  );
}
