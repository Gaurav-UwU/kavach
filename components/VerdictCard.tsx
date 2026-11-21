"use client";

import { useState } from "react";
import type { Analysis, GuardContact, Language } from "@/lib/types";
import { STRINGS, VERDICT_DOT } from "@/lib/i18n";
import { speak, stopSpeaking } from "@/lib/speech";

interface VerdictCardProps {
  analysis: Analysis;
  /** Language the analysis was generated in (drives voice + labels). */
  lang: Language;
  engine: "gemini" | "heuristic";
  guard: GuardContact;
  time: string;
  /** True once the alert has been delivered — hides the manual send button. */
  alertDelivered: boolean;
  /** Delivers the redacted alert into the conversation (simulated send). */
  onSendAlert: (familyAlertSummary: string) => void;
}

/**
 * A Kavach verdict rendered the way an official WhatsApp Business bot would send
 * it (Cloud API "interactive message"): a plain-text bubble using WhatsApp's own
 * formatting conventions (*bold*, _italic_, typed "•" bullets, emoji status dot),
 * with quick-reply buttons attached BELOW the bubble — because buttons inside a
 * chat bubble are impossible in real WhatsApp.
 */
export default function VerdictCard({
  analysis,
  lang,
  engine,
  guard,
  time,
  alertDelivered,
  onSendAlert,
}: VerdictCardProps) {
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
    onSendAlert(analysis.familyAlertSummary);
  };

  // Listen is always available on HIGH_RISK/CAUTION. Manual send appears only
  // when the alert wasn't already auto-delivered (Auto-Alert OFF, or no valid
  // contact set at analysis time).
  const showListen = analysis.verdict !== "LIKELY_SAFE";
  const showSend = showListen && !alertDelivered;

  return (
    <div className="wa-bubble max-w-[94%]">
      {/* Message body — indistinguishable from a plain WhatsApp text message */}
      <div className="wa-in rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
        <div className="space-y-1.5 text-[15.5px] leading-relaxed text-[#111B21]">
          <p className="font-bold">
            {VERDICT_DOT[analysis.verdict]} {t.verdictLabel[analysis.verdict]}
          </p>
          <p className="text-[13.5px] italic text-[#667781]">{analysis.scamType}</p>
          <p className="pt-0.5 font-semibold">{t.why}</p>
          {analysis.reasons.map((reason, i) => (
            <p key={i}>• {reason}</p>
          ))}
          <p className="pt-0.5 font-semibold">{t.doNow}</p>
          <p>{analysis.nextAction}</p>
        </div>
        <p className="mt-1 text-right text-[11px] text-[#8696A0]">{time}</p>
      </div>

      {/* Quick-reply buttons — WhatsApp Business style, below the bubble.
          Listen is always available on HIGH_RISK/CAUTION; manual send only
          until the alert has been delivered. */}
      {showListen && (
        <div className="mt-1 space-y-1">
          <button
            type="button"
            onClick={handleListen}
            className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
          >
            {speaking ? t.stopListening : `🔊 ${t.listen}`}
          </button>
          {showSend && (
            <button
              type="button"
              onClick={handleSendAlert}
              className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
            >
              {t.sendToGuard(guard.name)}
            </button>
          )}
        </div>
      )}

      {engine === "heuristic" && (
        <p className="mt-1 pl-1 text-[11px] text-[#8696A0]">⚡ {t.offlineNote}</p>
      )}
    </div>
  );
}
