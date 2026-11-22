# SUBMISSION CHECKLIST — Growww Product Case Study

Mapping of the brief's required artifacts to what exists. ✅ = ready, ✍️ = yours to do.

---

## Artifact 1 — 1-page write-up (~300–700 words) — ✍️ YOURS TO WRITE

> Brief rule: *"Ensure this page is not created by AI."* — write it yourself; the material below is your research base, not draft text.

Required sections (from the brief) and where your raw material lives:

| Section the brief demands | Your raw material |
|---|---|
| (a) Your take on the problem statement | `kavach/FEATURES.md` intro + §7 (redaction), §9 (Auto-Alert); research dossier `kavach/docs/scam-typologies-india-2023-2026.md` — I4C: ₹22,849 cr lost in 2024, digital arrest ₹1,918 cr, investment scams 77% of 2025 losses; elders are the primary target of every family in the dossier |
| (b) What is in scope | FEATURES.md §1–§12 (chat UX, 4 languages, verdicts, Listen, Family Guard, Auto-Alert, menu command, official-channel buttons) |
| (c) What is out of scope | FEATURES.md "Scope notes" — live WhatsApp Business API, auth/DB, SMS scraping, URL sandboxing; also the deliberate choices: simulated in-chat delivery instead of `wa.me`, rules-engine fallback |
| (d) Your solution and why | FEATURES.md §6 (engine chain), §8 (WhatsApp Business-style verdict cards), §9 (Auto-Alert = the family learns even if the parent does nothing), §14 (system prompt v2 design decisions); PROMPTS.md addendum (design interview decisions) |
| Verified vs guessed (brief asks for this) | **Verified:** 18 decision points from a structured design interview; 2-agent research dossier with sources (Chakshu's own category list, RBI BE(A)WARE, I4C statistics, Reddit victim reports); 20 eval cases. **Guessed/assumed:** elder UX preferences (no user interviews), voice-note TTS path (designed, not built), Hinglish voice quality |

Also worth one line each: the **Listen-on-WhatsApp discussion** (client speechSynthesis now → Bhashini/cloud-TTS voice note in production, same interaction), and **why the verdict card looks like a Business-API message** (buttons below the bubble, not inside).

## Artifact 2 — The prompts you used — ✅ DONE

- `PROMPTS.md` (assignment root) — master spec, schema lock, provider decision, plus a chronological addendum of all 12 refinement prompts and the system-prompt v2 research note.

## Artifact 3 — The evals you used — ✅ DONE

- **`EVALS.md` (assignment root) is the ready-to-submit artifact** — paste or attach it as-is. It contains: the methodology (per-case assertions under the fail-safe tier rule), the full 20-case table (17 text + 3 vision fixtures), the real run transcript (showing Gemini→Groq failover under rate limits), the four real bugs the suite caught, and the two commands judges can run themselves.
- The suite itself lives at `kavach/evals/` (cases.json + runner) and ships with the repo.
- Before submitting, re-run once for a fresh transcript if you want the engines column to match the day: `EVAL_BASE_URL=https://kavach-gaurav-uwus-projects.vercel.app npm run eval`

## Artifact 4 — Link to the app — ✅ DONE

- **https://kavach-gaurav-uwus-projects.vercel.app** (Vercel, Next.js)
- Deployment Protection disabled — verified publicly accessible without login (homepage 200, API 200)
- Note: both AI keys are free-tier; heavy hammering falls back to the offline engine, honestly labeled in the UI

## Optional but recommended

- [ ] **Push `kavach/` to GitHub** and paste the repo link in the submission — judges can then read `FEATURES.md`, `docs/scam-typologies-india-2023-2026.md`, the eval suite, and the commit history (35+ atomic commits showing the build sequence)
- [ ] Confirm the deployed app once from an **incognito window** (should load with no login wall)
- [ ] **Rotate both API keys** (Groq + Gemini) after submission — they were shared in a chat session

## Explicitly NOT included (per the brief)

- The 1-page write-up was **not AI-drafted** — hand-written only.
