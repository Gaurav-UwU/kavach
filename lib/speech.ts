import type { Language } from "./types";

/**
 * Reads text aloud via the browser-native Web Speech API.
 * No extra API keys needed.
 */
export function speak(text: string, language: Language): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;

  // Stop anything already playing before starting fresh.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Hinglish is Hindi written in Roman script; an en-IN voice handles the
  // code-mixed pronunciation reasonably well, hi-IN for pure Hindi.
  utterance.lang = language === "Hindi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.95; // slightly slower for seniors
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang.replace("_", "-").toLowerCase() === utterance.lang) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2)));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
