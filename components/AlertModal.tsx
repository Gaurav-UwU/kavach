"use client";

import type { Language } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { buildWaMeLink } from "@/lib/guard";

export interface AlertPreview {
  name: string;
  relation: string;
  phone: string;
  summary: string;
}

interface AlertModalProps {
  open: boolean;
  language: Language;
  alert: AlertPreview | null;
  onClose: () => void;
}

export default function AlertModal({ open, language, alert, onClose }: AlertModalProps) {
  const t = STRINGS[language];
  if (!open || !alert) return null;

  const link = buildWaMeLink(
    { name: alert.name, relation: alert.relation, phone: alert.phone, autoAlert: false },
    alert.summary,
  );

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.alertModalTitle}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">🛡️ {t.alertModalTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <p className="mb-3 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">{t.alertTo}:</span> {alert.name} ({alert.relation}) · +91 {alert.phone}
        </p>

        <div className="mb-3 rounded-xl bg-[#E7FFDB] p-3 text-[15px] leading-relaxed whitespace-pre-line text-gray-900">
          {alert.summary}
        </div>

        <p className="mb-4 text-xs text-gray-500">🔒 {t.alertRedactedNote}</p>

        <div className="flex gap-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-[#25D366] py-2.5 text-center text-[15px] font-semibold text-[#07341c] transition-colors hover:bg-[#1fb959]"
          >
            📲 {t.openWhatsapp}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
