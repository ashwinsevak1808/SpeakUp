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
