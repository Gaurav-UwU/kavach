"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Analysis, ChatMessage, GuardContact, Language } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { loadGuard, saveGuard, normalizeIndianPhone, loadSavedLanguage, saveLanguage, clearAllSettings, isDefaultGuard } from "@/lib/guard";
import { stopSpeaking } from "@/lib/speech";
import type { SampleMessage } from "@/lib/samples";
import VerdictCard from "./VerdictCard";
import QuickChips from "./QuickChips";
import InputBar, { type OutgoingMessage } from "./InputBar";
import FamilyGuardModal from "./FamilyGuardModal";
import {
  ChevronDownIcon,
  DoubleCheckIcon,
  DotsVerticalIcon,
  RestartIcon,
  ShieldAvatar,
  ShieldIcon,
  StatusIcons,
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

function formatClock(ts: number): string {
  // Status-bar style clock: no AM/PM suffix.
  return new Date(ts)
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .replace(/\s?(am|pm)\.?/i, "");
}

const NATIVE_LABEL: Record<Language, string> = {
  English: "English",
  Hindi: "हिंदी",
  Marathi: "मराठी",
  Hinglish: "Hinglish",
};

/** Maps a typed onboarding reply ("2", "hindi", "मराठी", …) to a language. */
function matchLanguageInput(raw: string): Language | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  if (/^4$/.test(s) || /hinglish|हिंग्लिश/.test(s)) return "Hinglish";
  if (/^3$/.test(s) || /marathi|मराठी/.test(s)) return "Marathi";
  if (/^2$/.test(s) || /hindi|हिंदी/.test(s)) return "Hindi";
  if (/^1$/.test(s) || /english/.test(s)) return "English";
  return null;
}

export default function ChatApp() {
  const [language, setLanguage] = useState<Language>("English");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [guard, setGuard] = useState<GuardContact | null>(null);
  const [guardOpen, setGuardOpen] = useState(false);
  const [welcomeTime, setWelcomeTime] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  /** null = still loading prefs; true = language chosen; false = onboarding in chat */
  const [languageKnown, setLanguageKnown] = useState<boolean | null>(null);
  /** First-run intro bubble (Kavach greeting) stays in the conversation. */
  const [onboardVisible, setOnboardVisible] = useState(false);
  /** Language question bubble + quick replies (first run, or re-opened via menu). */
  const [askLanguage, setAskLanguage] = useState(false);
  /** Skip the generic welcome bubble in the session right after onboarding. */
  const [freshOnboard, setFreshOnboard] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const t = STRINGS[language];

  // Restore saved language (or start the in-chat onboarding) + Family Guard settings.
  useEffect(() => {
    const saved = loadSavedLanguage();
    if (saved) {
      setLanguage(saved);
      setLanguageKnown(true);
      setOnboardVisible(false);
      setAskLanguage(false);
    } else {
      setLanguageKnown(false);
      setOnboardVisible(true);
      setAskLanguage(true);
    }
    setGuard(loadGuard());
    setWelcomeTime(Date.now());
    return () => stopSpeaking();
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

  const handleSaveGuard = useCallback(
    (contact: GuardContact) => {
      setGuard(contact);
      saveGuard(contact);
      // Confirm the change in the conversation, in the current language.
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "kavach-note",
          text: STRINGS[language].guardUpdatedConfirm(contact.name, contact.relation, contact.phone),
          createdAt: Date.now(),
        },
      ]);
    },
    [language],
  );

  /** User confirmed keeping the current (default) Family Guard contact. */
  const handleKeepGuard = useCallback(
    (name: string, relation: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "kavach-note",
          text: STRINGS[language].guardKeepConfirm(name, relation),
          createdAt: Date.now(),
        },
      ]);
    },
    [language],
  );

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
    setGuardOpen(false);
    setLanguage("English");
    setLanguageKnown(false);
    setOnboardVisible(true);
    setAskLanguage(true);
    setFreshOnboard(false);
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

        // Auto-Alert: on HIGH_RISK with the toggle ON, deliver the alert to the
        // Family Guard automatically — no tap needed.
        const digits = normalizeIndianPhone(activeGuard.phone);
        const autoDeliver =
          analysis.verdict === "HIGH_RISK" && activeGuard.autoAlert && digits !== null;

        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "kavach",
            analysis,
            lang: language,
            engine,
            alertDelivered: autoDeliver,
            createdAt: Date.now(),
          },
        ]);

        if (autoDeliver && digits) {
          setMessages((prev) => [
            ...prev,
            {
              id: newId(),
              role: "alert-sent",
              text: analysis.familyAlertSummary,
              toName: activeGuard.name,
              toRelation: activeGuard.relation,
              phone: digits,
              createdAt: Date.now(),
            },
          ]);
        } else if (analysis.verdict === "HIGH_RISK" && activeGuard.autoAlert && !digits) {
          setMessages((prev) => [
            ...prev,
            {
              id: newId(),
              role: "kavach-note",
              text: STRINGS[language].autoAlertNoContact,
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

  /** Delivers the redacted alert into the conversation as an outgoing message. */
  const handleSendAlertToGuard = useCallback(
    (kavachId: string, summary: string) => {
      const activeGuard = guard ?? loadGuard();
      const digits = normalizeIndianPhone(activeGuard.phone);
      if (!digits) {
        // No valid contact yet — ask the user to set one up first.
        setGuardOpen(true);
        return;
      }
      // Mark the originating verdict so its manual send button disappears.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === kavachId && m.role === "kavach" ? { ...m, alertDelivered: true } : m,
        ),
      );
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "alert-sent",
          text: summary,
          toName: activeGuard.name,
          toRelation: activeGuard.relation,
          phone: digits,
          createdAt: Date.now(),
        },
      ]);
    },
    [guard],
  );

  /** Records the language choice as a natural chat exchange, then confirms in that language. */
  const handleLanguageChoice = useCallback(
    (lang: Language, displayText: string) => {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", text: displayText, createdAt: Date.now() },
      ]);
      setLanguage(lang);
      saveLanguage(lang);
      setLanguageKnown(true);
      const firstChoice = !freshOnboard;
      setFreshOnboard(true);
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "kavach-note", text: STRINGS[lang].onboardConfirm, createdAt: Date.now() },
      ]);

      // First-time setup: check the Family Guard contact used for WhatsApp alerts,
      // then tell the user about the menu command.
      if (firstChoice) {
        const g = guard ?? loadGuard();
        if (isDefaultGuard(g)) {
          setMessages((prev) => [
            ...prev,
            {
              id: newId(),
              role: "actions",
              kind: "guard-setup",
              name: g.name,
              relation: g.relation,
              phone: g.phone,
              createdAt: Date.now(),
            },
          ]);
        }
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "kavach-note", text: STRINGS[lang].menuTip, createdAt: Date.now() },
        ]);
      }
    },
    [freshOnboard, guard],
  );

  /** Handles a typed reply while the language question is still open. */
  const handleOnboardReply = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", text, createdAt: Date.now() },
      ]);
      const matched = matchLanguageInput(text);
      if (!matched) {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "kavach-note",
            text: "Please tap or type one: 1️⃣ English · 2️⃣ हिंदी · 3️⃣ मराठी · 4️⃣ Hinglish\n(कृपया एक भाषा चुनें · कृपया एक भाषा निवडा)",
            createdAt: Date.now(),
          },
        ]);
        return;
      }
      handleLanguageChoice(matched, NATIVE_LABEL[matched]);
    },
    [handleLanguageChoice],
  );

  const handleSend = useCallback(
    (outgoing: OutgoingMessage) => {
      // Before a language is chosen, the chat IS the onboarding — typed replies
      // pick the language instead of being analyzed.
      if (languageKnown === false) {
        handleOnboardReply(outgoing.text ?? "");
        return;
      }
      // "menu" is a chat command: Kavach replies with change options.
      if (/^(menu|settings)\b|^मेनू/i.test(outgoing.text?.trim() ?? "")) {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "user", text: outgoing.text, createdAt: Date.now() },
          { id: newId(), role: "actions", kind: "menu", createdAt: Date.now() },
        ]);
        return;
      }
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
    [analyze, handleOnboardReply, languageKnown],
  );

  const handlePickSample = useCallback(
    (sample: SampleMessage) => {
      handleSend({ text: sample.text });
    },
    [handleSend],
  );

  return (
    <div className="flex min-h-dvh items-stretch justify-center bg-[#0b141a] sm:items-center sm:bg-[radial-gradient(1100px_600px_at_50%_18%,#1c2b32_0%,#0b141a_65%)] sm:p-6">
      {/* Phone shell wrapper — desktop frame decorations anchor here */}
      <div className="relative">
        {/* Side buttons (desktop frame only) */}
        <div aria-hidden className="absolute -left-[15px] top-28 hidden h-9 w-[4px] rounded-l-md bg-[#2f2f31] sm:block" />
        <div aria-hidden className="absolute -left-[15px] top-44 hidden h-14 w-[4px] rounded-l-md bg-[#2f2f31] sm:block" />
        <div aria-hidden className="absolute -left-[15px] top-64 hidden h-14 w-[4px] rounded-l-md bg-[#2f2f31] sm:block" />
        <div aria-hidden className="absolute -right-[15px] top-36 hidden h-20 w-[4px] rounded-r-md bg-[#2f2f31] sm:block" />

        <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[#EFE7DE] shadow-2xl sm:h-[calc(100dvh-5rem)] sm:max-h-[860px] sm:min-h-[600px] sm:w-[402px] sm:max-w-none sm:rounded-[3rem] sm:border-[12px] sm:border-[#17171a] sm:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
          {/* Status bar — part of the desktop phone frame */}
          <div className="relative hidden items-center justify-between bg-[#075E54] px-7 pb-1 pt-2.5 text-[12.5px] font-medium text-white sm:flex">
            <span>{welcomeTime !== null && formatClock(welcomeTime)}</span>
            <StatusIcons />
          </div>
          <div aria-hidden className="absolute left-1/2 top-[6px] z-40 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-[#17171a] sm:block" />

          {/* Top header */}
        <header className="relative z-30 flex items-center gap-2.5 bg-[#075E54] px-3 pb-2 pt-safe text-white">
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
          {languageKnown === true && (
            <>
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
            </>
          )}

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

        {/* Language switcher — appears once a language is chosen */}
        {languageKnown === true && (
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
                {NATIVE_LABEL[lang]}
              </button>
            ))}
          </div>
        )}

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

          {/* Encryption-style notice + welcome — only once a language is chosen */}
          {languageKnown === true && (
            <>
              <p className="mx-auto max-w-[92%] rounded-lg bg-[#FCF4CB] px-3 py-2 text-center text-[12.5px] leading-snug text-[#54656F] shadow-sm">
                {t.encryption}
              </p>

              {!freshOnboard && (
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
              )}
            </>
          )}

          {/* In-chat onboarding: the Kavach intro (first run) */}
          {onboardVisible && (
            <div className="flex">
              <div className="wa-in wa-bubble max-w-[92%] rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
                <p className="text-[16px] leading-relaxed text-[#111B21]">
                  नमस्ते! 🙏 I'm <span className="font-semibold text-[#075E54]">Kavach</span> 🛡️ —
                  your family's scam checker.
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#3B4A54]">
                  Forward any suspicious SMS, WhatsApp message or screenshot here — before you
                  click.
                  <br />
                  कोई भी संदिग्ध संदेश क्लिक करने से पहले यहाँ भेजें।
                  <br />
                  कोणताही संशयास्पद संदेश क्लिक करण्यापूर्वी येथे पाठवा.
                </p>
                <p className="mt-1 text-right text-[11px] text-[#8696A0]">
                  {welcomeTime !== null && formatTime(welcomeTime)}
                </p>
              </div>
            </div>
          )}

          {/* The language question — first run, or re-opened via the chat menu */}
          {askLanguage && (
            <div className="flex">
              <div className="wa-bubble max-w-[94%]">
                <div className="wa-in rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
                  <p className="text-[15.5px] font-semibold leading-relaxed text-[#111B21]">
                    Which language should we talk in?
                  </p>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-[#3B4A54]">
                    हम किस भाषा में बात करें? · आपण कोणत्या भाषेत बोलूया?
                  </p>
                  <p className="mt-1 text-[14px] text-[#667781]">
                    1️⃣ English · 2️⃣ हिंदी · 3️⃣ मराठी · 4️⃣ Hinglish
                  </p>
                  <p className="mt-1 text-right text-[11px] text-[#8696A0]">
                    {welcomeTime !== null && formatTime(welcomeTime)}
                  </p>
                </div>
                <div className="mt-1 space-y-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChoice(lang, NATIVE_LABEL[lang])}
                      className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
                    >
                      {NATIVE_LABEL[lang]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                    alertDelivered={message.alertDelivered === true}
                    onSendAlert={(summary) => handleSendAlertToGuard(message.id, summary)}
                  />
                </div>
              );
            }

            if (message.role === "alert-sent") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="wa-out wa-bubble max-w-[85%] rounded-lg rounded-tr-none bg-[#D9FDD3] px-2.5 py-1.5 shadow-sm">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-900">
                      {message.text}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#667781]">
                      🛡️ {t.alertSentCaption(message.toName, message.toRelation, message.phone)}
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
                      {formatTime(message.createdAt)}
                      <DoubleCheckIcon className="h-3 w-[18px]" />
                    </p>
                  </div>
                </div>
              );
            }

            if (message.role === "kavach-note") {
              return (
                <div key={message.id} className="flex">
                  <div className="wa-in wa-bubble max-w-[92%] rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
                    <p className="text-[15.5px] leading-relaxed whitespace-pre-wrap text-[#111B21]">
                      {message.text}
                    </p>
                    <p className="mt-1 text-right text-[11px] text-[#8696A0]">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            }

            if (message.role === "actions") {
              if (message.kind === "menu") {
                return (
                  <div key={message.id} className="flex">
                    <div className="wa-bubble max-w-[94%]">
                      <div className="wa-in rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
                        <p className="text-[15.5px] font-semibold text-[#111B21]">
                          ⚙️ {t.menuAsk}
                        </p>
                        <p className="mt-1 text-right text-[11px] text-[#8696A0]">
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                      <div className="mt-1 space-y-1">
                        <button
                          type="button"
                          onClick={() => setAskLanguage(true)}
                          className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
                        >
                          🌐 {t.changeLanguage}
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuardOpen(true)}
                          className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
                        >
                          🛡️ {t.guardSettings}
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
                        >
                          🔄 {t.reset}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="flex">
                  <div className="wa-bubble max-w-[94%]">
                    <div className="wa-in rounded-lg rounded-tl-none bg-white px-2.5 py-2 shadow-sm">
                      <p className="text-[15.5px] leading-relaxed text-[#111B21]">
                        {t.guardSetupAsk(message.name, message.relation, message.phone)}
                      </p>
                      <p className="mt-1 text-right text-[11px] text-[#8696A0]">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                    <div className="mt-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => handleKeepGuard(message.name, message.relation)}
                        className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
                      >
                        {t.guardKeep(message.name, message.relation)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGuardOpen(true)}
                        className="w-full rounded-lg bg-white py-2.5 text-center text-[15px] font-medium text-[#00A5F4] shadow-sm transition-colors hover:bg-[#F0F2F5]"
                      >
                        ✏️ {t.guardSettings}
                      </button>
                    </div>
                  </div>
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

          {languageKnown === true && analyzing && (
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

        {languageKnown === true && (
          <QuickChips language={language} disabled={analyzing} onPick={handlePickSample} />
        )}
        <InputBar
          language={language}
          disabled={analyzing}
          onSend={handleSend}
          placeholderOverride={
            languageKnown === false ? "Type: English · हिंदी · मराठी · Hinglish" : undefined
          }
          onNotice={(msg) =>
            setMessages((prev) => [...prev, { id: newId(), role: "error", text: msg, createdAt: Date.now() }])
          }
        />

        <FamilyGuardModal
          open={guardOpen}
          language={language}
          guard={guard ?? loadGuard()}
          onSave={handleSaveGuard}
          onClose={() => setGuardOpen(false)}
        />

        {/* Home indicator — desktop phone frame */}
        <div aria-hidden className="pointer-events-none absolute bottom-1.5 left-1/2 z-40 hidden h-1 w-28 -translate-x-1/2 rounded-full bg-[#0b141a]/25 sm:block" />
        </div>
      </div>
    </div>
  );
}
