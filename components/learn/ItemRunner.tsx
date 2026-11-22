"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, Lightbulb, X } from "@/components/learn/icons";
import type { Item } from "@/lib/path-data";
import { SayPanel } from "./SpeakTools";
import { btn } from "./ui";
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

  // Keyboard: 1-4 picks an option. (Enter already presses the focused Continue button.)
  const onKey = useRef<(e: KeyboardEvent) => void>(() => {});
  useLayoutEffect(() => {
    onKey.current = (e) => {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || el.closest("input, textarea, select, [contenteditable]")) return;
      if (item.t === "choose" && /^[1-9]$/.test(e.key) && Number(e.key) <= item.options.length) { e.preventDefault(); chooseOpt(Number(e.key) - 1); }
    };
  });
  useEffect(() => { const h = (e: KeyboardEvent) => onKey.current(e); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, []);

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
      <div className="mb-5 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1" aria-label={`Exercise ${i + 1} of ${items.length}`}>
          {items.map((_, n) => <span key={n} className={cn("h-1.5 flex-1 rounded-full transition-colors", n < i ? "bg-[var(--accent)]" : n === i ? "bg-[var(--accent-soft)]" : "bg-[var(--surface-sunken)]")} />)}
        </div>
        <span className="ty-label ty-mono ty-subtle shrink-0">{i + 1} / {items.length}</span>
      </div>

      <div className="ty-label ty-caps ty-subtle">{LABEL[item.t]}</div>
      <h2 className="mt-2 text-[21px] font-semibold leading-snug tracking-[-0.015em] text-[var(--text-primary)]">{item.t === "order" ? item.prompt : item.t === "say" ? "Say this sentence clearly" : item.q}</h2>

      {/* ---- choose ---- */}
      {item.t === "choose" && (
        <div className="mt-5 grid gap-2.5" role="group" aria-label="Answer options">
          {item.options.map((o, n) => {
            const isRight = done && n === item.answer;
            const isWrong = wrongOpts.includes(n);
            return (
              <button key={o} onClick={() => chooseOpt(n)} disabled={done || isWrong}
                className={cn("flex items-center gap-3.5 rounded-[var(--radius-lg)] px-4 py-3.5 text-left text-[15px] font-medium transition-colors",
                  !done && !isWrong && "bg-white text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)] hover:bg-[color-mix(in_srgb,var(--accent-subtle)_45%,#fff)] hover:shadow-[inset_0_0_0_1px_var(--border-accent)]",
                  isRight && "bg-[var(--accent-subtle)] text-[var(--text-primary)] shadow-[inset_0_0_0_1.5px_var(--accent)]",
                  isWrong && "bg-[var(--surface-subtle)] text-[var(--text-subtle)] line-through shadow-[inset_0_0_0_1px_var(--border)]",
                  done && !isRight && !isWrong && "text-[var(--text-subtle)] opacity-60 shadow-[inset_0_0_0_1px_var(--border)]")}>
                <span className={cn("ty-mono grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold", isRight ? "bg-[var(--accent)] text-white" : isWrong ? "bg-[var(--surface-sunken)] text-[var(--text-subtle)]" : "bg-[var(--surface-sunken)] text-[var(--text-secondary)]")}>
                  {isRight ? <Check className="h-4 w-4" /> : isWrong ? <X className="h-4 w-4" /> : n + 1}
                </span>{o}
              </button>
            );
          })}
          {!done && <p className="ty-note ty-subtle hidden sm:block">Tip: press 1 to {item.options.length} on your keyboard to answer.</p>}
        </div>
      )}

      {/* ---- type ---- */}
      {item.t === "type" && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={done} autoFocus autoComplete="off" autoCapitalize="none" spellCheck={false}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) check(); }} aria-label="Your answer" placeholder="Type your answer"
            className="h-12 w-full rounded-[var(--radius-lg)] bg-white px-4 text-[16px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border-strong)] outline-none transition-shadow placeholder:text-[var(--text-subtle)] focus:shadow-[inset_0_0_0_1.5px_var(--accent),0_0_0_4px_var(--accent-ring)] disabled:bg-[var(--surface-subtle)]" />
          {!done && <button onClick={check} disabled={!text.trim()} className={btn("primary", "lg", "h-12 px-7")}>Check</button>}
        </div>
      )}

      {/* ---- order ---- */}
      {item.t === "order" && (
        <div className="mt-5">
          <div className={cn("flex min-h-[64px] flex-wrap items-center gap-2 rounded-[var(--radius-lg)] border border-dashed p-3", done ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : "border-[var(--border-strong)] bg-[var(--surface-subtle)]")} aria-label="Your sentence">
            {picked.length === 0 && <span className="ty-body ty-subtle">Tap the words below in the right order</span>}
            {picked.map((key) => { const w = key.slice(key.indexOf(":") + 1); return (
              <button key={key} disabled={done} onClick={() => setPicked(picked.filter((k) => k !== key))} className="rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-1.5 text-[15px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:hover:bg-[var(--accent)]">{w}</button>
            ); })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Word bank">
            {bankWords.map(({ w, idx }) => (
              <button key={`${idx}:${w}`} disabled={done} onClick={() => setPicked([...picked, `${idx}:${w}`])} className="rounded-[var(--radius-md)] bg-white px-3 py-1.5 text-[15px] font-medium text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border-strong)] transition-colors hover:bg-[var(--accent-subtle)] hover:shadow-[inset_0_0_0_1px_var(--border-accent)]">{w}</button>
            ))}
          </div>
          {!done && <button onClick={check} disabled={picked.length === 0} className={btn("primary", "lg", "mt-5")}>Check</button>}
        </div>
      )}

      {/* ---- say ---- */}
      {item.t === "say" && !done && <SayPanel key={item.id} text={item.text} onPass={right} onSkip={reveal} />}

      {/* ---- feedback ---- */}
      {msg && !done && item.t !== "say" && <p role="status" className="ty-body ty-500 ty-secondary mt-4">{msg}</p>}
      {!done && item.t !== "say" && (
        <div className="mt-4 flex flex-wrap items-center gap-1">
          <button onClick={() => setHint(true)} className={btn("ghost", "sm", "!text-[var(--accent-text)]")}><Lightbulb className="h-4 w-4" />Need a hint?</button>
          {tries >= 2 && <button onClick={reveal} className={btn("ghost", "sm")}><Eye className="h-4 w-4" />Show me the answer</button>}
        </div>
      )}
      {hint && !done && item.t !== "say" && <p className="ty-body mt-2 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] p-3 text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--border)]">{hintText}</p>}

      {done && (
        <div role="status" className={cn("mt-5 flex gap-3 rounded-[var(--radius-lg)] p-4", state === "right" ? "bg-[var(--accent-subtle)]" : "bg-[var(--surface-subtle)] shadow-[inset_0_0_0_1px_var(--border)]")}>
          <span className={cn("grid size-6 shrink-0 place-items-center rounded-full", state === "right" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{state === "right" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Lightbulb className="h-3.5 w-3.5" />}</span>
          <div>
            <div className="ty-subject ty-ink">{state === "right" ? (tries === 0 ? "Well done!" : "Got it!") : `Here is the answer: “${correctText}”`}</div>
            {(item.t === "choose" || item.t === "type") && <p className="ty-body ty-secondary mt-1">{item.why}</p>}
            {item.t === "order" && <p className="ty-body ty-secondary mt-1">{state === "right" ? "That is a natural sentence." : "Read it aloud once, then continue."}</p>}
            {item.t === "say" && <p className="ty-body ty-secondary mt-1">{state === "right" ? "Your pronunciation was clear." : "Practise this sentence aloud a few times today."}</p>}
          </div>
        </div>
      )}
      {done && (
        <div className="nx-dash-h mt-6 pt-5">
          <button ref={nextRef} onClick={next} className={btn("primary", "lg")}>
            {i + 1 >= items.length ? finishLabel : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
