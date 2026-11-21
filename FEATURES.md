# Kavach — Feature Documentation 🛡️

**Kavach** ("shield") is a WhatsApp-native scam checker for Indian parents and older relatives. Forward a suspicious SMS or WhatsApp message — or upload a screenshot — and get a calm, jargon-free verdict in your own language, with automatic family alerts and one-tap reporting to official channels.

Live: https://kavach-gaurav-uwus-projects.vercel.app

---

## 1. Onboarding (in-chat, WhatsApp-native)

| Feature | Details |
|---|---|
| Language-first handshake | The very first messages ask *"Which language should we talk in?"* in English, हिंदी, and मराठी — with **4 quick-reply buttons**: English / हिंदी / मराठी / Hinglish |
| Typed replies also work | Replying "हिंदी", "marathi", "3", "Hinglish" etc. is keyword-matched; unrecognized replies get a polite re-prompt |
| Persistence | The chosen language is saved in `localStorage` and drives all further communication — UI, verdicts, alerts, voice |
| Trilingual intro | The welcome message introduces Kavach in English + Hindi + Marathi simultaneously (no language assumed yet) |
| Family Guard setup | Right after the language choice, Kavach shows the current trusted contact and offers **Keep** or **Set a different contact** |
| Menu tip | Users are told they can type **menu** anytime to change language or contact |

## 2. Languages

- **English, हिंदी, मराठी, Hinglish** — switchable anytime via header pills; the switch persists
- Every layer is localized: all ~45 UI strings, AI-generated verdicts (system prompt instructs the model per language), the offline rules engine (reasons/actions/labels in all 4 languages, incl. Marathi & Hindi detection keywords), menu messages, confirmations, and the voice output
- Quick-test chip labels stay bilingual by design

## 3. Chat interface (WhatsApp-native)

- **Desktop**: the app sits inside a realistic **phone body** — dark bezel, rounded corners, punch-hole camera, live status bar (clock + signal/Wi-Fi/battery), side buttons, home indicator, on a radial-gradient backdrop
- **Mobile**: full-bleed layout (no frame), `viewport-fit=cover` + `env(safe-area-inset-*)` padding so notches and home bars never cover the header or input; transparent tap highlight
- Header: shield avatar, "Kavach" + verified badge, **Online** / **typing…** live status, 🛡️ Family Guard button, ⋮ menu
- **⋮ menu**: Family Guard settings · Clear chat · Reset prototype
- Chat canvas: WhatsApp **doodle wallpaper**, **TODAY** date chip, yellow **encryption-style notice** ("messages never leave your phone")
- Bubbles: proper **tails** (incoming/outgoing), user bubbles in WhatsApp green with **blue double-ticks ✓✓** and timestamps, subtle pop-in animation
- **Scroll-to-bottom FAB** appears when scrolled up
- **Typing indicator**: animated dots bubble + header status change while analyzing
- Inline error bubbles (network failures, invalid uploads)

## 4. Input bar

- WhatsApp-style white pill: 😊 emoji insert inside-left, 📎 screenshot attach inside-right
- **Screenshot upload**: PNG/JPG/WebP, max 4 MB, validated client-side, converted to base64, preview chip with remove button
- **Mic ⇄ Send swap**: white mic button when empty → green send plane when typing
- **Working voice input** via browser SpeechRecognition (`en-IN`/`hi-IN`, follows the chosen language); graceful notice if the browser doesn't support it
- Enter sends (Shift+Enter for newline)

## 5. Quick-test chips

Four pre-loaded "Forward a Sample Message" chips — one tap sends and analyzes instantly:
1. ⚡ Electricity Bill Cut (fake utility disconnection)
2. 🏦 SBI KYC (.apk) (fake app malware)
3. 🚨 Digital Arrest (police/courier intimidation)
4. ✅ Real Bank Alert (genuine transaction alert — should NOT be flagged)

## 6. AI analysis engine — `POST /api/analyze`

**Request**: `{ text?, imageBase64?, language }` · **`maxDuration = 30`**

Verdict pipeline (engine chain with graceful degradation):

| Order | Engine | Trigger | Notes |
|---|---|---|---|
| 1 | **Groq** — `openai/gpt-oss-120b` | `GROQ_API_KEY` set | Vercel AI SDK `generateObject` + zod, schema sent as **native `json_schema` structured output** |
| 2 | **Gemini** — `gemini-2.5-flash` | only if no Groq key | Vision-capable; used for screenshot analysis when Groq vision isn't configured |
| 3 | **Offline rules engine** | no keys, or AI call fails | 10 deterministic rules (APK malware, digital arrest, OTP theft, lottery, utility threats, KYC phishing, job scams, suspicious links, transaction alerts, delivery updates) with English + Hindi + Marathi detection regexes — the demo never breaks |

**Structured output contract** (zod): `verdict` (HIGH_RISK / CAUTION / LIKELY_SAFE) · `scamType` (short label) · `reasons` (1–3 plain-language bullets) · `nextAction` (one calm sentence) · `familyAlertSummary` (2 lines for the child). The chosen `engine` is returned in the `X-Kavach-Engine` header.

## 7. Privacy: automatic redaction

- Input text is **redacted before the model sees it** — the AI never receives live credentials
- The model's alert summary is **scrubbed again** server-side (belt & braces)
- Rules: 4–6 digit **OTPs/PINs** → `[REDACTED]`; **account/card/Aadhaar** runs (9–16 digits) → `[REDACTED]`; scammer phone numbers are masked too
- Whitelisted so useful context survives: **1930/112/181** and other helplines, years, currency amounts ("Rs 450")

## 8. Verdict card (WhatsApp Business-style)

Rendered as a plain-text WhatsApp message (bold verdict line with 🔴/🟡/🟢, italic scam-type label, typed "•" bullets) with **quick-reply buttons attached below the bubble**:

| Button | Verdicts | Action |
|---|---|---|
| 🔊 **Listen** | HIGH_RISK, CAUTION | Reads verdict + reasons + action aloud via Web Speech API (`en-IN` / `hi-IN` / `mr-IN`, slowed for seniors); tap again to stop |
| 📤 **Send this to \<guardian\>** | HIGH_RISK, CAUTION — **only until delivered** | Delivers the redacted alert into the conversation as an outgoing message with delivery caption + ticks (simulated in-chat handoff) |
| 🌐 **Report on Chakshu** | HIGH_RISK only | Opens the official **Sanchar Saathi** portal (sancharsaathi.gov.in) |
| 📞 **Call 1930** | HIGH_RISK only | `tel:1930` — one tap to the national cyber-fraud helpline |
| ⚡ offline note | heuristic engine only | Transparency: shows which engine produced the verdict |

## 9. Auto-Alert (automatic family warning)

- **Auto-Alert ON** (default) + HIGH_RISK verdict → the redacted alert is **delivered to the Family Guardian automatically** — an outgoing WhatsApp-style bubble appears in the conversation with zero interaction
- **Auto-Alert OFF** → nothing is sent automatically; the manual send button becomes the path
- If Auto-Alert is ON but no valid contact is set, Kavach posts a warning note instead of failing silently
- Delivered verdicts hide the manual send button (no duplicate sends)

## 10. Family Guard (trusted contact)

- One trusted contact: **Name, Relation** (datalist suggestions), **10-digit Indian mobile** (normalizes `+91`/`0`/spaces; validates), **Auto-Alert toggle**
- Persisted in `localStorage`; editable anytime
- **Every save confirms in the conversation** ("Family Guard updated — alerts will now go to …")
- Accessible from the header 🛡️, the ⋮ menu, the chat menu, and automatically after onboarding

## 11. The "menu" chat command

- Typing **menu** (or मेनू / settings) makes Kavach reply with an in-chat options menu: **🌐 Change language · 🛡️ Family Guard settings · 🔄 Reset prototype**
- The ⋮ header dropdown offers the same (plus Clear chat) for mouse users

## 12. Reset & privacy

- **Reset prototype** wipes chat, language choice, and Family Guard, then replays the onboarding — one tap to demo from scratch
- **Clear chat** wipes messages only
- No backend storage, no auth, no analytics: messages stay on-device; only the text sent for checking is analyzed (stated in the in-app notice)

## 13. Eval suite (`npm run eval`)

13 cases across English/Hindi/Marathi/Hinglish, runnable against localhost or the deployed URL (`EVAL_BASE_URL`):
- Verdict-tier assertions (±1 tier tolerated for the AI engine; exact for the rules engine)
- Reply-shape checks (1–3 reasons, non-empty action/summary)
- **Redaction-leak scans** on every alert summary (helpline/year whitelists mirrored)
- Devanagari compliance for Hindi/Marathi cases
- Live status: **13/13 passing** locally and in production on the Groq engine

## 14. Deployment

- Next.js 16 (App Router, TypeScript) + Tailwind CSS 4 on **Vercel**
- Env: `GROQ_API_KEY`, `GROQ_MODEL`, optional `GROQ_VISION_MODEL`, optional `GEMINI_API_KEY` — secrets in `.env.local` (gitignored) and Vercel's encrypted store
- Production: https://kavach-gaurav-uwus-projects.vercel.app

---

### Scope notes (v1)

Out of scope by design: live WhatsApp Business API integration (the in-chat simulated handoff is its stand-in), authentication/database, SMS scraping, URL sandboxing, live telecom lookups. The production upgrade path for Listen is documented: quick-reply tap → webhook → cloud TTS (e.g., Bhashini) → WhatsApp voice note — same interaction, different engine.
