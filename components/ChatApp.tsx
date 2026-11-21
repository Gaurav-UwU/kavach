"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Analysis, ChatMessage, GuardContact, Language } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { loadGuard, saveGuard, normalizeIndianPhone, loadSavedLanguage, saveLanguage, clearAllSettings } from "@/lib/guard";
import { stopSpeaking } from "@/lib/speech";
import type { SampleMessage } from "@/lib/samples";
import VerdictCard from "./VerdictCard";
import QuickChips from "./QuickChips";
import InputBar, { type OutgoingMessage } from "./InputBar";
import FamilyGuardModal from "./FamilyGuardModal";
import AlertModal, { type AlertPreview } from "./AlertModal";
import LanguageGate from "./LanguageGate";
import {
  ChevronDownIcon,
  DoubleCheckIcon,
  DotsVerticalIcon,
  RestartIcon,
  ShieldAvatar,
  ShieldIcon,
  TrashIcon,
  VerifiedBadge,
} from "./icons";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  /** null = still loading prefs; true = show language gate; false = chat */
  const [gateOpen, setGateOpen] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const t = STRINGS[language];

  // Restore saved language (or show the first-run gate) + Family Guard settings.
  useEffect(() => {
    const saved = loadSavedLanguage();
    if (saved) {
      setLanguage(saved);
      setGateOpen(false);
    } else {
      setGateOpen(true);
    }
    setGuard(loadGuard());
    setWelcomeTime(Date.now());
    return () => stopSpeaking();
  }, []);

  const handleSelectLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    saveLanguage(lang);
    setWelcomeTime(Date.now());
    setGateOpen(false);
  }, []);

  // Keep the chat scrolled to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, analyzing]);

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollDown(distance > 120);
  }, []);

  const scrollToEnd = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const handleSaveGuard = useCallback((contact: GuardContact) => {
    setGuard(contact);
    saveGuard(contact);
  }, []);

  const handleClearChat = useCallback(() => {
    setMenuOpen(false);
    stopSpeaking();
    setMessages([]);
    setWelcomeTime(Date.now());
  }, []);

  /** Full reset: wipe chat, Family Guard and the language choice, then re-run onboarding. */
  const handleReset = useCallback(() => {
    setMenuOpen(false);
    stopSpeaking();
    clearAllSettings();
    setGuard(null);
    setMessages([]);
    setAlertPreview(null);
    setGuardOpen(false);
    setGateOpen(true);
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
      <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[#EFE7DE] shadow-2xl sm:h-[calc(100dvh-3rem)] sm:rounded-xl">
        {gateOpen === true && <LanguageGate onSelect={handleSelectLanguage} />}

        {gateOpen === false && (
          <>
        {/* Top header */}
        <header className="relative z-30 flex items-center gap-2.5 bg-[#075E54] px-3 py-2 text-white">
          <ShieldAvatar className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="flex items-center gap-1.5 text-[17px] font-medium">
              Kavach
              <VerifiedBadge className="h-[15px] w-[15px]" />
            </p>
            <p className="truncate text-[12.5px] text-white/85">
              {analyzing ? t.typing : t.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGuardOpen(true)}
            aria-label={t.guardTitle}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <ShieldIcon className="h-[22px] w-[22px]" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t.menuLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <DotsVerticalIcon className="h-[22px] w-[22px]" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-2 top-[calc(100%+2px)] z-40 w-60 overflow-hidden rounded-lg bg-white py-1.5 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setGuardOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] text-[#3B4A54] hover:bg-[#F5F6F6]"
                >
                  <ShieldIcon className="h-5 w-5 text-[#54656F]" />
                  {t.guardSettings}
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] text-[#3B4A54] hover:bg-[#F5F6F6]"
                >
                  <TrashIcon className="h-5 w-5 text-[#54656F]" />
                  {t.clearChat}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] text-[#3B4A54] hover:bg-[#F5F6F6]"
                >
                  <RestartIcon className="h-5 w-5 text-[#54656F]" />
                  {t.reset}
                </button>
              </div>
            </>
          )}
        </header>

        {/* Language switcher */}
        <div className="z-20 flex items-center gap-1.5 bg-[#128C7E] px-3 py-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang);
                saveLanguage(lang);
              }}
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
        <main
          ref={mainRef}
          onScroll={handleScroll}
          className="chat-pattern relative flex-1 space-y-2 overflow-y-auto px-3 py-3"
        >
          {/* Date chip */}
          <div className="flex justify-center pb-1">
            <span className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-[#54656F] shadow-sm">
              {t.today}
            </span>
          </div>

          {/* Encryption-style notice */}
          <p className="mx-auto max-w-[92%] rounded-lg bg-[#FCF4CB] px-3 py-2 text-center text-[12.5px] leading-snug text-[#54656F] shadow-sm">
            {t.encryption}
          </p>

          {/* Welcome bubble */}
          <div className="flex">
            <div className="wa-in wa-bubble max-w-[90%] rounded-lg rounded-tl-none bg-white px-2.5 py-1.5 shadow-sm">
              <p className="text-[16px] leading-relaxed text-gray-900">
                <span className="font-semibold text-[#075E54]">Kavach:</span> {t.welcome}
              </p>
              <p className="mt-0.5 text-right text-[11px] text-[#8696A0]">
                {welcomeTime !== null && formatTime(welcomeTime)}
              </p>
            </div>
          </div>

          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="wa-out wa-bubble max-w-[85%] rounded-lg rounded-tr-none bg-[#D9FDD3] px-2.5 py-1.5 shadow-sm">
                    {message.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={message.image}
                        alt=""
                        className="mb-1.5 w-full max-h-44 rounded-md object-cover"
                      />
                    )}
                    {message.text && (
                      <p className="text-[16px] leading-relaxed break-words whitespace-pre-wrap text-gray-900">
                        {message.text}
                      </p>
                    )}
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
                      {formatTime(message.createdAt)}
                      <DoubleCheckIcon className="h-3 w-[18px]" />
                    </p>
                  </div>
                </div>
              );
            }

            if (message.role === "kavach") {
              return (
                <div key={message.id} className="flex">
                  <VerdictCard
                    analysis={message.analysis}
                    lang={message.lang}
                    engine={message.engine}
                    guard={guard ?? loadGuard()}
                    time={formatTime(message.createdAt)}
                    onFixGuard={() => setGuardOpen(true)}
                  />
                </div>
              );
            }

            if (message.role === "banner") {
              return (
                <div key={message.id} className="wa-bubble flex justify-center py-1">
                  <p className="max-w-[92%] text-center text-[12.5px] leading-snug text-[#54656F]">
                    🛡️ {t.banner(message.name, message.relation)} —{" "}
                    <button
                      type="button"
                      onClick={() => openAlert(message.name, message.relation, message.summary)}
                      className="font-semibold text-[#027EB5] underline"
                    >
                      {t.viewAlert}
                    </button>
                  </p>
                </div>
              );
            }

            return (
              <div key={message.id} className="flex">
                <div className="wa-bubble rounded-lg bg-[#FFE0DE] px-3 py-2 text-[15px] text-[#8B2F28] shadow-sm">
                  ⚠️ {message.text}
                </div>
              </div>
            );
          })}

          {analyzing && (
            <div className="flex">
              <div className="wa-in wa-bubble rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                <p className="flex items-center gap-2 text-[15px] text-[#667781]">
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

          {/* Scroll-to-bottom FAB */}
          {showScrollDown && (
            <button
              type="button"
              onClick={scrollToEnd}
              aria-label="Scroll to latest"
              className="sticky bottom-1 ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#54656F] shadow-lg"
            >
              <ChevronDownIcon className="h-6 w-6" />
            </button>
          )}
        </main>

        <QuickChips language={language} disabled={analyzing} onPick={handlePickSample} />
        <InputBar language={language} disabled={analyzing} onSend={handleSend} onNotice={(msg) =>
          setMessages((prev) => [...prev, { id: newId(), role: "error", text: msg, createdAt: Date.now() }])
        } />
          </>
        )}

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
