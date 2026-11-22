"use client";
/** A daily lesson in the dashboard layout: page head · step card (step tabs, content, dashed footer) · lesson aside. */
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, Flag, Lock, Mic, PenLine, ShieldCheck, Sparkles, Sun, Volume2, X } from "@/components/learn/icons";
import { completeLesson, setStep as saveStep, updateMissed, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { statusOf } from "@/lib/path-state";
import { ItemRunner } from "./ItemRunner";
import { ListenButton, SpeakCheckPanel, SpeakIcon } from "./SpeakTools";
import { Mark, speakable } from "./Mark";
import { EnrolDialog } from "./EnrolDialog";
import { Badge, Button, EmptyState, LinkButton, PageTitle, btn } from "./ui";
import { KindIcon } from "./kinds";
import { cn } from "@/lib/utils";
import { opener, weekOpen } from "@/lib/access";

const STEPS = [
  { label: "Warm-up", icon: Sun, hint: "One useful phrase to start" },
  { label: "Learn", icon: BookOpen, hint: "Short cards, one idea each" },
  { label: "Try it", icon: PenLine, hint: "Practise until it feels easy" },
  { label: "Speak", icon: Mic, hint: "Say your answer out loud" },
  { label: "Finish", icon: Flag, hint: "What you learned today" },
];

export const nodeHref = (n: { kind: string; id: string }) => (n.kind === "lesson" ? `/learn/lesson/${n.id}` : `/learn/checkpoint/${n.id}`);

/** Centered card for not-found / locked / paywall states. */
export function Gate({ icon, title, text, action }: { icon: typeof Lock; title: string; text: string; action?: React.ReactNode }) {
  return <div className="nx-card mx-auto mt-10 max-w-lg"><EmptyState icon={icon} title={title} text={text} action={<div className="flex flex-wrap justify-center gap-2">{action}<LinkButton href="/learn/path" variant="tertiary">Back to my path</LinkButton></div>} /></div>;
}

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
  const [score, setScore] = useState<{ firstTry: number; total: number; missed: number } | null>(null);
  if (!user) return null;

  if (!lesson) return <Gate icon={BookOpen} title="Lesson not found" text="It may have been moved by your trainers." />;

  const week = course.weekOfLesson(lesson);
  const idx = course.sequence.findIndex((n) => n.id === lesson.id);
  const onPath = idx >= 0;
  const status = onPath ? statusOf(course, course.sequence[idx], progress, opener(user)) : !weekOpen(user, lesson.week) ? "paywall" : "current"; // lessons skipped for your level are optional
  const next = onPath ? course.sequence[idx + 1] : undefined;
  const reached = done ? 4 : Math.max(step, progress.steps[lesson.id] ?? 0);
  const boxes = checks.length === lesson.speak.checklist.length ? checks : lesson.speak.checklist.map(() => false);

  if (status === "paywall") {
    return <>
      <Gate icon={Lock} title={lesson.title} text={`Week ${lesson.week} is locked. Unlock this week, or get the full plan with live classes and your certificate.`} action={<Button onClick={() => setDialog(true)}>See options</Button>} />
      {dialog && <EnrolDialog userId={user.id} week={lesson.week} onClose={() => setDialog(false)} />}
    </>;
  }
  if (status === "locked") {
    const cur = course.sequence.find((n) => !progress.done.includes(n.id));
    return <Gate icon={Lock} title="Not unlocked yet" text="Finish the earlier lessons first. Each step builds on the one before it." action={cur && <LinkButton href={nodeHref(cur)}>Go to where you left off</LinkButton>} />;
  }

  const go = (to: number) => { setCur(to); if (!done) saveStep(user.id, lesson.id, Math.min(to, 3)); };
  const finish = () => { completeLesson(user.id, lesson.id); setJustDone(!done); setCur(4); };
  const canFinish = passed || (manual && boxes.every(Boolean));
  const S = STEPS[step];

  return (
    <div className="nx-page">
      <PageTitle eyebrow={<>Day {lesson.day} · Week {week.n}: {week.title} · {lesson.minutes} min</>} title={lesson.title} text={`Goal: ${lesson.goal}`}>
        <LinkButton href="/learn/path" variant="tertiary" icon={ArrowLeft}>My path</LinkButton>
      </PageTitle>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Lesson" className="nx-card min-w-0 overflow-hidden">
          {/* step header + tabs */}
          <div className="px-5 pt-5 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-[var(--radius-md)] bg-[var(--accent-subtle)] text-[var(--accent-text)]"><S.icon className="h-4 w-4" /></span>
                <div><div className="ty-label ty-caps ty-subtle">Step {step + 1} of 5</div><div className="ty-subject ty-ink">{S.hint}</div></div>
              </div>
              {done && <Badge tone="success"><Check className="h-3 w-3" strokeWidth={2.5} />Completed</Badge>}
            </div>
            <ol aria-label="Lesson steps" className="-mx-1 mt-4 flex gap-1 overflow-x-auto border-b border-[var(--border)]">
              {STEPS.map((s, n) => {
                const complete = n < reached || (done && n === 4);
                const active = n === step;
                const clickable = n <= reached;
                return (
                  <li key={s.label} className="flex-1">
                    <button onClick={() => clickable && go(n)} disabled={!clickable} aria-current={active ? "step" : undefined}
                      className={cn("relative flex w-full items-center justify-center gap-1.5 whitespace-nowrap px-2 pb-3 pt-1 text-[13px] font-medium transition-colors",
                        active ? "text-[var(--text-primary)]" : complete ? "text-[var(--accent-text)] hover:text-[var(--accent-active)]" : clickable ? "text-[var(--text-muted)] hover:text-[var(--text-primary)]" : "cursor-not-allowed text-[var(--text-subtle)] opacity-60")}>
                      {complete && !active ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <s.icon className="h-4 w-4" />}
                      <span className={cn(!active && "hidden sm:inline")}>{s.label}</span>
                      {active && <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-[var(--accent)]" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
            {step === 0 && (
              <div>
                <div className="ty-label ty-caps ty-subtle">Phrase of the day</div>
                <p className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">&ldquo;{lesson.warm.phrase}&rdquo;</p>
                <div className="mt-4"><ListenButton text={lesson.warm.phrase} /></div>
                <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-secondary)]">{lesson.warm.meaning}</p>
                <div className="mt-4 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] p-4 shadow-[inset_0_0_0_1px_var(--border)]"><div className="ty-label ty-caps ty-subtle">Example</div><p className="mt-1 text-[15px] text-[var(--text-primary)]">{lesson.warm.example}</p></div>
                <p className="ty-note ty-muted mt-4">Say the phrase aloud three times before you continue.</p>
                <div className="nx-dash-h mt-6 pt-5"><Button size="lg" onClick={() => go(1)}>Start learning <ArrowRight className="h-4 w-4" /></Button></div>
              </div>
            )}

            {step === 1 && (() => {
              const c = lesson.learn[Math.min(card, lesson.learn.length - 1)];
              return (
                <div>
                  {/* card tabs: every rule in this lesson, jump to any */}
                  <div className="-mx-1 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Learn cards">
                    {lesson.learn.map((x, n) => (
                      <button key={x.title} role="tab" aria-selected={n === card} onClick={() => setCard(n)}
                        className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors", n === card ? "bg-[var(--accent)] text-white" : n < card ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)] hover:text-[var(--text-primary)]")}>
                        <span className="ty-mono">{n + 1}</span><span className="max-w-[160px] truncate">{x.title}</span>
                      </button>
                    ))}
                  </div>

                  <h2 className="mt-5 text-[21px] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">{c.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">{c.text}</p>

                  {c.rule && (
                    <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-accent)] bg-[color-mix(in_srgb,var(--accent-subtle)_60%,#fff)] px-4 py-3">
                      <span className="ty-label ty-caps ty-accent mt-0.5 shrink-0">Rule</span>
                      <Mark text={c.rule} className="text-[15px] font-medium text-[var(--text-primary)]" />
                    </div>
                  )}

                  {c.examples && (
                    <div className="mt-5">
                      <div className="ty-label ty-caps ty-subtle mb-2">Examples</div>
                      <ul className="overflow-hidden rounded-[var(--radius-lg)] shadow-[inset_0_0_0_1px_var(--border)]">
                        {c.examples.map((e, n) => (
                          <li key={e} className={cn("flex items-center gap-3 py-2.5 pl-4 pr-2 text-[15px] text-[var(--text-primary)]", n > 0 && "border-t border-[var(--border)]")}>
                            <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                            <Mark text={e} className="min-w-0 flex-1" />
                            <SpeakIcon text={speakable(e)} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.pairs && c.pairs.length > 0 && (
                    <div className="mt-5">
                      <div className="ty-label ty-caps ty-subtle mb-2">Common mistakes</div>
                      <ul className="space-y-2">
                        {c.pairs.map(([wrong, right]) => (
                          <li key={wrong} className="grid gap-1.5 rounded-[var(--radius-lg)] p-3 shadow-[inset_0_0_0_1px_var(--border)] sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
                            <span className="flex items-center gap-2 text-[14px] text-[var(--text-subtle)]"><X className="h-3.5 w-3.5 shrink-0" /><span className="line-through decoration-[var(--border-strong)]">{wrong.replace(/\*/g, "")}</span></span>
                            <ArrowRight className="hidden h-3.5 w-3.5 text-[var(--text-subtle)] sm:block" />
                            <span className="flex items-center gap-2 text-[14px] text-[var(--text-primary)]"><Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" strokeWidth={2.5} /><Mark text={right} className="min-w-0 flex-1" /><SpeakIcon text={speakable(right)} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.tip && <p className="ty-body mt-5 flex gap-2.5 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] p-3.5 text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)]"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" /><span><b className="font-semibold">Tip:</b> <Mark text={c.tip} /></span></p>}
                  <div className="nx-dash-h mt-7 flex items-center justify-between pt-5">
                    <button onClick={() => (card > 0 ? setCard(card - 1) : go(0))} className={btn("ghost", "md")}><ArrowLeft className="h-4 w-4" />Back</button>
                    <span className="ty-note ty-subtle hidden sm:inline">Card {card + 1} of {lesson.learn.length}</span>
                    <Button size="lg" onClick={() => (card + 1 < lesson.learn.length ? setCard(card + 1) : go(2))}>{card + 1 < lesson.learn.length ? "Next" : "Let's try it"} <ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })()}

            {step === 2 && <ItemRunner key="try" items={lesson.practice} finishLabel="On to speaking" onFinish={(r) => { updateMissed(user.id, r.missed, lesson.practice.map((i) => i.id).filter((id) => !r.missed.includes(id))); setScore({ firstTry: r.firstTry, total: r.total, missed: r.missed.length }); go(3); }} />}

            {step === 3 && (
              <div>
                <div className="ty-label ty-caps ty-subtle">Your speaking task</div>
                <p className="mt-2 text-[21px] font-semibold leading-snug tracking-[-0.015em] text-[var(--text-primary)]">{lesson.speak.prompt}</p>
                <details className="group mt-5 rounded-[var(--radius-lg)] shadow-[inset_0_0_0_1px_var(--border)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-semibold text-[var(--text-primary)]"><span className="flex items-center gap-2"><Volume2 className="h-4 w-4 text-[var(--text-muted)]" />Hear a model answer</span><span className="text-[var(--text-subtle)] transition-transform group-open:rotate-45">+</span></summary>
                  <div className="border-t border-[var(--border)] p-4"><p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{lesson.speak.model}</p><div className="mt-3"><ListenButton text={lesson.speak.model} label="Listen to the model" /></div></div>
                </details>
                <div className="mt-5"><SpeakCheckPanel check={lesson.speak.check} onPass={setPassed} manual={() => setManual(true)} /></div>
                {manual && (
                  <fieldset className="mt-6">
                    <legend className="ty-subject ty-ink mb-2">Tick when you have done each one</legend>
                    <div className="space-y-2">{lesson.speak.checklist.map((c, n) => (
                      <label key={c} className={cn("flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-[14px] transition-colors", boxes[n] ? "bg-[var(--accent-subtle)] shadow-[inset_0_0_0_1px_var(--border-accent)]" : "shadow-[inset_0_0_0_1px_var(--border)] hover:bg-[var(--surface-hover)]")}>
                        <input type="checkbox" checked={boxes[n]} onChange={() => setChecks(boxes.map((v, k) => (k === n ? !v : v)))} className="h-4 w-4 accent-[var(--accent)]" /><span className="text-[var(--text-primary)]">{c}</span>
                      </label>))}
                    </div>
                  </fieldset>
                )}
                <div className="nx-dash-h mt-6 flex flex-wrap items-center gap-3 pt-5">
                  <Button size="lg" onClick={finish} disabled={!canFinish}>Finish lesson <Check className="h-4 w-4" /></Button>
                  {!canFinish && <p className="ty-note ty-muted">Speak your answer. You can finish when it is complete.</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[0_0_0_8px_color-mix(in_srgb,var(--accent-subtle)_50%,transparent)]"><Check className="h-8 w-8" strokeWidth={2.5} /></div>
                <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Lesson complete</h2>
                {justDone && <Badge tone="accent" className="mt-2">+50 points</Badge>}
                <p className="ty-body ty-muted mx-auto mt-2 max-w-md">Well done. A little every day is how fluency is built.</p>
                {score && (
                  <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--border)] shadow-[0_0_0_1px_var(--border)]">
                    <div className="bg-white p-3"><div className="ty-figure ty-ink">{score.firstTry}<span className="ty-note ty-subtle"> / {score.total}</span></div><div className="ty-note ty-muted">right first time</div></div>
                    <div className="bg-white p-3"><div className="ty-figure ty-ink">{score.missed}</div><div className="ty-note ty-muted">{score.missed ? <Link href="/learn/review" className="ty-accent hover:underline">added to Review</Link> : "to review"}</div></div>
                  </div>
                )}
                <div className="mx-auto mt-6 max-w-md rounded-[var(--radius-lg)] p-5 text-left shadow-[inset_0_0_0_1px_var(--border)]">
                  <div className="ty-label ty-caps ty-subtle mb-2">What you learned</div>
                  <ul className="space-y-2">{lesson.recap.map((r) => <li key={r} className="flex gap-2.5 text-[14px] text-[var(--text-primary)]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2.5} />{r}</li>)}</ul>
                </div>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  {next && <LinkButton href={nodeHref(next)} size="lg">{next.kind === "lesson" ? `Next: ${next.lesson.title}` : `Next: ${next.title}`}<ArrowRight className="h-4 w-4" /></LinkButton>}
                  <LinkButton href="/learn/path" variant="secondary" size="lg">Back to my path</LinkButton>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* aside */}
        <aside aria-label="About this lesson" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="flex items-center gap-3"><KindIcon kind={lesson.kind} tone="accent" /><div><div className="ty-subject ty-ink">{lesson.kind} lesson</div><div className="ty-note ty-muted">Day {lesson.day} of your path</div></div></div>
            <dl className="nx-facts mt-3">
              <div><dt>Time</dt><dd>{lesson.minutes} min</dd></div>
              <div><dt>Learn cards</dt><dd>{lesson.learn.length}</dd></div>
              <div><dt>Practice</dt><dd>{lesson.practice.length} exercises</dd></div>
              <div><dt>Progress</dt><dd>{done ? "Completed" : `Step ${reached + 1} of 5`}</dd></div>
            </dl>
          </section>
          <section aria-label="Quick rules" className="nx-card p-5">
            <div className="flex items-center justify-between"><div className="ty-subject ty-ink">{lesson.kind === "Grammar" ? "Quick rules" : "In this lesson"}</div><span className="ty-label ty-subtle">Tap to open</span></div>
            <ol className="-mx-2 mt-2">
              {lesson.learn.map((c, n) => (
                <li key={c.title}>
                  <button onClick={() => { setCard(n); if (reached >= 1) go(1); }} disabled={reached < 1}
                    className={cn("flex w-full gap-2.5 rounded-[var(--radius-md)] p-2 text-left transition-colors enabled:hover:bg-[var(--surface-hover)]", step === 1 && card === n && "bg-[var(--accent-subtle)]")}>
                    <span className={cn("ty-label ty-mono mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", step === 1 && card === n ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{n + 1}</span>
                    <span className="min-w-0"><span className="ty-body ty-500 ty-ink block">{c.title}</span>{c.rule && <Mark text={c.rule} tone="muted" className="ty-note ty-muted block" />}</span>
                  </button>
                </li>
              ))}
            </ol>
            {reached < 1 && <p className="ty-note ty-subtle mt-1">Unlocks after the warm-up.</p>}
          </section>
          <section className="nx-card p-5">
            <div className="ty-label ty-caps ty-subtle">Today&apos;s phrase</div>
            <p className="ty-subject ty-ink mt-1.5">&ldquo;{lesson.warm.phrase}&rdquo;</p>
            <p className="ty-note ty-muted mt-1">{lesson.warm.meaning}</p>
          </section>
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">Voice and speed</div>
            <p className="ty-note ty-muted mt-1">Choose the accent that reads your lessons aloud.</p>
            <LinkButton href="/learn/settings" variant="secondary" size="sm" className="mt-3 w-full" icon={Volume2}>Change voice</LinkButton>
            <p className="ty-note ty-subtle nx-dash-h mt-4 flex gap-2 pt-3"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />Speaking checks never record or store your voice.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
