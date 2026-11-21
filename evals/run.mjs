#!/usr/bin/env node
/**
 * Kavach eval suite — hits POST /api/analyze on a running server and checks:
 *   1. Verdict tier matches expectation under the **fail-safe asymmetric rule**:
 *        HIGH_RISK   -> exact match only (never soften a real threat)
 *        CAUTION     -> CAUTION or HIGH_RISK (failing safe is fine; never LIKELY_SAFE)
 *        LIKELY_SAFE -> exact match only (no false alarms on genuine messages)
 *   2. `reasons` is 1–3 non-empty strings; `nextAction` non-empty.
 *   3. `familyAlertSummary` leaks NO sensitive numbers (OTP/PIN/account/card),
 *      honouring per-case `mustNotInclude` lists.
 *   4. Language compliance (Devanagari present for Hindi cases).
 *
 * Usage:
 *   npm start                       # in one terminal
 *   npm run eval                    # in another (defaults to http://localhost:3000)
 *   EVAL_BASE_URL=https://kavach.vercel.app npm run eval
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = process.env.EVAL_BASE_URL ?? "http://localhost:3000";

/** Fail-safe asymmetric tier rule (see header comment). */
function verdictPasses(actual, expected, adjacentAllowed) {
  if (actual === expected) return true;
  if (adjacentAllowed === false) return false;
  return expected === "CAUTION" && actual === "HIGH_RISK";
}

// Must mirror lib/redact.ts whitelists so preserved helplines/years don't fail.
const HELPLINE_WHITELIST = new Set([
  "100", "101", "102", "108", "112", "139", "181", "182", "1930", "1098", "14567",
]);
const YEAR_WHITELIST = new Set(["2024", "2025", "2026", "2027", "2028", "2029", "2030"]);

const here = join(dirname(fileURLToPath(import.meta.url)));
const cases = JSON.parse(readFileSync(join(here, "cases.json"), "utf8")).cases;

function tierDistance(actual, expected) {
  return Math.abs(TIER_ORDER.indexOf(actual) - TIER_ORDER.indexOf(expected));
}

/** Returns a list of leaked sensitive numbers found in a family alert summary. */
function findLeaks(summary) {
  const leaks = [];
  // Park currency amounts ("Rs 450.00") — those are useful, intentional context.
  const parked = summary.replace(/(?:rs\.?|inr|₹)\s?\d[\d,]*(?:\.\d+)?/gi, "");
  for (const run of parked.matchAll(/\d{9,}/g)) leaks.push(run[0]);
  for (const num of parked.matchAll(/\b\d{4,6}\b/g)) {
    if (!HELPLINE_WHITELIST.has(num[0]) && !YEAR_WHITELIST.has(num[0])) leaks.push(num[0]);
  }
  return leaks;
}

async function runCase(baseUrl, kase) {
  const failures = [];
  let response;
  try {
    response = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: kase.text, language: kase.language }),
    });
  } catch (error) {
    return { ok: false, failures: [`request failed: ${error.message}`], engine: "?" };
  }

  if (!response.ok) {
    return { ok: false, failures: [`HTTP ${response.status}`], engine: "?" };
  }

  const engine = response.headers.get("x-kavach-engine") ?? "?";
  let body;
  try {
    body = await response.json();
  } catch {
    return { ok: false, failures: ["response was not JSON"], engine };
  }

  // 1. Verdict tier (fail-safe asymmetric rule)
  if (!verdictPasses(body.verdict, kase.expected, kase.adjacentAllowed)) {
    failures.push(`verdict: expected ${kase.expected}, got ${body.verdict}`);
  }

  // 2. Shape of the reply
  if (!Array.isArray(body.reasons) || body.reasons.length < 1 || body.reasons.length > 3) {
    failures.push(`reasons: expected 1-3 bullets, got ${JSON.stringify(body.reasons)}`);
  } else if (body.reasons.some((r) => typeof r !== "string" || r.trim().length === 0)) {
    failures.push("reasons: contains an empty bullet");
  }
  if (typeof body.nextAction !== "string" || body.nextAction.trim().length === 0) {
    failures.push("nextAction: empty");
  }
  if (typeof body.familyAlertSummary !== "string" || body.familyAlertSummary.trim().length === 0) {
    failures.push("familyAlertSummary: empty");
  }

  // 3. Redaction guarantees
  if (typeof body.familyAlertSummary === "string") {
    const summary = body.familyAlertSummary;
    for (const leak of findLeaks(summary)) {
      failures.push(`familyAlertSummary leaks sensitive number: ${leak}`);
    }
    for (const banned of kase.mustNotInclude ?? []) {
      if (summary.includes(banned)) failures.push(`familyAlertSummary must not include: ${banned}`);
    }
  }

  // 4. Language compliance
  if (kase.mustContainDevanagari) {
    const sample = [body.scamType, ...(body.reasons ?? []), body.nextAction].join(" ");
    if (!/[\u0900-\u097F]/.test(sample)) failures.push("expected Devanagari output for Hindi case");
  }

  return { ok: failures.length === 0, failures, engine, body };
}

const results = [];
for (const kase of cases) {
  const result = await runCase(BASE_URL, kase);
  results.push({ kase, result });
  const icon = result.ok ? "✅" : "❌";
  console.log(`${icon} ${kase.id.padEnd(24)} [${kase.expected}] got: ${result.body?.verdict ?? "ERR"} (engine: ${result.engine})`);
  for (const failure of result.failures) console.log(`     └─ ${failure}`);
}

const passed = results.filter((r) => r.result.ok).length;
console.log(`\n${passed}/${results.length} eval cases passed against ${BASE_URL}`);
if (passed !== results.length) {
  console.log("Some evals FAILED. See details above.");
  process.exit(1);
}
console.log("All evals passed.");
