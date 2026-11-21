# Kavach 🛡️

A WhatsApp-native scam checker for Indian parents and older relatives — a mobile-first web prototype.

Forward a suspicious SMS / WhatsApp message (or upload a screenshot) and Kavach replies with a calm, jargon-free verdict — **🔴 HIGH-RISK SCAM**, **🟡 CAUTION**, or **🟢 LIKELY SAFE** — in **English, हिंदी, or Hinglish**, reads it aloud, and can one-tap alert a trusted family contact on WhatsApp.

## Features

- WhatsApp-style chat UI (mobile-first, centered phone viewport on desktop)
- Language toggle: `English | हिंदी | Hinglish` — verdicts, actions and alerts are generated in the selected language
- 4 pre-loaded **"Forward a Sample Message"** chips for instant evaluation
- Screenshot upload (PNG/JPG/WebP, max 4 MB) — analyzed with Gemini vision
- 🔊 **Listen** button (browser Web Speech API, `en-IN` / `hi-IN` voices)
- **Family Guard**: one trusted contact (Name, Relation, 10-digit phone, Auto-Alert toggle) stored in `localStorage`
- **Auto-Alert**: on HIGH_RISK verdicts with Auto-Alert ON, a Family Alert banner appears with a preview of the exact message sent to the child
- **One-tap Send to guardian**: the redacted alert is delivered into the conversation as an outgoing message (simulated in-chat handoff — no external app jump, no real numbers contacted)
- **Automatic redaction**: OTPs (4–6 digits), PINs and account/card numbers become `[REDACTED]` before any family alert is generated
- Official reporting refs: **Chakshu (Sanchar Saathi)** for suspicious messages, **1930** if money was already sent

## How the analysis works

`POST /api/analyze` (see `app/api/analyze/route.ts`):

1. Input text is **redacted first** — the model never sees live OTPs/PINs/account numbers.
2. If `GEMINI_API_KEY` is set, Gemini (`gemini-2.5-flash` via the Vercel AI SDK `generateObject` + zod) returns a typed structured verdict. The model's alert summary is scrubbed again afterwards (belt & braces).
3. **No key? No problem.** A deterministic offline rules engine (`lib/heuristic.ts`) covers common Indian scam patterns so the prototype never breaks — evals stay deterministic too.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: add GEMINI_API_KEY for AI-powered analysis
npm run dev
```

Open http://localhost:3000 and try the sample chips.

## Evals

With the app running:

```bash
npm run eval                       # against localhost:3000
EVAL_BASE_URL=https://your-app.vercel.app npm run eval
```

12 cases across English/Hindi/Hinglish covering the four sample chips, OTP harvesting, lottery fraud, KYC phishing, job scams, delivery noise — plus redaction-leak assertions on every `familyAlertSummary`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. [vercel.com/new](https://vercel.com/new) → import the repo (framework auto-detects Next.js).
3. Add env var `GEMINI_API_KEY` in Project → Settings → Environment Variables (optional — the app works without it).
4. Deploy. Share the URL.

## Scope (v1)

- ✅ In: chat UI, 3 languages, sample chips, 3-tier verdicts, audio playback, family guard + auto-alert with redaction, Chakshu/1930 guidance
- ❌ Out: live WhatsApp Business API integration, auth/database, SMS scraping, URL sandboxing, live telecom lookups

> **Demo notice:** Kavach is a prototype, not an official government or bank service.
