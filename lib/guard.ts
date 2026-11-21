import type { GuardContact, Language } from "./types";

const STORAGE_KEY = "kavach.guard.v1";
const LANGUAGE_KEY = "kavach.language.v1";

/** Pre-filled default per spec — editable, stored in localStorage. */
export const DEFAULT_GUARD: GuardContact = {
  name: "Aarav",
  relation: "Son",
  phone: "9876543210",
  autoAlert: true,
};

export function loadGuard(): GuardContact {
  if (typeof window === "undefined") return DEFAULT_GUARD;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GUARD;
    const parsed = JSON.parse(raw) as Partial<GuardContact>;
    if (
      typeof parsed.name === "string" &&
      typeof parsed.relation === "string" &&
      typeof parsed.phone === "string" &&
      typeof parsed.autoAlert === "boolean"
    ) {
      return {
        name: parsed.name,
        relation: parsed.relation,
        phone: parsed.phone,
        autoAlert: parsed.autoAlert,
      };
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return DEFAULT_GUARD;
}

export function saveGuard(contact: GuardContact): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contact));
}

/** Chosen language persists across visits ("set for further communications"). */
export function loadSavedLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(LANGUAGE_KEY);
  return value === "English" || value === "Hindi" || value === "Marathi" || value === "Hinglish"
    ? value
    : null;
}

export function saveLanguage(language: Language): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANGUAGE_KEY, language);
}

/** Full prototype reset: wipes language choice, Family Guard and any other prefs. */
export function clearAllSettings(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LANGUAGE_KEY);
  window.localStorage.removeItem(STORAGE_KEY);
}

/** True when the guard is still the untouched demo default (setup never done). */
export function isDefaultGuard(contact: GuardContact): boolean {
  return (
    contact.name === DEFAULT_GUARD.name &&
    contact.relation === DEFAULT_GUARD.relation &&
    contact.phone === DEFAULT_GUARD.phone
  );
}

/**
 * Accepts 10-digit numbers, optionally prefixed with +91 / 0 / spaces / dashes.
 * Returns just the 10 digits, or null if invalid.
 */
export function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const trimmed = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  const final = trimmed.length === 11 && trimmed.startsWith("0") ? trimmed.slice(1) : trimmed;
  return /^[6-9]\d{9}$/.test(final) ? final : null;
}

/**
 * Builds the real WhatsApp Click-to-Chat handoff link:
 * https://wa.me/91<phone>?text=<encoded alert>
 */
export function buildWaMeLink(contact: GuardContact, familyAlertSummary: string): string {
  const waText = [
    "🛡️ *Kavach Family Alert*",
    "",
    familyAlertSummary,
    "",
    "Please call your parent and guide them calmly.",
    "Never share OTPs. Report scams on Chakshu (sancharsaathi.gov.in). If money was sent, call 1930.",
  ].join("\n");
  return `https://wa.me/91${contact.phone}?text=${encodeURIComponent(waText)}`;
}
