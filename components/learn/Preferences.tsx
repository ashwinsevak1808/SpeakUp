"use client";
import { useMemo, useState } from "react";
import { Check, Volume2 } from "@/components/learn/icons";
import { saveProfile, useAuth } from "@/lib/auth";
import { GOAL_LABEL, LEVEL_LABEL } from "@/lib/course-core";
import type { Goal, Level } from "@/lib/path-data";
import { accentOf, speak, useVoices } from "@/lib/voice";
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

/** Level, goal and voice. Changes are saved straight away. */
export function Preferences() {
  const { user, profile } = useAuth();
  const voices = useVoices();
  const [accent, setAccent] = useState("all");
  const accents = useMemo(() => ["all", ...Array.from(new Set(voices.map((v) => accentOf(v.lang))))], [voices]);
  const shown = voices.filter((v) => accent === "all" || accentOf(v.lang) === accent);
  if (!user) return null;
  const set = (patch: Parameters<typeof saveProfile>[1]) => saveProfile(user.id, patch);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-display text-lg font-semibold text-brand-900">Your level</h3>
        <p className="mb-3 text-sm text-muted">Intermediate students skip the beginner-only grammar lessons and move faster.</p>
        <div className="grid gap-3 sm:grid-cols-2">{(Object.keys(LEVEL_LABEL) as Level[]).map((l) => <Choice key={l} on={profile.level === l} onClick={() => set({ level: l })} title={l === "beginner" ? "Beginner" : "Intermediate"} text={LEVEL_LABEL[l].split(": ")[1]} />)}</div>
      </section>
      <section>
        <h3 className="font-display text-lg font-semibold text-brand-900">Your main goal</h3>
        <p className="mb-3 text-sm text-muted">We mark the lessons that matter most for it.</p>
        <div className="grid gap-3 sm:grid-cols-2">{(Object.keys(GOAL_LABEL) as Goal[]).map((g) => <Choice key={g} on={profile.goal === g} onClick={() => set({ goal: g })} title={GOAL_LABEL[g]} />)}</div>
      </section>
      <section>
        <h3 className="font-display text-lg font-semibold text-brand-900">Voice for listening</h3>
        <p className="mb-3 text-sm text-muted">Choose the accent and tone you want to hear in the lessons.</p>
        {voices.length === 0 ? (
          <p className="rounded-xl border border-line p-4 text-sm text-muted">Your device offers one default voice (or none). Voice choices appear here when your phone or computer has more English voices installed.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Accent">{accents.map((a) => <button key={a} onClick={() => setAccent(a)} aria-pressed={accent === a} className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold", accent === a ? "border-accent-600 bg-accent-600 text-white" : "border-line bg-white text-brand-900 hover:bg-brand-50")}>{a === "all" ? "All accents" : a}</button>)}</div>
            <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {shown.map((v) => (
                <div key={v.voiceURI} className={cn("flex items-center gap-2 rounded-xl border p-2.5 pl-4", profile.voiceURI === v.voiceURI ? "border-accent-600 bg-brand-50" : "border-line bg-white")}>
                  <button onClick={() => set({ voiceURI: v.voiceURI })} aria-pressed={profile.voiceURI === v.voiceURI} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold text-brand-900">{v.name}</span><span className="text-xs text-muted">{accentOf(v.lang)}</span></button>
                  <button onClick={() => speak(SAMPLE, v.voiceURI, profile.rate)} aria-label={`Preview ${v.name}`} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-white"><Volume2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-5">
          <label htmlFor="rate" className="mb-1 flex justify-between text-sm font-semibold text-brand-900"><span>Speaking speed</span><span className="text-muted">{profile.rate <= 0.75 ? "Slow" : profile.rate >= 1.05 ? "Fast" : "Normal"}</span></label>
          <input id="rate" type="range" min={0.6} max={1.2} step={0.05} value={profile.rate} onChange={(e) => set({ rate: Number(e.target.value) })} className="w-full accent-accent-600" />
          <button onClick={() => speak(SAMPLE, profile.voiceURI, profile.rate)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50"><Volume2 className="h-4 w-4" />Hear a sample</button>
        </div>
      </section>
    </div>
  );
}

/** Shown once, the first time a student opens the dashboard. */
export function OnboardingDialog() {
  const { user, profile } = useAuth();
  if (!user || profile.onboarded) return null;
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/35 backdrop-blur-[2px] p-4" role="dialog" aria-modal="true" aria-label="Set up your learning">
      <div className="mx-auto my-8 w-full max-w-2xl rounded-[var(--radius-xl)] bg-white p-6 shadow-2xl sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-brand-900">Welcome, {user.name.split(" ")[0]}. Let&apos;s set up your learning.</h2>
        <p className="mb-6 mt-1 text-muted">Three quick choices make the course fit you. You can change them any time in Settings.</p>
        <Preferences />
        <button onClick={() => saveProfile(user.id, { onboarded: true })} className="mt-8 w-full rounded-lg bg-accent-600 py-3.5 font-semibold text-white hover:bg-accent-700">Start learning</button>
      </div>
    </div>
  );
}
