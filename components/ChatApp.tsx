"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Analysis, ChatMessage, GuardContact, Language } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { loadGuard, saveGuard, normalizeIndianPhone } from "@/lib/guard";
import { stopSpeaking } from "@/lib/speech";
import type { SampleMessage } from "@/lib/samples";
import VerdictCard from "./VerdictCard";
import QuickChips from "./QuickChips";
import InputBar, { type OutgoingMessage } from "./InputBar";
import FamilyGuardModal from "./FamilyGuardModal";
import AlertModal, { type AlertPreview } from "./AlertModal";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatApp() {
  const [language, setLanguage] = useState<Language>("English");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [guard, setGuard] = useState<GuardContact | null>(null);
  const [guardOpen, setGuardOpen] = useState(false);
  const [alertPreview, setAlertPreview] = useState<AlertPreview | null>(null);
  const [welcomeTime, setWelcomeTime] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const t = STRINGS[language];

  // Restore Family Guard settings from localStorage on mount.
  useEffect(() => {
    setGuard(loadGuard());
    setWelcomeTime(Date.now());
    return () => stopSpeaking();
  }, []);

  // Keep the chat scrolled to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, analyzing]);

  const handleSaveGuard = useCallback((contact: GuardContact) => {
    setGuard(contact);
    saveGuard(contact);
  }, []);

  const analyze = useCallback(
    async (payload: { text?: string; imageBase64?: string }) => {
      const activeGuard = guard ?? loadGuard();
      setAnalyzing(true);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, language }),
        });
        if (!response.ok) throw new Error(`API ${response.status}`);
        const analysis = (await response.json()) as Analysis & { engine?: "gemini" | "heuristic" };
        const engine = analysis.engine === "gemini" ? "gemini" : "heuristic";

        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "kavach",
            analysis,
            lang: language,
            engine,
            createdAt: Date.now(),
          },
        ]);

        // Auto-Alert: on HIGH_RISK with the toggle ON, raise the family banner.
        if (analysis.verdict === "HIGH_RISK" && activeGuard.autoAlert) {
          setMessages((prev) => [
            ...prev,
            {
              id: newId(),
              role: "banner",
              name: activeGuard.name,
              relation: activeGuard.relation,
              summary: analysis.familyAlertSummary,
              createdAt: Date.now(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "error", text: STRINGS[language].errorGeneric, createdAt: Date.now() },
        ]);
      } finally {
        setAnalyzing(false);
      }
    },
    [guard, language],
  );

  const handleSend = useCallback(
    (outgoing: OutgoingMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "user",
          text: outgoing.text,
          image: outgoing.imageBase64,
          createdAt: Date.now(),
        },
      ]);
      void analyze(outgoing);
    },
    [analyze],
  );

  const handlePickSample = useCallback(
    (sample: SampleMessage) => {
      handleSend({ text: sample.text });
    },
    [handleSend],
  );

  const openAlert = useCallback(
    (name: string, relation: string, summary: string) => {
      const digits = normalizeIndianPhone(guard?.phone ?? "") ?? "";
      setAlertPreview({ name, relation, phone: digits, summary });
    },
    [guard],
  );

  return (
    <div className="flex min-h-dvh items-stretch justify-center bg-[#0b141a] sm:p-6">
      <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[#ECE5DD] shadow-2xl sm:h-[calc(100dvh-3rem)] sm:rounded-xl">
        {/* Top header */}
        <header className="flex items-center gap-3 bg-[#075E54] px-3 py-2.5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl">
            🛡️
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-[16px] font-semibold">
              Kavach
              <span aria-hidden className="text-[#25D366]">✔</span>
            </p>
            <p className="text-xs text-white/80">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setGuardOpen(true)}
            aria-label={t.guardTitle}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-white/10"
          >
            🛡️
          </button>
        </header>

        {/* Language switcher */}
        <div className="flex items-center gap-1.5 bg-[#128C7E] px-3 py-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`rounded-full px-3 py-1 text-[13px] font-semibold transition-colors ${
                language === lang
                  ? "bg-white text-[#075E54]"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {lang === "Hindi" ? "हिंदी" : lang}
            </button>
          ))}
        </div>

        {/* Chat canvas */}
        <main className="chat-pattern flex-1 space-y-2 overflow-y-auto px-3 py-3">
          {/* Welcome bubble */}
          <div className="flex">
            <div className="max-w-[90%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-[16px] leading-relaxed text-gray-900 shadow-sm">
              <p>
                <span className="font-semibold text-[#075E54]">Kavach:</span> {t.welcome}
              </p>
              <p className="mt-1.5 text-right text-[11px] text-gray-400">
                {welcomeTime !== null && formatTime(welcomeTime)}
              </p>
            </div>
          </div>
          <p className="px-1 text-center text-[11px] text-gray-500">{t.disclaimer}</p>

          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg rounded-tr-none bg-[#DCF8C6] px-3 py-2 shadow-sm">
                    {message.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={message.image}
                        alt=""
                        className="mb-1.5 max-h-44 w-full rounded-md object-cover"
                      />
                    )}
                    {message.text && (
                      <p className="text-[16px] leading-relaxed break-words whitespace-pre-wrap text-gray-900">
                        {message.text}
                      </p>
                    )}
                    <p className="mt-0.5 text-right text-[11px] text-gray-500">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            }

            if (message.role === "kavach") {
              return (
                <div key={message.id} className="flex">
                  <div className="max-w-[94%] rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                    <VerdictCard
                      analysis={message.analysis}
                      lang={message.lang}
                      engine={message.engine}
                      guard={guard ?? loadGuard()}
                      onFixGuard={() => setGuardOpen(true)}
                    />
                    <p className="mt-1.5 text-right text-[11px] text-gray-400">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            }

            if (message.role === "banner") {
              return (
                <div key={message.id} className="flex justify-center py-1">
                  <button
                    type="button"
                    onClick={() => openAlert(message.name, message.relation, message.summary)}
                    className="rounded-full border border-[#075E54]/30 bg-[#E7FFDB] px-3 py-1.5 text-[13px] font-medium text-[#075E54] shadow-sm transition-colors hover:bg-[#d8f5c8]"
                  >
                    🛡️ {t.banner(message.name, message.relation)} —{" "}
                    <span className="font-bold underline">{t.viewAlert}</span>
                  </button>
                </div>
              );
            }

            return (
              <div key={message.id} className="flex">
                <div className="rounded-lg bg-red-50 px-3 py-2 text-[15px] text-red-700 shadow-sm">
                  ⚠️ {message.text}
                </div>
              </div>
            );
          })}

          {analyzing && (
            <div className="flex">
              <div className="rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                <p className="flex items-center gap-2 text-[15px] text-gray-600">
                  {t.analyzing}
                  <span className="flex gap-1">
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#25D366] [animation-delay:0ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#25D366] [animation-delay:150ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#25D366] [animation-delay:300ms]" />
                  </span>
                </p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </main>

        <QuickChips language={language} disabled={analyzing} onPick={handlePickSample} />
        <InputBar language={language} disabled={analyzing} onSend={handleSend} onNotice={(msg) =>
          setMessages((prev) => [...prev, { id: newId(), role: "error", text: msg, createdAt: Date.now() }])
        } />

        <FamilyGuardModal
          open={guardOpen}
          language={language}
          guard={guard ?? loadGuard()}
          onSave={handleSaveGuard}
          onClose={() => setGuardOpen(false)}
        />
        <AlertModal
          open={alertPreview !== null}
          language={language}
          alert={alertPreview}
          onClose={() => setAlertPreview(null)}
        />
      </div>
    </div>
  );
}
