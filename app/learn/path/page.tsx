"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, Flag, Lock, Medal, Play, Target } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { GOAL_LABEL, weekDone, type Node } from "@/lib/course-core";
import { MONTHS } from "@/lib/path-data";
import { doneNodes, publishedNodes, statusOf, weekProgress } from "@/lib/path-state";
import { Bar, Card, PageTitle } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { nodeHref } from "@/components/learn/LessonPlayer";
import { cn } from "@/lib/utils";

export default function PathPage() {
  const { user, progress, profile } = useAuth();
  const course = useCourse();
  const [dialog, setDialog] = useState(false);
  if (!user) return null;
  const first = progress.done.length === 0;
  const skippedIds = new Set(course.skipped.map((l) => l.id));

  const action = (n: Node) => {
    const st = statusOf(course, n, progress, user.enrolled);
    if (st === "done") return <Link href={nodeHref(n)} className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand-900 hover:bg-brand-50">Review</Link>;
    if (st === "current") return <Link href={nodeHref(n)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700"><Play className="h-3.5 w-3.5" />{first ? "Start here" : "Up next"}</Link>;
    if (st === "paywall") return <button onClick={() => setDialog(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:bg-brand-50"><Lock className="h-3.5 w-3.5" />Enrol</button>;
    return <Lock className="h-4 w-4 text-brand-300" aria-label="Locked" />;
  };
  const dot = (n: Node) => {
    const st = statusOf(course, n, progress, user.enrolled);
    return (
      <span className={cn("relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold", st === "done" ? "border-ok bg-ok text-white" : st === "current" ? "border-accent-600 bg-white text-brand-900 ring-4 ring-brand-100" : "border-line bg-white text-brand-300")}>
        {st === "done" ? <Check className="h-4 w-4" /> : n.kind === "checkpoint" ? <Flag className="h-4 w-4" /> : n.lesson.day}
      </span>
    );
  };

  return (
    <>
      <PageTitle title="My Path" text="One short lesson a day. Finish each week with a checkpoint. Every lesson unlocks the next.">
        <div className="w-56"><div className="mb-1 flex justify-between text-xs text-muted"><span>Progress</span><span>{doneNodes(course, progress)} of {publishedNodes(course)} steps</span></div><Bar value={(doneNodes(course, progress) / Math.max(1, publishedNodes(course))) * 100} /></div>
      </PageTitle>
      {course.skipped.length > 0 && <p className="-mt-3 mb-6 rounded-lg border border-line bg-white p-3 text-sm text-muted">Level: <b className="text-brand-900">Intermediate</b>. {course.skipped.length} beginner lessons are optional for you. You can still open them any time.</p>}

      <div className="space-y-12">
        {MONTHS.map((m) => (
          <section key={m.n}>
            <h2 className="mb-4 font-display text-xl font-semibold text-brand-900">{m.title}</h2>
            <div className="space-y-5">
              {course.weeks.filter((w) => w.month === m.n).map((w) => {
                const wp = weekProgress(course, progress, w.n);
                const complete = weekDone(course, progress, w.n);
                const paywall = w.n > 1 && !user.enrolled && !w.comingSoon;
                const nodes = course.sequence.filter((n) => n.week === w.n);
                const opt = w.lessons.filter((l) => skippedIds.has(l.id));
                return (
                  <Card key={w.n} className={cn("overflow-hidden !p-0", w.comingSoon && "bg-brand-50/60")}>
                    <div className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4 sm:px-6">
                      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-lg font-display text-lg font-semibold", complete ? "bg-ok text-white" : w.comingSoon ? "bg-brand-100 text-brand-400" : "bg-brand-100 text-brand-900")}>{complete ? <Check className="h-5 w-5" /> : w.n}</span>
                      <div className="min-w-0 flex-1"><div className="font-display text-lg font-semibold text-brand-900">Week {w.n}: {w.title}</div><div className="text-sm text-muted">{w.theme}</div></div>
                      {w.comingSoon ? <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-muted">Coming soon</span>
                        : paywall ? <span className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600"><Lock className="h-3 w-3" />Enrol to unlock</span>
                        : w.n === 1 ? <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Free to try · {wp.done}/{wp.total}</span>
                        : <span className="text-sm font-semibold text-brand-900">{wp.done}/{wp.total} done</span>}
                    </div>
                    {!w.comingSoon && (
                      <ol className="relative px-5 py-3 sm:px-6">
                        <span className="absolute bottom-8 left-[2.4rem] top-8 w-0.5 bg-line sm:left-[2.65rem]" aria-hidden />
                        {nodes.map((n) => (
                          <li key={n.id} className="relative flex items-center gap-4 py-2.5">
                            {dot(n)}
                            <div className="min-w-0 flex-1">
                              {n.kind === "lesson" ? (
                                <>
                                  <div className="flex flex-wrap items-center gap-2 font-semibold text-brand-900">{n.lesson.title}{n.lesson.goals?.includes(profile.goal) && <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-px text-[10px] font-semibold uppercase tracking-wide text-brand-600"><Target className="h-3 w-3" />For your goal</span>}</div>
                                  <div className="text-xs text-muted">Day {n.lesson.day} · {n.lesson.kind} · {n.lesson.minutes} min</div>
                                </>
                              ) : (
                                <><div className="font-semibold text-brand-900">{n.title}</div><div className="text-xs text-muted">A friendly review of the week · earn up to 3 stars{progress.stars[n.id] ? ` · you have ${progress.stars[n.id]}` : ""}</div></>
                              )}
                            </div>
                            {action(n)}
                          </li>
                        ))}
                        {opt.map((l) => (
                          <li key={l.id} className="relative flex items-center gap-4 py-2.5 opacity-70">
                            <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-dashed border-line bg-white text-sm font-semibold text-brand-300">{l.day}</span>
                            <div className="min-w-0 flex-1"><div className="font-semibold text-brand-900">{l.title}</div><div className="text-xs text-muted">Optional for your level · {l.kind}</div></div>
                            <Link href={`/learn/lesson/${l.id}`} className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-brand-900 hover:bg-brand-50">Open</Link>
                          </li>
                        ))}
                      </ol>
                    )}
                    {!w.comingSoon && (w.n === 1 || w.n === 4) && (
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
