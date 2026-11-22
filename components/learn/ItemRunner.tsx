"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, Lightbulb, X } from "@/components/learn/icons";
import type { Item } from "@/lib/path-data";
import { SayPanel } from "./SpeakTools";
import { cn } from "@/lib/utils";

const norm = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/[.!?,]+(\s|$)/g, "$1").trim();

const LABEL = { choose: "Pick the best answer", type: "Fill the gap", order: "Build the sentence", say: "Listen, then say it aloud" } as const;

/**
 * Friendly practice: one item at a time. A wrong answer is never a failure: we explain,
 * offer a hint, and let the student try again. Nothing is scored here; we only count how many
 * were right on the first try so the caller can show encouragement (e.g. checkpoint stars).
 */
export function ItemRunner({ items, onFinish, finishLabel = "Continue" }: { items: Item[]; onFinish: (r: { firstTry: number; total: number; missed: string[] }) => void; finishLabel?: string }) {
  const [i, setI] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const item = items[i];

  // per-item state
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<"idle" | "right" | "shown">("idle");
  const [hint, setHint] = useState(false);
  const [wrongOpts, setWrongOpts] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (state !== "idle") nextRef.current?.focus(); }, [state]);

  const done = state !== "idle";
  const miss = () => { if (tries === 0) setMissed((m) => [...m, item.id]); setTries((t) => t + 1); setMsg("Not quite. Have another go."); };
  const right = () => { setState("right"); setMsg(""); if (tries === 0) setFirstTry((n) => n + 1); };

  function chooseOpt(n: number) {
    if (done || item.t !== "choose" || wrongOpts.includes(n)) return;
    if (n === item.answer) right(); else { setWrongOpts([...wrongOpts, n]); miss(); }
  }
  function check() {
    if (done) return;
    if (item.t === "type") { if (item.answers.some((a) => norm(a) === norm(text))) right(); else miss(); }
    if (item.t === "order") { const attempt = picked.map((k) => k.slice(k.indexOf(":") + 1)).join(" "); if (item.answers.some((a) => norm(a) === norm(attempt))) right(); else miss(); }
  }
  function reveal() { if (tries === 0 || item.t === "say") setMissed((m) => (m.includes(item.id) ? m : [...m, item.id])); setState("shown"); setMsg(""); }
  function next() {
    if (i + 1 >= items.length) { onFinish({ firstTry, total: items.length, missed }); return; }
    setI(i + 1); setTries(0); setState("idle"); setHint(false); setWrongOpts([]); setText(""); setPicked([]); setMsg("");
  }

  const correctText = item.t === "choose" ? item.options[item.answer] : item.t === "type" ? item.answers[0] : item.t === "say" ? item.text : item.answers[0];
  const bankWords = item.t === "order" ? item.words.map((w, idx) => ({ w, idx })).filter((x) => !picked.includes(`${x.idx}:${x.w}`)) : [];
  const hintText = item.t === "say" ? "Say it slowly, one word at a time." : item.t === "order" ? "Start with the person or thing the sentence is about." : item.t === "choose" ? item.hint ?? "Read each option aloud and listen for the one that sounds natural." : item.hint ?? "Say the sentence aloud and listen for the missing word.";

  return (
    <div>
      <div className="mb-5 flex items-center gap-1.5" aria-label={`Exercise ${i + 1} of ${items.length}`}>
        {items.map((_, n) => <span key={n} className={cn("h-1.5 flex-1 rounded-full transition-colors", n < i ? "bg-brand-600" : n === i ? "bg-brand-400" : "bg-brand-100")} />)}
      </div>

      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">{LABEL[item.t]}</div>
      <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-brand-900">{item.t === "order" ? item.prompt : item.t === "say" ? "Say this sentence clearly" : item.q}</h2>

      {/* ---- choose ---- */}
      {item.t === "choose" && (
        <div className="mt-6 grid gap-3" role="group" aria-label="Answer options">
          {item.options.map((o, n) => {
            const isRight = done && n === item.answer;
            const isWrong = wrongOpts.includes(n);
            return (
              <button key={o} onClick={() => chooseOpt(n)} disabled={done || isWrong}
                className={cn("flex items-center gap-4 rounded-lg border px-4 py-3.5 text-left text-base font-medium transition-colors",
                  !done && !isWrong && "border-line bg-white hover:border-brand-500 hover:bg-brand-50",
                  isRight && "border-brand-600 bg-brand-50 text-brand-900",
                  isWrong && "border-slate-200 bg-slate-50 text-slate-400 line-through",
                  done && !isRight && !isWrong && "border-line opacity-50")}>
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold", isRight ? "bg-brand-600 text-white" : isWrong ? "bg-slate-300 text-white" : "bg-brand-100 text-brand-800")}>
                  {isRight ? <Check className="h-4 w-4" /> : isWrong ? <X className="h-4 w-4" /> : n + 1}
                </span>{o}
              </button>
            );
          })}
        </div>
      )}

      {/* ---- type ---- */}
      {item.t === "type" && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={done} autoFocus autoComplete="off" autoCapitalize="none" spellCheck={false}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) check(); }} aria-label="Your answer" placeholder="Type your answer"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:bg-brand-50" />
          {!done && <button onClick={check} disabled={!text.trim()} className="rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700 disabled:opacity-50">Check</button>}
        </div>
      )}

      {/* ---- order ---- */}
      {item.t === "order" && (
        <div className="mt-6">
          <div className={cn("flex min-h-[64px] flex-wrap items-center gap-2 rounded-lg border-2 border-dashed p-3", done ? "border-brand-500 bg-brand-50" : "border-brand-200 bg-white")} aria-label="Your sentence">
            {picked.length === 0 && <span className="text-sm text-muted">Tap the words below in the right order</span>}
            {picked.map((key) => { const w = key.slice(key.indexOf(":") + 1); return (
              <button key={key} disabled={done} onClick={() => setPicked(picked.filter((k) => k !== key))} className="rounded-md bg-accent-600 px-3 py-1.5 font-medium text-white hover:bg-accent-700 disabled:hover:bg-accent-600">{w}</button>
            ); })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Word bank">
            {bankWords.map(({ w, idx }) => (
              <button key={`${idx}:${w}`} disabled={done} onClick={() => setPicked([...picked, `${idx}:${w}`])} className="rounded-md border border-brand-200 bg-white px-3 py-1.5 font-medium text-brand-900 transition-colors hover:border-brand-500 hover:bg-brand-50">{w}</button>
            ))}
          </div>
          {!done && <button onClick={check} disabled={picked.length === 0} className="mt-5 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700 disabled:opacity-50">Check</button>}
        </div>
      )}

      {/* ---- say ---- */}
      {item.t === "say" && !done && <SayPanel key={item.id} text={item.text} onPass={right} onSkip={reveal} />}

      {/* ---- feedback ---- */}
      {msg && !done && item.t !== "say" && <p role="status" className="mt-4 text-sm font-medium text-slate-600">{msg}</p>}
      {!done && item.t !== "say" && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <button onClick={() => setHint(true)} className="flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-900"><Lightbulb className="h-4 w-4" />Need a hint?</button>
          {tries >= 2 && <button onClick={reveal} className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-brand-900"><Eye className="h-4 w-4" />Show me the answer</button>}
        </div>
      )}
      {hint && !done && item.t !== "say" && <p className="mt-3 rounded-lg bg-brand-50 p-3 text-sm text-brand-900">{hintText}</p>}

      {done && (
        <div role="status" className="mt-6 rounded-lg border-l-4 border-brand-600 bg-brand-50 p-4">
          <div className="font-semibold text-brand-900">{state === "right" ? (tries === 0 ? "Well done!" : "Got it!") : `Here is the answer: “${correctText}”`}</div>
          {(item.t === "choose" || item.t === "type") && <p className="mt-1 text-sm leading-relaxed text-ink">{item.why}</p>}
          {item.t === "order" && <p className="mt-1 text-sm text-ink">{state === "right" ? "That is a natural sentence." : "Read it aloud once, then continue."}</p>}
          {item.t === "say" && <p className="mt-1 text-sm text-ink">{state === "right" ? "Your pronunciation was clear." : "Practise this sentence aloud a few times today."}</p>}
        </div>
      )}
      {done && (
        <button ref={nextRef} onClick={next} className="mt-5 flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">
          {i + 1 >= items.length ? finishLabel : "Continue"} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
