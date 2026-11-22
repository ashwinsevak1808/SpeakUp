"use client";
/** My path, in the dashboard layout: page head · main column of week cards with lesson rows · summary aside. */
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Lock, Medal, Play, Star, Target } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { GOAL_LABEL, weekDone, type Node } from "@/lib/course-core";
import { MONTHS } from "@/lib/path-data";
import { doneNodes, publishedNodes, statusOf, weekProgress, type Status } from "@/lib/path-state";
import { Badge, Button, LinkButton, Meter, PageTitle, Ring, Tabs, btn } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { nodeHref } from "@/components/learn/LessonPlayer";
import { KIND_ORDER, KindIcon, type KindKey } from "@/components/learn/kinds";
import { cn } from "@/lib/utils";
import { ALWAYS_FREE_WEEKS, freePeriod, opener, weekOpen } from "@/lib/access";

const kindOf = (n: Node): KindKey => (n.kind === "lesson" ? n.lesson.kind : "Checkpoint");
const titleOf = (n: Node) => (n.kind === "lesson" ? n.lesson.title : n.title);

function StatusDot({ st }: { st: Status }) {
  if (st === "done") return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white" aria-label="Done"><Check className="h-3 w-3" strokeWidth={3} /></span>;
  if (st === "current") return <span className="grid size-5 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_var(--accent)]" aria-label="Up next"><span className="size-2 rounded-full bg-[var(--accent)]" /></span>;
  return <span className="grid size-5 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]" aria-label={st === "paywall" ? "Needs enrolment" : "Locked"}><span className="size-1.5 rounded-full bg-[var(--border-strong)]" /></span>;
}

export default function PathPage() {
  const { user, progress, profile } = useAuth();
  const course = useCourse();
  const [dialog, setDialog] = useState<boolean | number>(false);
  const setUnlockWeek = (w: number) => setDialog(w);
  const [filter, setFilter] = useState<KindKey | "All">("All");
  const counts = useMemo(() => { const c: Record<string, number> = {}; course.sequence.forEach((n) => { const k = kindOf(n); c[k] = (c[k] || 0) + 1; }); return c; }, [course]);
  if (!user) return null;

  const first = progress.done.length === 0;
  const skippedIds = new Set(course.skipped.map((l) => l.id));
  const done = doneNodes(course, progress), total = Math.max(1, publishedNodes(course));
  const pct = Math.round((done / total) * 100);
  const current = course.sequence.find((n) => statusOf(course, n, progress, opener(user)) === "current");
  const stars = Object.values(progress.stars).reduce((a, b) => a + (b as number), 0);
  const lessonsDone = course.sequence.filter((n) => n.kind === "lesson" && progress.done.includes(n.id)).length;
  const weeksDone = course.weeks.filter((w) => !w.comingSoon && weekDone(course, progress, w.n)).length;
  const comingSoon = course.weeks.filter((w) => w.comingSoon);

  const action = (n: Node, st: Status) => {
    if (st === "done") return <Link href={nodeHref(n)} className={btn("tertiary", "sm")}>Review</Link>;
    if (st === "current") return <Link href={nodeHref(n)} className={btn("primary", "sm")}><Play className="h-3.5 w-3.5" />{first ? "Start" : "Continue"}</Link>;
    if (st === "paywall") return <button onClick={() => setDialog(n.week)} className={btn("tertiary", "sm")}><Lock className="h-3.5 w-3.5" />Unlock</button>;
    return <Lock className="h-4 w-4 text-[var(--text-subtle)]" aria-label="Locked" />;
  };

  return (
    <div className="nx-page">
      <PageTitle
        eyebrow={`${current ? `Week ${current.week} of ${course.totalWeeks}` : "All caught up"} · ${profile.level === "intermediate" ? "Intermediate" : "Beginner"} level`}
        title="My path"
        text="One short lesson a day. Finish each week with a checkpoint. Every lesson unlocks the next.">
        {current && <LinkButton href={nodeHref(current)} icon={Play}>{first ? "Start your first lesson" : "Continue"}</LinkButton>}
      </PageTitle>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* ================= main ================= */}
        <div className="flex min-w-0 flex-col gap-6">
          <div className="nx-card px-5">
            <Tabs label="Filter lessons by type" value={filter} onChange={setFilter} className="pt-2"
              tabs={[{ id: "All" as const, label: "All", count: course.sequence.length }, ...KIND_ORDER.filter((k) => counts[k]).map((k) => ({ id: k, label: k === "Checkpoint" ? "Checkpoints" : k, count: counts[k] }))]} />
          </div>

          {course.skipped.length > 0 && filter === "All" && (
            <p className="ty-body ty-muted nx-card px-5 py-3.5">Level: <b className="ty-ink ty-600">Intermediate</b>. {course.skipped.length} beginner lessons are optional for you. You can still open them any time.</p>
          )}

          {MONTHS.map((m) => {
            const weeks = course.weeks.filter((w) => w.month === m.n && !w.comingSoon);
            if (!weeks.length) return null;
            return (
              <section key={m.n} aria-label={m.title} className="flex flex-col gap-4">
                <div className="flex items-center gap-3"><span className="ty-label ty-caps ty-subtle">{m.title}</span><span className="nx-dash-h h-px flex-1" /></div>
                {weeks.map((w) => {
                  const wp = weekProgress(course, progress, w.n);
                  const complete = weekDone(course, progress, w.n);
                  const paywall = !weekOpen(user, w.n);
                  const isCur = current?.week === w.n;
                  const nodes = course.sequence.filter((n) => n.week === w.n && (filter === "All" || kindOf(n) === filter));
                  const opt = filter === "All" ? w.lessons.filter((l) => skippedIds.has(l.id)) : [];
                  if (nodes.length === 0 && opt.length === 0) return null;
                  return (
                    <article key={w.n} id={`week-${w.n}`} className={cn("nx-card scroll-mt-20 overflow-hidden", isCur && "shadow-[0_0_0_1px_var(--border-accent),0_1px_2px_rgba(19,26,22,.04)]")}>
                      <header className="flex flex-wrap items-center gap-3 px-5 py-4">
                        <span className={cn("ty-mono grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] text-[14px] font-semibold", complete ? "bg-[var(--accent)] text-white" : isCur ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{complete ? <Check className="h-4 w-4" strokeWidth={2.5} /> : w.n}</span>
                        <div className="min-w-0 flex-1"><h2 className="ty-head ty-ink">Week {w.n}: {w.title}</h2><p className="ty-note ty-muted">{w.theme}</p></div>
                        <div className="flex items-center gap-3">
                          {complete ? <Badge tone="success"><Check className="h-3 w-3" strokeWidth={2.5} />Complete</Badge>
                            : paywall ? <button onClick={() => setUnlockWeek(w.n)} className={btn("secondary", "sm")}><Lock className="h-3.5 w-3.5" />Unlock week</button>
                            : !user.enrolled && w.n <= ALWAYS_FREE_WEEKS ? <Badge tone="accent">Always free</Badge>
                            : !user.enrolled && freePeriod() ? <Badge tone="neutral">Free till Feb 2027</Badge>
                            : isCur ? <Badge tone="accent">In progress</Badge> : null}
                          <div className="hidden w-24 sm:block"><div className="ty-label ty-mono ty-subtle mb-1 text-right">{wp.done}/{wp.total}</div><Meter pct={(wp.done / Math.max(1, wp.total)) * 100} className="!h-1.5" /></div>
                        </div>
                      </header>
                      <ol>
                        {nodes.map((n) => {
                          const st = statusOf(course, n, progress, opener(user));
                          const on = st === "current";
                          return (
                            <li key={n.id} className={cn("relative flex items-center gap-3 border-t border-[var(--border)] px-5 py-3 transition-colors sm:gap-4", on ? "bg-[color-mix(in_srgb,var(--accent-subtle)_55%,#fff)]" : "hover:bg-[var(--surface-subtle)]", (st === "locked" || st === "paywall") && "opacity-75")}>
                              {on && <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)]" />}
                              <StatusDot st={st} />
                              <KindIcon kind={kindOf(n)} tone={on ? "accent" : "neutral"} className="hidden sm:grid" />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className={cn("ty-subject truncate", st === "done" ? "ty-secondary" : "ty-ink")}>{titleOf(n)}</span>
                                  {n.kind === "lesson" && n.lesson.goals?.includes(profile.goal) && <Badge tone="accent" className="!h-5 !px-2"><Target className="h-3 w-3" />For your goal</Badge>}
                                </div>
                                <div className="ty-note ty-muted mt-0.5 flex flex-wrap items-center gap-x-2">
                                  <span className="ty-label ty-caps ty-subtle">{kindOf(n)}</span><span aria-hidden className="size-1 rounded-full bg-[var(--border-strong)]" />
                                  {n.kind === "lesson" ? <span>Day {n.lesson.day} · {n.lesson.minutes} min</span>
                                    : <span className="inline-flex items-center gap-1">Earn up to 3 stars{progress.stars[n.id] ? <> · you have {progress.stars[n.id]}<Star className="h-3 w-3 text-[var(--accent)]" /></> : null}</span>}
                                </div>
                              </div>
                              <div className="shrink-0">{action(n, st)}</div>
                            </li>
                          );
                        })}
                        {opt.map((l) => (
                          <li key={l.id} className="flex items-center gap-3 border-t border-dashed border-[var(--border)] px-5 py-3 sm:gap-4">
                            <span className="size-5 shrink-0" />
                            <KindIcon kind={l.kind} className="hidden opacity-70 sm:grid" />
                            <div className="min-w-0 flex-1"><div className="ty-subject ty-secondary truncate">{l.title}</div><div className="ty-note ty-subtle mt-0.5">Optional for your level</div></div>
                            <Link href={`/learn/lesson/${l.id}`} className={btn("ghost", "sm")}>Open</Link>
                          </li>
                        ))}
                      </ol>
                      {filter === "All" && (w.n === 1 || w.n === 4) && (
                        <footer className="nx-dash-h flex items-center gap-2.5 bg-[var(--surface-subtle)] px-5 py-3">
                          <Medal className={cn("h-4 w-4", complete ? "text-[var(--accent)]" : "text-[var(--text-subtle)]")} />
                          <span className="ty-note ty-500 ty-secondary">Milestone: {w.n === 1 ? "Week 1 Complete" : "Month 1 Complete"}</span>
                          {complete && <Badge tone="success" className="ml-auto !h-5">Earned</Badge>}
                        </footer>
                      )}
                    </article>
                  );
                })}
              </section>
            );
          })}

          {comingSoon.length > 0 && filter === "All" && (
            <section aria-label="Coming soon" className="flex flex-col gap-4">
              <div className="flex items-center gap-3"><span className="ty-label ty-caps ty-subtle">Coming soon</span><span className="nx-dash-h h-px flex-1" /><span className="ty-note ty-subtle">{comingSoon.length} weeks being prepared</span></div>
              <div className="nx-card grid gap-px overflow-hidden bg-[var(--border)] sm:grid-cols-2">
                {comingSoon.map((w) => (
                  <div key={w.n} className="flex items-center gap-3 bg-white px-5 py-3.5">
                    <span className="ty-mono grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] text-[13px] text-[var(--text-subtle)]">{w.n}</span>
                    <div className="min-w-0"><div className="ty-body ty-500 ty-secondary truncate">{w.title}</div><div className="ty-note ty-subtle truncate">{w.theme}</div></div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ================= aside ================= */}
        <aside aria-label="Path summary" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="flex items-center gap-4">
              <Ring value={pct} size={76} stroke={7}><div className="ty-mono text-[15px] font-semibold text-[var(--text-primary)]">{pct}%</div></Ring>
              <div><div className="ty-subject ty-ink">Your progress</div><div className="ty-note ty-muted">{done} of {total} steps done</div></div>
            </div>
            <dl className="nx-facts mt-4">
              <div><dt>Lessons finished</dt><dd>{lessonsDone}</dd></div>
              <div><dt>Weeks complete</dt><dd>{weeksDone} / {course.publishedWeeks}</dd></div>
              <div><dt>Checkpoint stars</dt><dd>{stars}</dd></div>
              <Link href="/learn/settings"><dt>Goal</dt><dd>{GOAL_LABEL[profile.goal]}</dd></Link>
            </dl>
          </section>

          {current && (
            <section className="nx-glass p-5">
              <span className="ty-label ty-caps ty-accent">{first ? "Start here" : "Up next"}</span>
              <div className="mt-2 flex items-center gap-3"><KindIcon kind={kindOf(current)} tone="accent" /><div className="min-w-0"><div className="ty-subject ty-ink truncate">{titleOf(current)}</div><div className="ty-note ty-muted">Week {current.week}{current.kind === "lesson" ? ` · ${current.lesson.minutes} min` : ""}</div></div></div>
              {!weekOpen(user, current.week) ? <Button onClick={() => setDialog(current.week)} icon={Lock} className="mt-4 w-full">Unlock to continue</Button> : <LinkButton href={nodeHref(current)} className="mt-4 w-full" icon={Play}>{first ? "Start" : "Continue"}</LinkButton>}
            </section>
          )}

          <nav aria-label="Jump to week" className="nx-card p-5">
            <div className="ty-subject ty-ink">Weeks</div>
            <ul className="-mx-2 mt-2">
              {course.weeks.filter((w) => !w.comingSoon).map((w) => {
                const wp = weekProgress(course, progress, w.n); const c = weekDone(course, progress, w.n);
                return (
                  <li key={w.n}><a href={`#week-${w.n}`} className="flex items-center gap-2.5 rounded-[var(--radius-md)] p-2 hover:bg-[var(--surface-hover)]">
                    <span className={cn("size-2 shrink-0 rounded-full", c ? "bg-[var(--accent)]" : current?.week === w.n ? "shadow-[inset_0_0_0_2px_var(--accent)]" : "bg-[var(--border-strong)]")} />
                    <span className="ty-body ty-ink min-w-0 flex-1 truncate">Week {w.n}: {w.title}</span>
                    <span className="ty-note ty-mono ty-subtle">{wp.done}/{wp.total}</span>
                  </a></li>
                );
              })}
            </ul>
            <Link href="/learn/certificate" className="ty-note ty-500 ty-accent mt-2 inline-flex items-center gap-1 hover:underline">Certificate requirements<ArrowRight className="h-3.5 w-3.5" /></Link>
          </nav>
        </aside>
      </div>
      {dialog !== false && <EnrolDialog userId={user.id} week={typeof dialog === "number" ? dialog : undefined} onClose={() => setDialog(false)} />}
    </div>
  );
}
