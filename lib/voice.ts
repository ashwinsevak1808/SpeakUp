"use client";
import { useEffect, useState } from "react";

/** Voices installed on the student's device (they differ per phone/computer). English only. */
export function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en")));
    load(); synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, []);
  return voices;
}
export const accentOf = (lang: string) => ({ "en-in": "Indian", "en-gb": "British", "en-us": "American", "en-au": "Australian", "en-za": "South African", "en-ie": "Irish" } as Record<string, string>)[lang.toLowerCase()] ?? lang;

export function speak(text: string, voiceURI: string, rate: number, handlers: { onstart?: () => void; onend?: () => void } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis; synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const all = synth.getVoices();
  u.voice = all.find((v) => v.voiceURI === voiceURI) ?? all.find((v) => v.lang === "en-IN") ?? all.find((v) => v.lang.startsWith("en")) ?? null;
  u.lang = u.voice?.lang ?? "en-IN"; u.rate = rate;
  u.onstart = () => handlers.onstart?.(); u.onend = () => handlers.onend?.(); u.onerror = () => handlers.onend?.();
  synth.speak(u); return true;
}

/* ---------- a short, good list instead of every voice on the device ---------- */
const NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|princess|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
const ACCENT_ORDER = ["Indian", "American", "British", "Australian", "Irish", "South African"];
export const ACCENT_CODE: Record<string, string> = { Indian: "IN", American: "US", British: "GB", Australian: "AU", Irish: "IE", "South African": "ZA" };

/** Higher is better: natural/premium voices first, then well-known clear ones, then the rest. */
const quality = (v: SpeechSynthesisVoice) => (/natural|premium|enhanced|neural/i.test(v.name) ? 3 : 0) + (/google|samantha|daniel|karen|moira|tessa|rishi|veena|serena|lekha/i.test(v.name) ? 2 : 0) + (v.localService ? 0 : 1);
/** The name without the "(English (India))" style suffix. */
export const shortName = (v: SpeechSynthesisVoice) => v.name.replace(/\s*\(.*\)\s*$/, "").replace(/^(Microsoft|Google)\s+/i, "").replace(/\s+(Online|Natural)\b.*$/i, "").trim() || v.name;

/** Up to two voices per accent, at most eight in all. The student's current voice is always kept. */
export function curateVoices(all: SpeechSynthesisVoice[], selectedURI: string, max = 8): SpeechSynthesisVoice[] {
  const ok = all.filter((v) => !NOVELTY.test(shortName(v)));
  const byAccent = new Map<string, SpeechSynthesisVoice[]>();
  for (const v of ok) { const a = accentOf(v.lang); if (!ACCENT_ORDER.includes(a)) continue; (byAccent.get(a) ?? byAccent.set(a, []).get(a)!).push(v); }
  const picked: SpeechSynthesisVoice[] = [];
  for (const a of ACCENT_ORDER) {
    const seen = new Set<string>();
    const list = (byAccent.get(a) ?? []).sort((x, y) => quality(y) - quality(x)).filter((v) => !seen.has(shortName(v)) && !!seen.add(shortName(v)));
    picked.push(...list.slice(0, 2));
  }
  const out = picked.slice(0, max);
  const cur = all.find((v) => v.voiceURI === selectedURI);
  if (cur && !out.some((v) => v.voiceURI === cur.voiceURI)) out.unshift(cur);
  return out;
}
