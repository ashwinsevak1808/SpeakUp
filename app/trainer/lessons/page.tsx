"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "@/components/learn/icons";
import type { Lesson, Week } from "@/lib/path-data";
import { validateLesson } from "@/lib/path-validate";
import { api } from "@/components/trainer/api";
import { cn } from "@/lib/utils";

const TEMPLATE = (week: number, day: number): Lesson => ({
  id: `d${String(day).padStart(2, "0")}`, day, week, title: "New lesson title", kind: "Grammar", minutes: 15,
  goal: "What the student will be able to do after this lesson.",
  warm: { phrase: "A useful phrase.", meaning: "What it means and when to use it.", example: "An example sentence." },
  learn: [{ title: "First idea", text: "Explain it in 2 or 3 simple sentences.", examples: ["Example one.", "Example two."], tip: "An optional tip." }],
  practice: [
    { t: "choose", id: `d${String(day).padStart(2, "0")}-1`, q: "Pick the correct sentence.", options: ["Right one.", "Wrong one.", "Another wrong one."], answer: 0, why: "Explain why the answer is right." },
    { t: "type", id: `d${String(day).padStart(2, "0")}-2`, q: "She ___ tea every day. (drink)", answers: ["drinks"], why: "Explain the rule.", hint: "An optional hint." },
    { t: "order", id: `d${String(day).padStart(2, "0")}-3`, prompt: "Say in English: Mujhe chai pasand hai.", words: ["tea.", "I", "like"], answers: ["I like tea."] },
    { t: "say", id: `d${String(day).padStart(2, "0")}-s1`, text: "I like tea." },
  ],
  speak: { prompt: "A speaking task for the student.", model: "A model answer the student can listen to.", checklist: ["I spoke aloud", "I used the new grammar"], check: { minWords: 20, mustInclude: ["like"] } },
  recap: ["Key point one.", "Key point two."],
});

export default function LessonsEditor() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [sel, setSel] = useState<string>("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => api<{ weeks: Week[] }>("/api/content").then((r) => { if (r.ok) setWeeks(r.data.weeks); }), []);
  useEffect(() => { load(); }, [load]);
  const all = useMemo(() => weeks.flatMap((w) => w.lessons), [weeks]);

  function pick(l: Lesson) { setSel(l.id); setText(JSON.stringify(l, null, 2)); setErrors([]); setMsg(""); }
  function create() {
    const week = Math.max(1, ...weeks.filter((w) => !w.comingSoon).map((w) => w.n));
    const day = Math.max(0, ...all.map((l) => l.day)) + 1;
    const l = TEMPLATE(week, day); setSel("(new)"); setText(JSON.stringify(l, null, 2)); setErrors([]); setMsg("Edit the fields below, then press Save. The week number decides where it appears.");
  }
  function parse(): Lesson | null {
    try { return JSON.parse(text) as Lesson; } catch (e) { setErrors([`This is not valid JSON: ${(e as Error).message}`]); return null; }
  }
  function check() { const l = parse(); if (!l) return null; const e = validateLesson(l); setErrors(e); setMsg(e.length ? "" : "Looks good. No problems found."); return e.length ? null : l; }
  async function save() {
    const l = check(); if (!l) return;
    const r = await api("/api/content/lesson", "PUT", { lesson: l });
    if (r.ok) { setMsg("Saved. Students see the change the next time they open the app."); setSel(l.id); load(); } else setErrors(r.data.errors ?? [r.data.error ?? "Could not save."]);
  }
  async function remove() {
    if (sel === "(new)" || !confirm(`Delete lesson ${sel}? Students who finished it keep their progress.`)) return;
    const r = await api(`/api/content/lesson?id=${encodeURIComponent(sel)}`, "DELETE");
    if (r.ok) { setSel(""); setText(""); setMsg("Deleted."); load(); } else setErrors([r.data.error ?? "Could not delete."]);
  }
  async function reset() {
    if (!confirm("Throw away ALL your lesson edits and go back to the built-in course?")) return;
    const r = await api("/api/content/reset", "POST"); if (r.ok) { setSel(""); setText(""); setMsg("Reset to the built-in course."); load(); }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="h-fit nx-card p-4">
        <button onClick={create} className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-600 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"><Plus className="h-4 w-4" />New lesson</button>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          {weeks.filter((w) => w.lessons.length).map((w) => (
            <div key={w.n}>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Week {w.n}: {w.title}</div>
              {w.lessons.map((l) => <button key={l.id} onClick={() => pick(l)} className={cn("block w-full rounded-lg px-3 py-2 text-left text-sm", sel === l.id ? "bg-accent-600 text-white" : "hover:bg-brand-50")}><span className="font-semibold">Day {l.day}</span> · {l.title}</button>)}
            </div>
          ))}
        </div>
        <button onClick={reset} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-xs font-semibold text-muted hover:text-live"><RotateCcw className="h-3.5 w-3.5" />Reset all to built-in</button>
      </aside>

      <section>
        {!sel ? (
          <div className="rounded-xl border border-dashed border-line p-10 text-center text-muted"><p className="font-display text-lg font-semibold text-brand-900">Pick a lesson to edit, or add a new one.</p><p className="mx-auto mt-2 max-w-md text-sm">Lessons are stored on the server. Changes appear for students the next time they open the app, with no code change or redeploy.</p></div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="mr-auto font-display text-lg font-semibold text-brand-900">{sel === "(new)" ? "New lesson" : `Editing ${sel}`}</h2>
              <button onClick={check} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50">Check</button>
              {sel !== "(new)" && <a href={`/learn/lesson/${sel}`} target="_blank" rel="noopener" className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50">Preview</a>}
              {sel !== "(new)" && <button onClick={remove} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-live" aria-label="Delete lesson"><Trash2 className="h-4 w-4" /></button>}
              <button onClick={save} className="flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-700"><Save className="h-4 w-4" />Save</button>
            </div>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setMsg(""); }} spellCheck={false} aria-label="Lesson JSON" className="h-[62vh] w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-[13px] leading-relaxed outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-500/20" />
            {errors.length > 0 && <ul role="alert" className="mt-3 space-y-1 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">{errors.map((e) => <li key={e}>• {e}</li>)}</ul>}
            {msg && <p role="status" className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-semibold text-ok">{msg}</p>}
            <details className="mt-4 nx-card p-4 text-sm text-muted">
              <summary className="cursor-pointer font-semibold text-brand-900">Exercise types cheat sheet</summary>
              <ul className="mt-3 space-y-2">
                <li><b className="text-brand-900">choose</b>: q, options (list), answer (0 = first option), why.</li>
                <li><b className="text-brand-900">type</b>: q containing ___ for the gap, answers (list of accepted answers), why, optional hint.</li>
                <li><b className="text-brand-900">order</b>: prompt, words (the sentence words in a mixed order), answers (accepted sentences; first one must use exactly those words).</li>
                <li><b className="text-brand-900">say</b>: text the student must say aloud. The browser checks it.</li>
                <li><b className="text-brand-900">levels</b> <code>[&quot;beginner&quot;]</code> hides the lesson for intermediate students. <b className="text-brand-900">goals</b> (everyday, work, interview, study) marks it &quot;For your goal&quot;.</li>
                <li><b className="text-brand-900">speak.check</b>: minWords and mustInclude words that the speech check looks for.</li>
              </ul>
            </details>
          </>
        )}
      </section>
    </div>
  );
}
