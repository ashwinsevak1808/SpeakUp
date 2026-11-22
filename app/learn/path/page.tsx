"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Lock, Medal, Play, Star, Target } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { GOAL_LABEL, weekDone, type Node } from "@/lib/course-core";
import { MONTHS } from "@/lib/path-data";
import { doneNodes, publishedNodes, statusOf, weekProgress } from "@/lib/path-state";
import { Card, PageTitle, Ring } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { nodeHref } from "@/components/learn/LessonPlayer";
import { KIND_ORDER, KIND_STYLE, KindBadge, KindIcon, type KindKey } from "@/components/learn/kinds";
import { cn } from "@/lib/utils";

const kindOf = (n: Node): KindKey => (n.kind === "lesson" ? n.lesson.kind : "Checkpoint");

export default function PathPage() {
  const { user, progress, profile } = useAuth();
  const course = useCourse();
  const [dialog, setDialog] = useState(false);
  const [filter, setFilter] = useState<KindKey | "All">("All");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    course.sequence.forEach((n) => { const k = kindOf(n); c[k] = (c[k] || 0) + 1; });
    return c;
  }, [course]);

  if (!user) return null;
  const first = progress.done.length === 0;
  const skippedIds = new Set(course.skipped.map((l) => l.id));
  const done = doneNodes(course, progress);
  const total = Math.max(1, publishedNodes(course));
  const pct = Math.round((done / total) * 100);
  const current = course.sequence.find((n) => statusOf(course, n, progress, user.enrolled) === "current");
  const stars = Object.values(progress.stars).reduce((a, b) => a + (b as number), 0);

  const action = (n: Node) => {
    const st = statusOf(course, n, progress, user.enrolled);
    if (st === "done") return <Link href={nodeHref(n)} className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-brand-900 hover:bg-brand-50">Review</Link>;
    if (st === "current") return <Link href={nodeHref(n)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-700"><Play className="h-3.5 w-3.5" />{first ? "Start" : "Continue"}</Link>;
    if (st === "paywall") return <button onClick={() => setDialog(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-brand-50"><Lock className="h-3.5 w-3.5" />Enrol</button>;
    return <Lock className="h-4 w-4 text-brand-300" aria-label="Locked" />;
  };

  const row = (n: Node) => {
    const st = statusOf(course, n, progress, user.enrolled);
    const kind = kindOf(n);
    const color = KIND_STYLE[kind].color;
    const isDone = st === "done";
    const isCurrent = st === "current";
    const locked = st === "locked" || st === "paywall";
    return (
      <li
        key={n.id}
        style={{ ["--k" as string]: color }}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors sm:gap-4 sm:px-4",
          isCurrent ? "border-[var(--k)] bg-white shadow-[0_0_0_3px_color-mix(in_srgb,var(--k)_14%,transparent)]" : "border-transparent hover:bg-brand-50",
          locked && "opacity-70",
        )}
      >
        <span className="relative">
          <KindIcon kind={kind} />
          {isDone && <span className="absolute -bottom-1 -right-1 grid h-4.5 w-4.5 place-items-center rounded-full bg-ok text-white ring-2 ring-white" style={{ height: 18, width: 18 }}><Check className="h-3 w-3" /></span>}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={cn("truncate font-semibold text-brand-900", isDone && "text-brand-700")}>{n.kind === "lesson" ? n.lesson.title : n.title}</span>
            {n.kind === "lesson" && n.lesson.goals?.includes(profile.goal) && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-700"><Target className="h-3 w-3" />For your goal</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <KindBadge kind={kind} />
            {n.kind === "lesson" ? <span>Day {n.lesson.day} · {n.lesson.minutes} min</span>
              : <span className="inline-flex items-center gap-1">Earn up to 3 stars{progress.stars[n.id] ? <> · you have {progress.stars[n.id]} <Star className="h-3 w-3 text-amber-500" /></> : null}</span>}
          </div>
        </div>
        <div className="shrink-0">{action(n)}</div>
      </li>
    );
  };

  return (
    <>
      <PageTitle title="My Path" text="One short lesson a day. Finish each week with a checkpoint. Every lesson unlocks the next." />

      <Card className="mb-6 flex flex-wrap items-center gap-6 !p-5 sm:!p-6">
        <Ring value={pct} size={96} stroke={10}><div className="text-center"><div className="ty-title">{pct}%</div><div className="ty-label ty-subtle">done</div></div></Ring>
        <div className="min-w-[200px] flex-1">
          <div className="ty-label ty-caps ty-subtle">{first ? "Ready when you are" : "Up next"}</div>
          {current ? (
            <>
              <div className="mt-1 flex items-center gap-3">
                <KindIcon kind={kindOf(current)} size="sm" />
                <div className="ty-head truncate">{current.kind === "lesson" ? current.lesson.title : current.title}</div>
              </div>
              <div className="ty-note ty-muted mt-1">{done} of {total} steps finished{stars ? ` · ${stars} checkpoint stars` : ""}</div>
            </>
          ) : <div className="ty-head mt-1">You are all caught up for now.</div>}
        </div>
        {current && <Link href={nodeHref(current)} className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-700">{first ? "Start your first lesson" : "Continue"}<ArrowRight className="h-4 w-4" /></Link>}
      </Card>

      {course.skipped.length > 0 && <p className="mb-5 rounded-lg border border-line bg-white p-3 text-sm text-muted">Level: <b className="text-brand-900">Intermediate</b>. {course.skipped.length} beginner lessons are optional for you. You can still open them any time.</p>}

      <div className="sticky top-0 z-20 -mx-1 mb-6 flex gap-2 overflow-x-auto bg-[var(--canvas)]/90 px-1 py-2 backdrop-blur" role="tablist" aria-label="Filter lessons by type">
        <Chip active={filter === "All"} onClick={() => setFilter("All")}>All <span className="opacity-60">{course.sequence.length}</span></Chip>
        {KIND_ORDER.filter((k) => counts[k]).map((k) => (
          <Chip key={k} active={filter === k} color={KIND_STYLE[k].color} onClick={() => setFilter(k)}>
            <span className="h-2 w-2 rounded-full" style={{ background: KIND_STYLE[k].color }} />{k === "Checkpoint" ? "Checkpoints" : k} <span className="opacity-60">{counts[k]}</span>
          </Chip>
        ))}
      </div>

      <div className="space-y-12">
        {MONTHS.map((m) => (
          <section key={m.n}>
            <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-brand-900">{m.title}<span className="h-px flex-1 bg-line" /></h2>
            <div className="space-y-5">
              {course.weeks.filter((w) => w.month === m.n).map((w) => {
                const wp = weekProgress(course, progress, w.n);
                const complete = weekDone(course, progress, w.n);
                const paywall = w.n > 1 && !user.enrolled && !w.comingSoon;
                const nodes = course.sequence.filter((n) => n.week === w.n && (filter === "All" || kindOf(n) === filter));
                const opt = filter === "All" ? w.lessons.filter((l) => skippedIds.has(l.id)) : [];
                if (!w.comingSoon && nodes.length === 0 && opt.length === 0) return null;
                const wpct = wp.total ? Math.round((wp.done / wp.total) * 100) : 0;
                return (
                  <Card key={w.n} className={cn("overflow-hidden !p-0", w.comingSoon && "bg-brand-50/60")}>
                    <div className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
                      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-semibold", complete ? "bg-ok text-white" : w.comingSoon ? "bg-brand-100 text-brand-400" : "bg-accent-50 text-accent-700")}>{complete ? <Check className="h-5 w-5" /> : w.n}</span>
                      <div className="min-w-0 flex-1"><div className="ty-head">Week {w.n}: {w.title}</div><div className="ty-note ty-muted">{w.theme}</div></div>
                      {w.comingSoon ? <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-muted">Coming soon</span>
                        : paywall ? <span className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600"><Lock className="h-3 w-3" />Enrol to unlock</span>
                        : <div className="flex items-center gap-3">{w.n === 1 && <span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700">Free to try</span>}<div className="w-24"><div className="mb-1 text-right text-xs font-semibold text-brand-900">{wp.done}/{wp.total}</div><div className="h-1.5 overflow-hidden rounded-full bg-brand-100"><div className="h-full rounded-full bg-accent-600 transition-all" style={{ width: `${wpct}%` }} /></div></div></div>}
                    </div>
                    {!w.comingSoon && (
                      <ol className="space-y-1 border-t border-line px-2 py-3 sm:px-3">
                        {nodes.map(row)}
                        {opt.map((l) => (
                          <li key={l.id} className="flex items-center gap-3 rounded-xl border border-dashed border-line px-3 py-3 opacity-80 sm:gap-4 sm:px-4">
                            <KindIcon kind={l.kind} />
                            <div className="min-w-0 flex-1"><div className="truncate font-semibold text-brand-900">{l.title}</div><div className="mt-1 flex items-center gap-2 text-xs text-muted"><KindBadge kind={l.kind} />Optional for your level</div></div>
                            <Link href={`/learn/lesson/${l.id}`} className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-brand-900 hover:bg-brand-50">Open</Link>
                          </li>
                        ))}
                      </ol>
                    )}
                    {!w.comingSoon && filter === "All" && (w.n === 1 || w.n === 4) && (
                      <div className={cn("flex items-center gap-3 border-t border-line px-5 py-3 text-sm font-semibold sm:px-6", complete ? "bg-green-50 text-ok" : "bg-brand-50 text-muted")}><Medal className="h-5 w-5" />Milestone: {w.n === 1 ? "Week 1 Complete" : "Month 1 Complete"}{complete ? " · earned" : ""}</div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted">Your goal: {GOAL_LABEL[profile.goal]}. Change it any time in Settings.</p>
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </>
  );
}

function Chip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={active && color ? { borderColor: color, background: `color-mix(in srgb, ${color} 10%, white)` } : undefined}
      className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors", active ? (color ? "text-brand-900" : "border-brand-900 bg-brand-900 text-white") : "border-line bg-white text-muted hover:border-brand-300 hover:text-brand-900")}
    >
      {children}
    </button>
  );
}
