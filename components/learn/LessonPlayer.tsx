"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Flag, Lock, Mic, PenLine, Sparkles, Sun } from "@/components/learn/icons";
import { completeLesson, setStep as saveStep, updateMissed, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { statusOf } from "@/lib/path-state";
import { ItemRunner } from "./ItemRunner";
import { ListenButton, SpeakCheckPanel } from "./SpeakTools";
import { EnrolDialog } from "./EnrolDialog";
import { Card } from "./ui";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Warm-up", icon: Sun },
  { label: "Learn", icon: BookOpen },
  { label: "Try it", icon: PenLine },
  { label: "Speak", icon: Mic },
  { label: "Finish", icon: Flag },
];

export const nodeHref = (n: { kind: string; id: string }) => (n.kind === "lesson" ? `/learn/lesson/${n.id}` : `/learn/checkpoint/${n.id}`);

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const { user, progress } = useAuth();
  const course = useCourse();
  const lesson = course.lessonById(lessonId);
  const done = !!lesson && progress.done.includes(lesson.id);
  const [step, setCur] = useState(() => (done ? 0 : Math.min(progress.steps[lessonId] ?? 0, 3)));
  const [card, setCard] = useState(0);
  const [passed, setPassed] = useState(false);
  const [manual, setManual] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([]);
  const [justDone, setJustDone] = useState(false);
  const [dialog, setDialog] = useState(false);
  if (!user) return null;

  if (!lesson) return <Card className="mx-auto max-w-xl text-center"><h1 className="font-display text-2xl font-semibold text-brand-900">Lesson not found</h1><p className="my-3 text-muted">It may have been moved by your trainers.</p><Link href="/learn/path" className="inline-block rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white">Back to my path</Link></Card>;

  const week = course.weekOfLesson(lesson);
  const idx = course.sequence.findIndex((n) => n.id === lesson.id);
  const onPath = idx >= 0;
  const status = onPath ? statusOf(course, course.sequence[idx], progress, user.enrolled) : lesson.week > 1 && !user.enrolled ? "paywall" : "current"; // lessons skipped for your level are optional
  const next = onPath ? course.sequence[idx + 1] : undefined;
  const reached = done ? 4 : Math.max(step, progress.steps[lesson.id] ?? 0);
  const boxes = checks.length === lesson.speak.checklist.length ? checks : lesson.speak.checklist.map(() => false);

  if (status === "paywall") {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-brand-500" />
        <h1 className="font-display text-2xl font-semibold text-brand-900">{lesson.title}</h1>
        <p className="my-3 text-muted">Week 1 is free to try. Enrol to continue the full path, live classes and your certificate.</p>
        <button onClick={() => setDialog(true)} className="rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white hover:bg-accent-700">Enrol now</button>
        <div className="mt-4"><Link href="/learn/path" className="text-sm text-muted hover:text-brand-900">Back to my path</Link></div>
        {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
      </Card>
    );
  }
  if (status === "locked") {
    const cur = course.sequence.find((n) => !progress.done.includes(n.id));
    return (
      <Card className="mx-auto max-w-xl text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-brand-400" />
        <h1 className="font-display text-2xl font-semibold text-brand-900">Not unlocked yet</h1>
        <p className="my-3 text-muted">Finish the earlier lessons first. Each step builds on the one before it.</p>
        {cur && <Link href={nodeHref(cur)} className="inline-block rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white hover:bg-accent-700">Go to where you left off</Link>}
      </Card>
    );
  }

  const go = (to: number) => { setCur(to); if (!done) saveStep(user.id, lesson.id, Math.min(to, 3)); };
  const finish = () => { completeLesson(user.id, lesson.id); setJustDone(!done); setCur(4); };
  const canFinish = passed || (manual && boxes.every(Boolean));

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/learn/path" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-900"><ArrowLeft className="h-4 w-4" />My path</Link>
      <div className="mb-6 mt-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded bg-accent-600 px-2 py-0.5 text-white">Day {lesson.day}</span>
          <span className="rounded bg-brand-100 px-2 py-0.5 text-brand-700">{lesson.kind}</span>
          <span className="text-muted">Week {week.n}: {week.title} · {lesson.minutes} min</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-900">{lesson.title}</h1>
        <p className="mt-1 text-muted">Goal: {lesson.goal}</p>
      </div>

      <ol className="mb-6 flex items-center" aria-label="Lesson steps">
        {STEPS.map((s, n) => {
          const complete = n < reached || (done && n === 4);
          const active = n === step;
          const clickable = n <= reached;
          return (
            <li key={s.label} className="flex flex-1 items-center last:flex-none">
              <button onClick={() => clickable && go(n)} disabled={!clickable} aria-current={active ? "step" : undefined} className={cn("flex flex-col items-center gap-1 text-[11px] font-semibold sm:text-xs", clickable ? "cursor-pointer" : "cursor-not-allowed")}>
                <span className={cn("grid h-10 w-10 place-items-center rounded-full border-2 transition-colors", active ? "border-accent-600 bg-accent-600 text-white" : complete ? "border-ok bg-green-50 text-ok" : "border-line bg-white text-brand-300")}>
                  {complete && !active ? <Check className="h-5 w-5" /> : <s.icon className="h-[18px] w-[18px]" />}
                </span>
                <span className={active ? "text-brand-900" : "text-muted"}>{s.label}</span>
              </button>
              {n < STEPS.length - 1 && <span className={cn("mx-1 mb-5 h-0.5 flex-1 rounded", n < reached ? "bg-ok" : "bg-line")} />}
            </li>
          );
        })}
      </ol>

      <Card className="!p-6 sm:!p-8">
        {step === 0 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Phrase of the day</div>
            <p className="mt-3 font-display text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">&ldquo;{lesson.warm.phrase}&rdquo;</p>
            <div className="mt-4"><ListenButton text={lesson.warm.phrase} /></div>
            <p className="mt-5 text-lg text-ink">{lesson.warm.meaning}</p>
            <div className="mt-4 rounded-lg bg-brand-50 p-4 text-ink"><span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Example</span><p className="mt-1 text-lg">{lesson.warm.example}</p></div>
            <p className="mt-4 text-sm text-muted">Say the phrase aloud three times before you continue.</p>
            <button onClick={() => go(1)} className="mt-6 flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">Start learning <ArrowRight className="h-4 w-4" /></button>
          </div>
        )}

        {step === 1 && (() => {
          const c = lesson.learn[Math.min(card, lesson.learn.length - 1)];
          return (
            <div>
              <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"><span>Learn</span><span>{card + 1} of {lesson.learn.length}</span></div>
              <h2 className="font-display text-2xl font-semibold text-brand-900">{c.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ink">{c.text}</p>
              {c.examples && <ul className="mt-5 space-y-2">{c.examples.map((e) => <li key={e} className="flex items-start gap-3 rounded-lg bg-brand-50 px-4 py-2.5 text-ink"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" />{e}</li>)}</ul>}
              {c.tip && <p className="mt-5 flex gap-2 rounded-lg border border-line p-3 text-sm text-ink"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /><span><b>Tip:</b> {c.tip}</span></p>}
              <div className="mt-7 flex items-center justify-between">
                <button onClick={() => (card > 0 ? setCard(card - 1) : go(0))} className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-900"><ArrowLeft className="h-4 w-4" />Back</button>
                <button onClick={() => (card + 1 < lesson.learn.length ? setCard(card + 1) : go(2))} className="flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">{card + 1 < lesson.learn.length ? "Next" : "Let's try it"} <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })()}

        {step === 2 && <ItemRunner key="try" items={lesson.practice} finishLabel="On to speaking" onFinish={(r) => { updateMissed(user.id, r.missed, lesson.practice.map((i) => i.id).filter((id) => !r.missed.includes(id))); go(3); }} />}

        {step === 3 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Your speaking task</div>
            <p className="mt-3 font-display text-2xl font-semibold leading-snug text-brand-900">{lesson.speak.prompt}</p>
            <details className="group mt-5 rounded-lg border border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-brand-900">Hear a model answer <span className="text-brand-500 transition-transform group-open:rotate-45">+</span></summary>
              <div className="border-t border-line p-4"><p className="leading-relaxed text-ink">{lesson.speak.model}</p><div className="mt-3"><ListenButton text={lesson.speak.model} label="Listen to the model" /></div></div>
            </details>
            <div className="mt-5"><SpeakCheckPanel check={lesson.speak.check} onPass={setPassed} manual={() => setManual(true)} /></div>
            {manual && (
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold text-brand-900">Tick when you have done each one</legend>
                <div className="space-y-2">{lesson.speak.checklist.map((c, n) => (
                  <label key={c} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3", boxes[n] ? "border-accent-600 bg-brand-50" : "border-line hover:bg-brand-50")}>
                    <input type="checkbox" checked={boxes[n]} onChange={() => setChecks(boxes.map((v, k) => (k === n ? !v : v)))} className="h-5 w-5 accent-accent-600" /><span className="text-ink">{c}</span>
                  </label>))}
                </div>
              </fieldset>
            )}
            <button onClick={finish} disabled={!canFinish} className="mt-6 flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50">Finish lesson <Check className="h-4 w-4" /></button>
            {!canFinish && <p className="mt-2 text-xs text-muted">Speak your answer, and the lesson can be finished when it is complete.</p>}
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-green-50 text-ok"><Check className="h-10 w-10" /></div>
            <h2 className="font-display text-3xl font-semibold text-brand-900">Lesson complete</h2>
            {justDone && <p className="mt-1 font-semibold text-ok">+50 points</p>}
            <p className="mx-auto mt-2 max-w-md text-muted">Well done. A little every day is how fluency is built.</p>
            <div className="mx-auto mt-6 max-w-md rounded-lg bg-brand-50 p-5 text-left">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">What you learned</div>
              <ul className="space-y-1.5 text-ink">{lesson.recap.map((r) => <li key={r} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-ok" />{r}</li>)}</ul>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {next && <Link href={nodeHref(next)} className="flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">{next.kind === "lesson" ? `Next: ${next.lesson.title}` : `Next: ${next.title}`}<ArrowRight className="h-4 w-4" /></Link>}
              <Link href="/learn/path" className="rounded-lg border border-line px-6 py-3 font-semibold text-brand-900 hover:bg-brand-50">Back to my path</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
