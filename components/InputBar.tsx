"use client";

import { useRef, useState } from "react";
import type { Language } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { MicIcon, PaperclipIcon, SendIcon, SmileIcon } from "./icons";

export interface OutgoingMessage {
  text?: string;
  imageBase64?: string;
}

interface InputBarProps {
  language: Language;
  disabled?: boolean;
  onSend: (message: OutgoingMessage) => void;
  /** Shown for attachment / voice validation problems. */
  onNotice: (message: string) => void;
  /** Overrides the localized placeholder (used pre-language-choice). */
  placeholderOverride?: string;
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

export default function InputBar({ language, disabled, onSend, onNotice, placeholderOverride }: InputBarProps) {
  const t = STRINGS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  const canSend = !disabled && (text.trim().length > 0 || attachment !== null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onNotice(t.imgTypeBad);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onNotice(t.imgTooBig);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAttachment(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  const handleMic = () => {
    if (listening) {
      stopVoice();
      return;
    }
    const SR =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .webkitSpeechRecognition;
    if (!SR) {
      onNotice(t.voiceUnsupported);
      return;
    }
    const recognition = new SR();
    recognition.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results as ArrayLike<ArrayLike<{ transcript: string }>>)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      if (transcript) setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognition.onerror = recognition.onend;
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const handleSend = () => {
    if (!canSend) return;
    stopVoice();
    onSend({ text: text.trim() || undefined, imageBase64: attachment ?? undefined });
    setText("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-[#F0F2F5] px-2 pb-2 pt-1">
      {attachment && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-white px-2.5 py-2 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={attachment} alt="" className="h-12 w-12 rounded object-cover" />
          <button
            type="button"
            onClick={() => setAttachment(null)}
            aria-label={t.removeAttachment}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex min-h-11 flex-1 items-center gap-1 rounded-3xl bg-white px-1.5 py-1 shadow-sm">
          <button
            type="button"
            onClick={() => setText((prev) => `${prev}${prev.endsWith(" ") || !prev ? "" : " "}🙂`)}
            aria-label="Insert emoji"
            disabled={disabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8696A0] transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            <SmileIcon className="h-6 w-6" />
          </button>
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholderOverride ?? (listening ? t.listening : t.inputPlaceholder)}
            className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-1 py-1.5 text-[16px] text-gray-900 placeholder:text-[#8696A0] focus:outline-none"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach screenshot"
            disabled={disabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8696A0] transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            <PaperclipIcon className="h-[22px] w-[22px]" />
          </button>
        </div>
        <button
          type="button"
          onClick={canSend ? handleSend : handleMic}
          disabled={disabled}
          aria-label={canSend ? "Send" : t.listening}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50 ${
            canSend ? "bg-[#25D366] text-white hover:bg-[#1fb959]" : "bg-white text-[#8696A0]"
          }`}
        >
          {canSend ? (
            <SendIcon className="h-5 w-5" />
          ) : (
            <MicIcon className={`h-5 w-5 ${listening ? "animate-pulse text-[#EA4335]" : ""}`} />
          )}
        </button>
      </div>
    </div>
  );
}
