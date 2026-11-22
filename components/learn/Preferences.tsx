"use client";
import { useMemo, useState } from "react";
import { Check, Volume2 } from "@/components/learn/icons";
import { saveProfile, useAuth } from "@/lib/auth";
import { GOAL_LABEL, LEVEL_LABEL } from "@/lib/course-core";
import type { Goal, Level } from "@/lib/path-data";
import { ACCENT_CODE, accentOf, curateVoices, shortName, speak, useVoices } from "@/lib/voice";
import { cn } from "@/lib/utils";

const SAMPLE = "Hello! This is how I will read your lessons aloud.";

function Choice({ on, onClick, title, text }: { on: boolean; onClick: () => void; title: string; text?: string }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={cn("flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors", on ? "border-accent-600 bg-brand-50" : "border-line bg-white hover:bg-brand-50")}>
      <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border", on ? "border-accent-600 bg-accent-600 text-white" : "border-brand-300")}>{on && <Check className="h-3 w-3" />}</span>
      <span><span className="block font-semibold text-brand-900">{title}</span>{text && <span className="block text-sm text-muted">{text}</span>}</span>
    </button>
  );
}

export function LevelPicker() {
  const { user, profile } = useAuth();
  if (!user) return null;
  return <div className="grid gap-3 sm:grid-cols-2">{(Object.keys(LEVEL_LABEL) as Level[]).map((l) => <Choice key={l} on={profile.level === l} onClick={() => saveProfile(user.id, { level: l })} title={l === "beginner" ? "Beginner" : "Intermediate"} text={LEVEL_LABEL[l].split(": ")[1]} />)}</div>;
}

export function GoalPicker() {
  const { user, profile } = useAuth();
  if (!user) return null;
  return <div className="grid gap-3 sm:grid-cols-2">{(Object.keys(GOAL_LABEL) as Goal[]).map((g) => <Choice key={g} on={profile.goal === g} onClick={() => saveProfile(user.id, { goal: g })} title={GOAL_LABEL[g]} />)}</div>;
}

/** A short list of good voices as cards: tap to choose, tap the speaker to hear it. */
export function VoicePicker() {
  const { user, profile } = useAuth();
  const all = useVoices();
  const [playing, setPlaying] = useState("");
  const voices = useMemo(() => curateVoices(all, profile.voiceURI), [all, profile.voiceURI]);
  if (!user) return null;
  const set = (patch: Parameters<typeof saveProfile>[1]) => saveProfile(user.id, patch);
  const play = (uri: string) => { setPlaying(uri); const ok = speak(SAMPLE, uri, profile.rate, { onend: () => setPlaying((p) => (p === uri ? "" : p)) }); if (!ok) setPlaying(""); };
  const speedLabel = profile.rate <= 0.75 ? "Slow" : profile.rate >= 1.05 ? "Fast" : "Normal";

  return (
    <div className="space-y-6">
      {voices.length === 0 ? (
        <p className="rounded-xl border border-line p-4 text-sm text-muted">Your device offers one default voice (or none). Voice choices appear here when your phone or computer has more English voices installed.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {voices.map((v) => {
            const on = profile.voiceURI === v.voiceURI; const acc = accentOf(v.lang); const isPlaying = playing === v.voiceURI;
            return (
              <div key={v.voiceURI} className={cn("flex items-center gap-3 rounded-xl border p-3 transition-colors", on ? "border-accent-600 bg-accent-50/60 shadow-[0_0_0_3px_var(--accent-ring)]" : "border-line bg-white hover:bg-brand-50")}>
                <button onClick={() => set({ voiceURI: v.voiceURI })} aria-pressed={on} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold", on ? "bg-accent-600 text-white" : "bg-brand-100 text-brand-700")}>{on ? <Check className="h-5 w-5" /> : ACCENT_CODE[acc] ?? "EN"}</span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-brand-900">{shortName(v)}</span><span className="block text-xs text-muted">{acc} accent</span></span>
                </button>
                <button onClick={() => play(v.voiceURI)} aria-label={`Hear ${shortName(v)}`} className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors", isPlaying ? "border-accent-600 bg-accent-600 text-white" : "border-line bg-white text-brand-700 hover:bg-brand-50")}><Volume2 className={cn("h-4 w-4", isPlaying && "animate-pulse")} /></button>
              </div>
            );
          })}
        </div>
      )}
      <div className="rounded-xl border border-line bg-white p-4">
        <label htmlFor="rate" className="mb-2 flex justify-between text-sm font-semibold text-brand-900"><span>Speaking speed</span><span className="text-muted">{speedLabel}</span></label>
        <div className="flex items-center gap-3"><span className="text-xs text-muted">Slow</span><input id="rate" type="range" min={0.6} max={1.2} step={0.05} value={profile.rate} onChange={(e) => set({ rate: Number(e.target.value) })} className="w-full accent-accent-600" /><span className="text-xs text-muted">Fast</span></div>
        <button onClick={() => play(profile.voiceURI)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50"><Volume2 className="h-4 w-4" />Hear a sample</button>
      </div>
    </div>
  );
}

/** Level, goal and voice together (used in the first-time setup). */
export function Preferences() {
  return (
    <div className="space-y-8">
      <section><h3 className="font-display text-lg font-semibold text-brand-900">Your level</h3><p className="mb-3 text-sm text-muted">Intermediate students skip the beginner-only grammar lessons and move faster.</p><LevelPicker /></section>
      <section><h3 className="font-display text-lg font-semibold text-brand-900">Your main goal</h3><p className="mb-3 text-sm text-muted">We mark the lessons that matter most for it.</p><GoalPicker /></section>
      <section><h3 className="font-display text-lg font-semibold text-brand-900">Voice for listening</h3><p className="mb-3 text-sm text-muted">Pick the accent you want to hear in the lessons.</p><VoicePicker /></section>
    </div>
  );
}

/** Shown once, the first time a student opens the dashboard. */
export function OnboardingDialog() {
  const { user, profile } = useAuth();
  if (!user || profile.onboarded) return null;
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[rgba(19,26,22,.35)] backdrop-blur-[2px] p-4" role="dialog" aria-modal="true" aria-label="Set up your learning">
      <div className="mx-auto my-8 w-full max-w-2xl rounded-[var(--radius-xl)] bg-white p-6 shadow-2xl sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-brand-900">Welcome, {user.name.split(" ")[0]}. Let&apos;s set up your learning.</h2>
        <p className="mb-6 mt-1 text-muted">Three quick choices make the course fit you. You can change them any time in Settings.</p>
        <Preferences />
        <button onClick={() => saveProfile(user.id, { onboarded: true })} className="mt-8 w-full rounded-lg bg-accent-600 py-3.5 font-semibold text-white hover:bg-accent-700">Start learning</button>
      </div>
    </div>
  );
}
