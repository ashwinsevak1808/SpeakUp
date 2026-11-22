"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Mic, MicOff, RotateCcw, ShieldCheck, Square, Volume2 } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { speak } from "@/lib/voice";
import { SAY_PASS, checkSpeech, diffWords, similarity, type SpeakCheck } from "@/lib/speech";
import { cn } from "@/lib/utils";

/* ---------------- listen (uses the voice the student chose) ---------------- */
export function ListenButton({ text, label = "Listen", className = "" }: { text: string; label?: string; className?: string }) {
  const { profile } = useAuth();
  const [playing, setPlaying] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  if (!supported) return null;
  return (
    <button onClick={() => speak(text, profile.voiceURI, profile.rate, { onstart: () => setPlaying(true), onend: () => setPlaying(false) })} aria-label={`${label}: ${text}`}
      className={cn("btn-base btn-secondary btn-md", playing && "!text-[var(--accent-text)] !shadow-[inset_0_0_0_1px_var(--accent)]", className)}>
      <Volume2 className={cn("h-4 w-4", playing && "animate-pulse")} />{playing ? "Playing…" : label}
    </button>
  );
}

/** A small round speaker button for one example sentence. */
export function SpeakIcon({ text, className = "" }: { text: string; className?: string }) {
  const { profile } = useAuth();
  const [playing, setPlaying] = useState(false);
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return (
    <button onClick={() => speak(text, profile.voiceURI, profile.rate, { onstart: () => setPlaying(true), onend: () => setPlaying(false) })} aria-label={`Listen: ${text}`} title="Listen"
      className={cn("grid size-7 shrink-0 place-items-center rounded-full transition-colors", playing ? "bg-[var(--accent)] text-white" : "text-[var(--text-subtle)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent-text)]", className)}>
      <Volume2 className={cn("h-3.5 w-3.5", playing && "animate-pulse")} />
    </button>
  );
}

/* ---------------- speech recognition (browser turns speech into text; we never store audio) ---------------- */
type SRResult = { 0: { transcript: string }; isFinal: boolean; length: number };
type SRInstance = { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; abort(): void; onresult: ((e: { results: ArrayLike<SRResult> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const getSR = (): (new () => SRInstance) | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SRInstance; webkitSpeechRecognition?: new () => SRInstance };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export function useRecognizer(continuous: boolean) {
  const [state, setState] = useState<{ listening: boolean; text: string; error: string }>({ listening: false, text: "", error: "" });
  const rec = useRef<SRInstance | null>(null);
  const supported = !!getSR();

  const start = useCallback(() => {
    const SR = getSR(); if (!SR) return;
    rec.current?.abort();
    const r = new SR(); rec.current = r;
    r.lang = "en-IN"; r.continuous = continuous; r.interimResults = true;
    r.onresult = (e) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + " "; setState((s) => ({ ...s, text: t.trim() })); };
    r.onerror = (e) => setState((s) => ({ ...s, error: e.error === "no-speech" ? "I did not hear anything. Try again, a little louder." : e.error === "not-allowed" || e.error === "service-not-allowed" ? "Microphone permission is blocked. Allow it in your browser and try again." : "Speech checking is not available right now." }));
    r.onend = () => setState((s) => ({ ...s, listening: false }));
    setState({ listening: true, text: "", error: "" });
    try { r.start(); } catch { setState((s) => ({ ...s, listening: false })); }
  }, [continuous]);
  const stop = useCallback(() => rec.current?.stop(), []);
  const reset = useCallback(() => { rec.current?.abort(); setState({ listening: false, text: "", error: "" }); }, []);
  useEffect(() => () => rec.current?.abort(), []);
  return { supported, ...state, start, stop, reset };
}

const PRIVACY = "Your voice is turned into text by your browser. We do not record or store your audio. (In Chrome, the browser may use Google's speech service to do this.)";

/* ---------------- "say it" exercise ---------------- */
export function SayPanel({ text, onPass, onSkip }: { text: string; onPass: () => void; onSkip: () => void }) {
  const rc = useRecognizer(false);
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState<{ score: number; said: string } | null>(null);
  const handled = useRef("");

  // when listening ends, judge what was heard
  useEffect(() => {
    if (rc.listening || !rc.text || handled.current === rc.text) return;
    handled.current = rc.text;
    const score = similarity(text, rc.text);
    // setState inside an effect reacting to external speech events is intended here
    setResult({ score, said: rc.text }); setTries((t) => t + 1);
    if (score >= SAY_PASS) onPass();
  }, [rc.listening, rc.text, text, onPass]);

  if (!rc.supported) {
    return (
      <div className="mt-5 rounded-[var(--radius-lg)] p-4 shadow-[inset_0_0_0_1px_var(--border)]">
        <p className="ty-body ty-muted">This browser cannot check speech (Chrome or Edge on your phone or computer can). Say the sentence aloud, then continue.</p>
        <div className="mt-3 flex flex-wrap gap-3"><ListenButton text={text} /><button onClick={onPass} className="btn-base btn-primary btn-md">I said it aloud</button></div>
      </div>
    );
  }
  return (
    <div className="mt-5">
      <p className="rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] p-4 text-[22px] font-semibold leading-snug tracking-[-0.015em] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)]">&ldquo;{text}&rdquo;</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ListenButton text={text} label="Listen first" />
        {!rc.listening
          ? <button onClick={() => { handled.current = ""; setResult(null); rc.start(); }} className="btn-base btn-primary btn-lg"><Mic className="h-4 w-4" />{tries ? "Try again" : "Tap and say it"}</button>
          : <button onClick={rc.stop} className="btn-base btn-secondary btn-lg !text-[var(--accent-text)] !shadow-[inset_0_0_0_1.5px_var(--accent),0_0_0_4px_var(--accent-ring)]"><span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />Listening… tap when done</button>}
      </div>
      {rc.listening && rc.text && <p className="ty-body ty-muted mt-3 italic">&ldquo;{rc.text}&rdquo;</p>}
      {rc.error && <p role="alert" className="ty-body ty-secondary mt-3">{rc.error}</p>}
      {result && (
        <div role="status" className="mt-4 rounded-[var(--radius-lg)] p-4 shadow-[inset_0_0_0_1px_var(--border)]">
          <div className="ty-label ty-caps ty-subtle">We heard</div>
          <p className="mt-1 text-[15px] text-[var(--text-primary)]">&ldquo;{result.said}&rdquo;</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {diffWords(text, result.said).map((d, i) => <span key={i} className={cn("rounded px-2 py-0.5 text-sm font-medium", d.ok ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-white text-[var(--text-muted)] underline decoration-[var(--text-subtle)] decoration-dashed decoration-2 underline-offset-4 shadow-[inset_0_0_0_1px_var(--border)]")}>{d.w}</span>)}
          </div>
          <p className="ty-subject mt-3 text-[var(--accent-text)]">{result.score >= SAY_PASS ? "Clear and correct. Well done!" : "Nearly. Listen once more, then say the underlined words clearly."}</p>
        </div>
      )}
      {tries >= 2 && !(result && result.score >= SAY_PASS) && <button onClick={onSkip} className="btn-base btn-ghost btn-sm mt-2">Skip this one</button>}
      <p className="ty-note ty-subtle mt-4 flex gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />{PRIVACY}</p>
    </div>
  );
}

/* ---------------- free speaking task: checks length and the words/grammar the lesson asks for ---------------- */
export function SpeakCheckPanel({ check, onPass, manual }: { check: SpeakCheck | undefined; onPass: (pass: boolean) => void; manual: () => void }) {
  const rc = useRecognizer(true);
  const res = checkSpeech(rc.text, check);
  const reported = useRef(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    if (res.pass && !reported.current) { reported.current = true; onPass(true); }
  }, [res.pass, onPass]);

  if (!rc.supported || declined) {
    return (
      <div className="ty-body ty-muted rounded-[var(--radius-lg)] p-4 shadow-[inset_0_0_0_1px_var(--border)]">
        {rc.supported ? "No problem. " : "This browser cannot check speech (Chrome or Edge can). "}Speak your answer aloud and use the checklist below.
        <button onClick={manual} className="ml-2 font-semibold text-[var(--accent-text)] underline underline-offset-4">Use the checklist</button>
      </div>
    );
  }
  const pct = Math.min(100, Math.round((res.count / res.minWords) * 100));
  return (
    <div className="rounded-[var(--radius-lg)] p-4 shadow-[inset_0_0_0_1px_var(--border)] sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        {!rc.listening
          ? <button onClick={() => { reported.current = false; rc.start(); }} className="btn-base btn-primary btn-lg"><Mic className="h-4 w-4" />{rc.text ? "Speak again" : "Start speaking"}</button>
          : <button onClick={rc.stop} className="btn-base btn-secondary btn-lg !text-[var(--accent-text)] !shadow-[inset_0_0_0_1.5px_var(--accent),0_0_0_4px_var(--accent-ring)]"><Square className="h-4 w-4 animate-pulse" />Stop</button>}
        {rc.text && !rc.listening && <button onClick={rc.reset} className="btn-base btn-ghost btn-sm"><RotateCcw className="h-4 w-4" />Clear</button>}
        <button onClick={() => setDeclined(true)} className="btn-base btn-ghost btn-sm ml-auto"><MicOff className="h-3.5 w-3.5" />I can&apos;t use the microphone</button>
      </div>

      <div className="mt-4 min-h-[56px] rounded-[var(--radius-md)] bg-[var(--surface-subtle)] p-3 text-[15px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)]">{rc.text ? <>&ldquo;{rc.text}&rdquo;</> : <span className="text-[var(--text-subtle)]">Your words will appear here as you speak.</span>}</div>
      {rc.error && <p role="alert" className="ty-body ty-secondary mt-2">{rc.error}</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="ty-label ty-subtle mb-1.5 flex justify-between"><span>Length</span><span>{res.count} of {res.minWords} words</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]"><div className={cn("h-full rounded-full transition-all", res.enough ? "bg-[var(--accent)]" : "bg-[var(--accent-soft)]")} style={{ width: `${pct}%` }} /></div>
        </div>
        {res.targets.length > 0 && (
          <div>
            <div className="ty-label ty-subtle mb-1.5">Try to use (any {res.needMatches})</div>
            <div className="flex flex-wrap gap-1.5">{res.targets.map((t) => <span key={t.t} className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", t.ok ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{t.ok && <Check className="h-3 w-3" />}{t.t}</span>)}</div>
          </div>
        )}
      </div>
      {res.pass && <p className="ty-subject mt-3 text-[var(--accent-text)]">Excellent. That is a complete answer. You can finish the lesson.</p>}
      <p className="ty-note ty-subtle mt-4 flex gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />{PRIVACY}</p>
    </div>
  );
}
