/**
 * Redacts sensitive numbers from message text before it is used in a Family Alert.
 * Spec: 4–6 digit OTPs/PINs and account/card numbers -> [REDACTED]
 *
 * Runs in two places (belt & braces):
 *  1. On the raw user text before it reaches the model, so the model never sees
 *     live credentials in the first place.
 *  2. On the model's familyAlertSummary output, in case it echoes digits back.
 */

/** Real helpline numbers that must never be masked (1930 cyber-fraud, Chakshu era lines, etc.) */
const HELPLINE_WHITELIST = new Set([
  "100", // Police
  "101", // Fire
  "102", // Ambulance
  "108", // Emergency
  "112", // National emergency
  "139", // Railways
  "181", // Women helpline
  "182", // Rail security
  "1098", // Child helpline
  "14567", // Pension helpline
  "1930", // Cyber fraud helpline
]);

/** Recent years — often part of dates, never an OTP. */
const YEAR_WHITELIST = new Set(["2024", "2025", "2026", "2027", "2028", "2029", "2030"]);

/** Currency amounts like "Rs. 450.00" / "₹ 2,000" / "INR 5000" — useful context, park & restore. */
const CURRENCY_AMOUNT = /((?:rs\.?|inr|₹)\s?\d[\d,]*(?:\.\d+)?)/gi;

export function redactSensitive(input: string): string {
  if (!input) return input;

  const stash: string[] = [];

  // 1. Park currency amounts so useful figures like "Rs 450" survive redaction.
  const parked = input.replace(CURRENCY_AMOUNT, (m) => {
    stash.push(m);
    return `\u0000${stash.length - 1}\u0000`;
  });

  let out = parked;

  // 2. Long digit runs (9–16 digits, optional spaces/dashes) = account / card / Aadhaar numbers.
  out = out.replace(/(?:\d[ -]?){8,15}\d/g, (m) =>
    m.replace(/\D/g, "").length >= 9 ? "[REDACTED]" : m,
  );

  // 3. Standalone 4–6 digit runs = OTPs / PINs (keep helplines and years).
  out = out.replace(/\b\d{4,6}\b/g, (m) =>
    HELPLINE_WHITELIST.has(m) || YEAR_WHITELIST.has(m) ? m : "[REDACTED]",
  );

  // 4. Restore parked currency amounts.
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)]);

  return out;
}
