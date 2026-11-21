"use client";

import { useEffect, useState } from "react";
import type { GuardContact, Language } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";
import { normalizeIndianPhone } from "@/lib/guard";

interface FamilyGuardModalProps {
  open: boolean;
  language: Language;
  guard: GuardContact;
  onSave: (contact: GuardContact) => void;
  onClose: () => void;
}

export default function FamilyGuardModal({ open, language, guard, onSave, onClose }: FamilyGuardModalProps) {
  const t = STRINGS[language];
  const [name, setName] = useState(guard.name);
  const [relation, setRelation] = useState(guard.relation);
  const [phone, setPhone] = useState(guard.phone);
  const [autoAlert, setAutoAlert] = useState(guard.autoAlert);
  const [phoneError, setPhoneError] = useState(false);
  const [saved, setSaved] = useState(false);

  // Re-seed the form each time the modal opens.
  useEffect(() => {
    if (open) {
      setName(guard.name);
      setRelation(guard.relation);
      setPhone(guard.phone);
      setAutoAlert(guard.autoAlert);
      setPhoneError(false);
      setSaved(false);
    }
  }, [open, guard]);

  if (!open) return null;

  const handleSave = () => {
    const digits = normalizeIndianPhone(phone);
    if (!digits) {
      setPhoneError(true);
      return;
    }
    onSave({ name: name.trim() || "Family", relation: relation.trim() || "Family", phone: digits, autoAlert });
    setSaved(true);
    window.setTimeout(onClose, 700);
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.guardTitle}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">🛡️ {t.guardTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-600">{t.guardDesc}</p>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{t.fieldLabel.name}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label={t.fieldLabel.name}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[16px] text-gray-900 focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{t.fieldLabel.relation}</span>
            <input
              value={relation}
              list="kavach-relations"
              onChange={(e) => setRelation(e.target.value)}
              aria-label={t.fieldLabel.relation}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[16px] text-gray-900 focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
            />
            <datalist id="kavach-relations">
              {t.relationOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{t.fieldLabel.phone}</span>
            <input
              value={phone}
              inputMode="numeric"
              autoComplete="tel-national"
              aria-label={t.fieldLabel.phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError(false);
              }}
              placeholder="98765 43210"
              className={`w-full rounded-lg border px-3 py-2.5 text-[16px] text-gray-900 focus:outline-none focus:ring-2 ${
                phoneError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]/40"
              }`}
            />
            {phoneError && <span className="mt-1 block text-sm text-red-600">{t.phoneError}</span>}
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg bg-[#E7FFDB]/60 px-3 py-3">
            <span className="text-sm font-medium text-gray-800">{t.autoAlertToggle}</span>
            <input
              type="checkbox"
              checked={autoAlert}
              onChange={(e) => setAutoAlert(e.target.checked)}
              className="h-5 w-5 accent-[#25D366]"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-4 w-full rounded-full bg-[#075E54] py-3 text-[16px] font-semibold text-white transition-colors hover:bg-[#0a7a6d]"
        >
          {t.save}
        </button>
        {saved && <p className="mt-2 text-center text-sm text-green-700">✓ {t.savedNote}</p>}
      </div>
    </div>
  );
}
