"use client";

import { useRef, useState } from "react";
import type { Language } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";

export interface OutgoingMessage {
  text?: string;
  imageBase64?: string;
}

interface InputBarProps {
  language: Language;
  disabled?: boolean;
  onSend: (message: OutgoingMessage) => void;
  /** Shown for attachment validation problems (too big / wrong type). */
  onNotice: (message: string) => void;
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function InputBar({ language, disabled, onSend, onNotice }: InputBarProps) {
  const t = STRINGS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);

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

  const handleSend = () => {
    if (!canSend) return;
    onSend({ text: text.trim() || undefined, imageBase64: attachment ?? undefined });
    setText("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-t border-black/5 bg-[#F0F0F0] px-2.5 py-2">
      {attachment && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-white px-2.5 py-2 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={attachment} alt="" className="h-12 w-12 rounded object-cover" />
          <button
            type="button"
            onClick={() => setAttachment(null)}
            aria-label={t.removeAttachment}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex items-end gap-1.5">
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
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-gray-600 transition-colors hover:bg-black/5 disabled:opacity-50"
        >
          📎
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
          placeholder={t.inputPlaceholder}
          className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl bg-white px-4 py-2.5 text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-lg text-white shadow-sm transition-all hover:bg-[#1fb959] active:scale-95 disabled:opacity-40"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
