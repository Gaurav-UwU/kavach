import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { redactSensitive } from "@/lib/redact";
import { analyzeWithRules } from "@/lib/heuristic";
import type { Analysis, Language } from "@/lib/types";

// Prevent Hobby-tier 10s timeouts during vision/LLM calls.
export const maxDuration = 30;

const AnalysisSchema = z.object({
  verdict: z.enum(["HIGH_RISK", "CAUTION", "LIKELY_SAFE"]),
  scamType: z
    .string()
    .describe(
      "Short label, e.g. 'Digital Arrest Scam', 'Fake APK Malware', 'Legitimate Bank Alert'",
    ),
  reasons: z.array(z.string()).min(1).max(3).describe("Plain-language bullets in requested language"),
  nextAction: z.string().describe("1 calm, clear instruction in requested language"),
  familyAlertSummary: z.string().describe(
    "2-line summary for the user's child with all OTPs, PINs, and account numbers redacted as [REDACTED]",
  ),
});

const LANGUAGES: Language[] = ["English", "Hindi", "Hinglish"];

const LANGUAGE_INSTRUCTION: Record<Language, string> = {
  English: "simple English — short sentences, zero technical jargon",
  Hindi:
    "easy Hindi in Devanagari script (सरल हिंदी) — no English jargon except brand names like SBI, UPI, OTP",
  Hinglish:
    "natural Hinglish — Hindi written in Roman script mixed with common English words (jaise 'account', 'click')",
};

const SYSTEM_PROMPT = `You are Kavach, a scam-protection assistant for Indian parents and grandparents. The user forwards a suspicious SMS or WhatsApp message (as text and/or a screenshot). Judge how dangerous it is.

Verdict rules:
- HIGH_RISK: impersonation (bank/police/electricity board), OTP/PIN/CVV sharing requests, .apk install demands, "digital arrest" threats, lottery/prize fee demands, urgent pressure to call unknown numbers or pay.
- CAUTION: possibly fake — KYC/account-update links, too-good-to-be-true job offers, unexpected links to verify/claim/refund. Verify first.
- LIKELY_SAFE: routine notifications — transaction debit/credit alerts, delivery updates, greetings. No asking for codes, installs, or payments.

Writing rules:
- Write scamType, reasons, nextAction and familyAlertSummary in: <LANGUAGE>.
- Senior-friendly: very short sentences, calm and respectful tone, zero technical jargon.
- reasons: 2-3 bullets explaining WHY in plain language an elder can understand.
- nextAction: exactly ONE calm sentence telling them what to do now. For HIGH_RISK it must mention reporting on Chakshu (Sanchar Saathi) and, if money was already sent, calling 1930 immediately.
- familyAlertSummary: at most 2 lines addressed to the user's child describing what the message claimed and the verdict. NEVER include any OTP, PIN, or full account/card number — write [REDACTED] instead. Never invent numbers that were not in the original message.
- Be humble about certainty: say "looks like" when unsure. Never claim to be an official bank or government service.`;

export async function POST(request: Request) {
  let body: { text?: unknown; imageBase64?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const language: Language = LANGUAGES.includes(body.language as Language)
    ? (body.language as Language)
    : "English";

  const rawText = typeof body.text === "string" ? body.text.trim() : "";
  const imageBase64 =
    typeof body.imageBase64 === "string" && body.imageBase64.startsWith("data:image/")
      ? body.imageBase64
      : undefined;

  if (!rawText && !imageBase64) {
    return NextResponse.json({ error: "Provide text or imageBase64" }, { status: 400 });
  }

  // Redact BEFORE anything leaves the request: the model never sees live credentials.
  const text = rawText.slice(0, 4000);
  const redactedText = text ? redactSensitive(text) : "";

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (apiKey) {
    try {
      const google = createGoogleGenerativeAI({ apiKey });
      const model = google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash");

      const { object } = await generateObject({
        model,
        schema: AnalysisSchema,
        system: SYSTEM_PROMPT.replace("<LANGUAGE>", LANGUAGE_INSTRUCTION[language]),
        messages: [
          {
            role: "user",
            content: [
              ...(imageBase64
                ? [{ type: "image" as const, image: imageBase64 }]
                : []),
              {
                type: "text" as const,
                text: imageBase64
                  ? `Analyze this screenshot of a message. ${redactedText ? `Any accompanying text: "${redactedText}"` : ""}`
                  : `Analyze this message: "${redactedText}"`,
              },
            ],
          },
        ],
      });

      const analysis: Analysis = {
        verdict: object.verdict,
        scamType: object.scamType.slice(0, 80),
        reasons: object.reasons.slice(0, 3).map((r) => r.slice(0, 300)),
        nextAction: object.nextAction.slice(0, 400),
        // Belt & braces: scrub the model's summary again before it goes anywhere.
        familyAlertSummary: redactSensitive(object.familyAlertSummary).slice(0, 500),
      };
      return NextResponse.json(analysis, { headers: { "X-Kavach-Engine": "gemini" } });
    } catch (error) {
      console.error("[analyze] Gemini failed, falling back to rules:", error);
    }
  }

  // No API key (or Gemini failed): deterministic offline rules engine keeps the
  // prototype fully usable. All rule outputs are already redacted.
  const fallback = analyzeWithRules(redactedText, language);
  return NextResponse.json(fallback, { headers: { "X-Kavach-Engine": "heuristic" } });
}
