export type Verdict = "HIGH_RISK" | "CAUTION" | "LIKELY_SAFE";

export type Language = "English" | "Hindi" | "Hinglish";

export const LANGUAGES: Language[] = ["English", "Hindi", "Hinglish"];

export interface Analysis {
  verdict: Verdict;
  /** Short label, e.g. "Digital Arrest Scam", "Fake APK Malware", "Legitimate Bank Alert" */
  scamType: string;
  /** 1–3 plain-language bullets in the requested language */
  reasons: string[];
  /** 1 calm, clear instruction in the requested language */
  nextAction: string;
  /** 2-line summary for the user's child; OTPs/PINs/account numbers redacted as [REDACTED] */
  familyAlertSummary: string;
}

export interface GuardContact {
  name: string;
  relation: string;
  /** 10-digit Indian mobile number, no country code */
  phone: string;
  autoAlert: boolean;
}

export type ChatMessage =
  | { id: string; role: "user"; text?: string; image?: string; createdAt: number }
  | {
      id: string;
      role: "kavach";
      analysis: Analysis;
      lang: Language;
      engine: "gemini" | "heuristic";
      createdAt: number;
    }
  | { id: string; role: "banner"; name: string; relation: string; summary: string; createdAt: number }
  | { id: string; role: "error"; text: string; createdAt: number };
