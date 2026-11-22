"use client";
/**
 * Student home, laid out like the Neemo company home:
 *   page head (date, greeting, one-line summary, actions)
 *   KPI row (GlowStatCard style)
 *   main column: today's lesson · "Up next" queue with tabs · path · milestones
 *   aside: live class · this week (facts) · next 7 days · private session · tip
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight, Award, BookOpen, CalendarDays, CalendarPlus, Check, Flag, Flame, Footprints, Lightbulb, Lock, Medal, Mic, Play,
  RotateCcw, Star, TaskDone, Trophy, UserRound, Video, Zap, type IconType,
} from "@/components/learn/icons";
import { streakOf, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { GOAL_LABEL } from "@/lib/course-core";
import { MILESTONES, currentNode, doneNodes, publishedNodes, weekProgress } from "@/lib/path-state";
import { PLAN, TIPS } from "@/lib/learn-data";
import { KIND_LABEL, PRIVATE_MINUTES, PRIVATE_PRICE, countdown, dayKey, fmtDate, fmtTime, isLive, isPast, type SessionView } from "@/lib/live";
import { Badge, Button, EmptyState, LinkButton, Panel, Ring, StatCard, Tabs, btn } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { OnboardingDialog } from "@/components/learn/Preferences";
import { Avatar, LiveBadge, gcalLink, liveNow } from "@/components/learn/live";
import { useLive } from "@/components/learn/LiveProvider";
import { nodeHref } from "@/components/learn/LessonPlayer";
import { cn } from "@/lib/utils";
import { hasPlan, weekOpen } from "@/lib/access";
import { FREE_UNTIL_LABEL, freePeriod } from "@/lib/access";

const BADGE_ICON: Record<string, IconType> = { first: Footprints, streak3: Flame, week1: Flag, speaker: Mic, star: Star, streak7: Flame, month1: Medal, graduate: Trophy };
const STEPS = ["Warm-up", "Learn", "Try it", "Speak", "Finish"];

type QueueTab = "all" | "classes" | "practice" | "milestones";
type Row = { id: string; tab: Exclude<QueueTab, "all">; icon: IconType; avatar?: string; kind: string; meta?: string; title: string; when?: string; cta: string; href?: string; onClick?: () => void; external?: boolean; live?: boolean };

export default function Dashboard() {
  const { user, progress, profile } = useAuth();
  const course = useCourse();
  const { sessions, now } = useLive();
  const [dialog, setDialog] = useState<boolean | number>(false);
  const [tab, setTab] = useState<QueueTab>("all");

  const week = useMemo(() => {
    const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); const iso = d.toISOString().slice(0, 10); return { label: "MTWTFSS"[i], iso, today: iso === now.toISOString().slice(0, 10), active: progress.days.includes(iso) }; });
  }, [now, progress.days]);
  const tip = useMemo(() => TIPS[Math.floor((+now - +new Date(now.getFullYear(), 0, 0)) / 86400000) % TIPS.length], [now]);
  if (!user) return null;

  const enrolled = hasPlan(user);
  const cur = currentNode(course, progress);
  const done = doneNodes(course, progress), total = Math.max(1, publishedNodes(course));
  const pct = (done / total) * 100;
  const earned = MILESTONES.filter((m) => m.earned(course, progress));
  const first = progress.done.length === 0;
  const paywall = !!cur && !weekOpen(user, cur.week);
  const stepNow = cur && cur.kind === "lesson" ? Math.min(progress.steps[cur.id] ?? 0, 4) : 0;
  const hour = now.getHours(); const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const streak = streakOf(progress.days);
  const lessonsDone = progress.done.filter((d) => d.startsWith("d")).length;
  const stars = Object.values(progress.stars).reduce((a, b) => a + b, 0);
  const activeThisWeek = week.filter((d) => d.active).length;

  const live = liveNow(sessions, now)[0];
  const canJoinLive = !!live && (enrolled || live.mine);
  const nextClass: SessionView | undefined = live ?? sessions.find((s) => s.kind === "group" && !isPast(s, now) && !isLive(s, now));
  const in7 = +now + 7 * 86400000;
  const upcoming = sessions.filter((s) => (s.kind !== "private" || s.mine) && !isPast(s, now) && +new Date(s.start) < in7);
  const slots = sessions.filter((s) => s.kind === "private" && !s.taken && +new Date(s.start) > +now).slice(0, 3);
  const mine = sessions.filter((s) => s.kind === "private" && s.mine && !isPast(s, now))[0];
  const curTitle = cur ? (cur.kind === "lesson" ? cur.lesson.title : cur.title) : "";
  const ctaLabel = first ? "Start here" : stepNow > 0 ? "Continue lesson" : cur?.kind === "lesson" ? "Start today's lesson" : "Start checkpoint";
  const summary = !cur ? "You have finished everything published so far. New lessons appear here as trainers add them."
    : first ? "Welcome. Your first lesson takes about 15 minutes, and your trainer is live every day on Google Meet."
    : streak > 0 ? `You are on a ${streak}-day streak. One lesson today keeps it going.` : "Pick up where you left off. One short lesson a day is all it takes.";

  /* ---------- the "Up next" queue ---------- */
  const rows: Row[] = [];
  if (cur) rows.push({ id: cur.id, tab: "practice", icon: cur.kind === "lesson" ? BookOpen : Flag, kind: cur.kind === "lesson" ? (first ? "Start here" : "Today's lesson") : "Weekly checkpoint", meta: cur.kind === "lesson" ? `Day ${cur.lesson.day} · ${cur.lesson.minutes} min` : `Week ${cur.week}`, title: curTitle, cta: paywall ? "Enrol" : stepNow > 0 ? "Continue" : "Start", ...(paywall ? { onClick: () => setDialog(true) } : { href: nodeHref(cur) }) });
  if (progress.missed.length) rows.push({ id: "review", tab: "practice", icon: RotateCcw, kind: "Review", meta: `${progress.missed.length} ${progress.missed.length === 1 ? "exercise" : "exercises"}`, title: "Practise the exercises you missed", cta: "Review", href: "/learn/review" });
  const cp = cur && cur.kind === "lesson" ? course.sequence.find((n) => n.kind === "checkpoint" && n.week === cur.week) : null;
  if (cp) { const wp = weekProgress(course, progress, cp.week); rows.push({ id: cp.id, tab: "practice", icon: Flag, kind: "Checkpoint", meta: `${wp.done} of ${wp.total} done this week`, title: cp.kind === "checkpoint" ? cp.title : "", cta: "View path", href: "/learn/path" }); }
  for (const s of upcoming.slice(0, 3)) {
    const isNow = isLive(s, now); const can = (s.kind === "group" && enrolled) || (s.kind === "private" && s.mine);
    rows.push({ id: s.id, tab: "classes", icon: s.kind === "private" ? UserRound : Video, avatar: s.trainer, kind: isNow ? "Live now" : KIND_LABEL[s.kind], meta: s.trainer, title: s.title, when: `${dayKey(s.start) === dayKey(now.toISOString()) ? "Today" : fmtDate(s.start)} · ${fmtTime(s.start)}`, live: isNow,
      ...(isNow && can && s.link ? { cta: "Join", href: s.link, external: true } : s.kind === "group" && !enrolled ? { cta: "Join with plan", onClick: () => setDialog(true) } : { cta: "Details", href: s.kind === "private" ? "/learn/private" : "/learn/live" }) });
  }
  for (const m of MILESTONES.filter((x) => !x.earned(course, progress)).slice(0, 2)) rows.push({ id: m.id, tab: "milestones", icon: BADGE_ICON[m.id] ?? Medal, kind: "Milestone", meta: "Not earned yet", title: `${m.title}: ${m.desc}`, cta: "View", href: "/learn/path" });
  const count = (t: QueueTab) => t === "all" ? rows.length : rows.filter((r) => r.tab === t).length;
  const shown = tab === "all" ? rows : rows.filter((r) => r.tab === tab);

  /* next 7 days, grouped by day */
  const byDay = upcoming.reduce<Record<string, SessionView[]>>((m, s) => { (m[dayKey(s.start)] ||= []).push(s); return m; }, {});

  return (
    <div className="nx-page">
      <OnboardingDialog />

      {/* ---------- page head ---------- */}
      <header className="nx-pagehead__row">
        <div className="min-w-0">
          <p className="nx-pagehead__eyebrow">{now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} · Week {cur?.week ?? course.publishedWeeks} of {course.totalWeeks}</p>
          <h1 className="nx-pagehead__title">{greet}, {user.name.split(" ")[0]}</h1>
          <p className="nx-pagehead__desc">{summary}</p>
        </div>
        <div className="nx-pagehead__actions">
          <LinkButton href="/learn/live" variant="secondary" icon={CalendarDays}>Class schedule</LinkButton>
          {cur && (paywall ? <Button onClick={() => setDialog(cur.week)} icon={Lock}>Unlock to continue</Button> : <LinkButton href={nodeHref(cur)} icon={Play}>{ctaLabel}</LinkButton>)}
        </div>
      </header>

      {/* small screens: the next live class sits up top (the full card is in the aside on wide screens) */}
      {nextClass && (
        <Link href="/learn/live" className={cn("nx-card flex items-center gap-3 p-3.5 xl:hidden", live && "shadow-[0_0_0_1px_var(--border-accent)]")}>
          {live ? <LiveBadge /> : <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--accent-subtle)] text-[var(--accent-text)]"><Video className="h-[18px] w-[18px]" /></span>}
          <span className="min-w-0 flex-1"><span className="ty-subject ty-ink block truncate">{nextClass.title}</span><span className="ty-note ty-muted block truncate">{live ? `Happening now · ${live.trainer}` : `${fmtTime(nextClass.start)} · ${countdown(nextClass, now)}`}</span></span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-subtle)]" />
        </Link>
      )}

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Progress" icon={TaskDone} value={`${Math.round(pct)}%`} meter={{ pct, label: `${done} / ${total} steps` }} delta={lessonsDone ? { label: `${lessonsDone} ${lessonsDone === 1 ? "lesson" : "lessons"}`, good: true } : undefined} />
        <StatCard label="Day streak" icon={Flame} value={streak} of={streak === 1 ? "day" : "days"} meter={{ pct: (activeThisWeek / 7) * 100, label: `${activeThisWeek} / 7 this week` }} delta={streak >= 3 ? { label: "On a roll", good: true } : undefined} />
        <StatCard label="Points" icon={Zap} value={progress.xp.toLocaleString("en-IN")} note={stars ? `${stars} checkpoint ${stars === 1 ? "star" : "stars"} earned` : "Earn 50 points for every lesson you finish"} />
        <StatCard label="To review" icon={RotateCcw} value={progress.missed.length} href="/learn/review" note={progress.missed.length ? "exercises to revisit" : "Nothing to review. Nice."} />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ================= main ================= */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* today's lesson */}
          <section aria-label="Today's lesson" className="nx-glass p-5 sm:p-6">
            {cur ? (
              <>
                <div className="flex items-start gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="accent">{first ? "Start here" : cur.kind === "checkpoint" ? "Weekly checkpoint" : "Today's lesson"}</Badge>
                      {cur.kind === "lesson" && <span className="ty-note ty-muted">Day {cur.lesson.day} · {cur.lesson.kind} · {cur.lesson.minutes} min</span>}
                    </div>
                    <h2 className="mt-3 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-[22px]">{curTitle}</h2>
                    <p className="ty-body ty-muted mt-1 max-w-xl">{cur.kind === "lesson" ? cur.lesson.goal : "A friendly review of everything from this week. Earn up to 3 stars."}</p>
                  </div>
                  <div className="hidden shrink-0 text-center sm:block">
                    <Ring value={pct} size={92} stroke={8}><div><div className="ty-mono text-[18px] font-semibold text-[var(--text-primary)]">{Math.round(pct)}%</div><div className="ty-label ty-subtle">course</div></div></Ring>
                  </div>
                </div>

                {cur.kind === "lesson" && (
                  <ol aria-label="Today's steps" className="mt-5 grid grid-cols-5 gap-2">
                    {STEPS.map((s, n) => {
                      const d = n < stepNow, c = n === stepNow;
                      return (
                        <li key={s} className="min-w-0">
                          <div className={cn("h-1 rounded-full", d ? "bg-[var(--accent)]" : c ? "bg-[var(--accent-soft)]" : "bg-[var(--surface-sunken)]")} />
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold", d ? "bg-[var(--accent)] text-white" : c ? "bg-[var(--accent-subtle)] text-[var(--accent-text)] ring-1 ring-[var(--accent-muted)]" : "text-[var(--text-subtle)] ring-1 ring-[var(--border)]")}>{d ? <Check className="h-3 w-3" strokeWidth={3} /> : n + 1}</span>
                            <span className={cn("ty-label truncate", c ? "ty-600 ty-accent" : d ? "ty-muted" : "ty-subtle")}>{s}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <div className="nx-dash-h mt-5 flex flex-wrap items-center gap-3 pt-4">
                  {paywall && cur ? <Button onClick={() => setDialog(cur.week)} icon={Lock}>Unlock to continue</Button> : <LinkButton href={nodeHref(cur)} icon={Play}>{ctaLabel}</LinkButton>}
                  <LinkButton href="/learn/path" variant="tertiary">View my path</LinkButton>
                  <span className="ty-note ty-subtle ml-auto hidden md:inline">Tip: press <kbd className="rounded border border-[var(--border)] bg-white px-1">⌘K</kbd> to jump to any lesson</span>
                </div>
              </>
            ) : (
              <EmptyState icon={Check} title="All caught up" text="Your trainers add new lessons regularly. Review anything you like meanwhile." action={<LinkButton href="/learn/path" variant="secondary">Open my path</LinkButton>} compact />
            )}
          </section>

          {/* up next queue */}
          <section aria-label="Up next" className="nx-card overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
              <div><h2 className="ty-head ty-ink">Up next</h2><p className="ty-note ty-muted mt-0.5">Lessons, classes and goals waiting for you, in order.</p></div>
              <Link href="/learn/path" className="ty-body ty-500 ty-accent inline-flex items-center gap-1 hover:underline">Full path<ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <Tabs label="Up next" className="mt-3 border-b border-[var(--border)] px-5" value={tab} onChange={setTab}
              tabs={[{ id: "all", label: "All", count: count("all") }, { id: "practice", label: "Practice", count: count("practice") }, { id: "classes", label: "Classes", count: count("classes") }, { id: "milestones", label: "Milestones", count: count("milestones") }]} />
            {shown.length ? (
              <ul>
                {shown.map((r) => {
                  const inner = (
                    <>
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        {r.avatar ? <Avatar name={r.avatar} size={36} /> : <span className={cn("grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-white", r.tab === "practice" ? "text-[var(--accent-text)]" : "text-[var(--text-muted)]")}><r.icon className="h-[18px] w-[18px]" /></span>}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {r.live ? <LiveBadge className="!py-0 !text-[9.5px]" /> : <span className="ty-label ty-caps ty-subtle shrink-0">{r.kind}</span>}
                            {r.meta && <><span aria-hidden className="size-1 shrink-0 rounded-full bg-[var(--border-strong)]" /><span className="ty-note ty-muted truncate">{r.meta}</span></>}
                          </div>
                          <div className="ty-subject ty-ink mt-0.5 truncate">{r.title}</div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
                        {r.when && <span className="ty-note ty-mono ty-muted whitespace-nowrap">{r.when}</span>}
                        <span className={cn("rounded-[var(--radius-md)] px-2.5 py-1 text-[12px] font-semibold transition-colors", r.live ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-white text-[var(--text-primary)] group-hover/row:border-[var(--border-accent)] group-hover/row:text-[var(--accent-text)]")}>{r.cta}</span>
                      </div>
                    </>
                  );
                  const cls = "group/row flex w-full flex-col gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--surface-subtle)] sm:flex-row sm:items-center sm:gap-4";
                  return (
                    <li key={r.tab + r.id} className="border-t border-[var(--border)]">
                      {r.onClick ? <button onClick={r.onClick} className={cls}>{inner}</button> : r.external ? <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a> : <Link href={r.href!} className={cls}>{inner}</Link>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="border-t border-[var(--border)]"><EmptyState compact icon={tab === "classes" ? CalendarDays : Check} title={tab === "classes" ? "No classes in the next 7 days" : "Nothing waiting here"} text={tab === "classes" ? "Your trainers publish the schedule on the Live classes page." : "You are on top of everything in this list."} /></div>
            )}
          </section>

          {/* path */}
          <Panel title="Your path" desc={`${course.publishedWeeks} of ${course.totalWeeks} weeks published · ${done} of ${total} steps done`} action={<Link href="/learn/path" className="ty-body ty-500 ty-accent inline-flex items-center gap-1 hover:underline">Open<ArrowRight className="h-3.5 w-3.5" /></Link>}>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {course.weeks.filter((w) => !w.comingSoon).slice(0, 4).map((w) => {
                const wp = weekProgress(course, progress, w.n); const full = wp.total > 0 && wp.done === wp.total; const locked = !weekOpen(user, w.n);
                const isCur = cur?.week === w.n;
                return (
                  <Link key={w.n} href="/learn/path" className={cn("flex flex-col rounded-[var(--radius-lg)] border bg-white p-3.5 transition-colors hover:border-[var(--border-strong)]", isCur ? "border-[var(--border-accent)] shadow-[0_0_0_3px_var(--accent-ring)]" : "border-[var(--border)]")}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="ty-label ty-caps ty-subtle">Week {w.n}</span>
                      {full ? <Badge tone="success" className="!h-5 !px-1.5"><Check className="h-3 w-3" strokeWidth={2.5} />Done</Badge> : locked ? <Lock className="h-3.5 w-3.5 text-[var(--text-subtle)]" /> : isCur ? <Badge tone="accent" className="!h-5 !px-1.5">Now</Badge> : null}
                    </div>
                    <div className="ty-body ty-500 ty-ink mt-1.5 line-clamp-2 min-h-[2.5rem]">{w.title}</div>
                    <div className="nx-dash-h mt-3 flex items-center justify-between pt-2.5"><span className="ty-label ty-mono ty-muted">{wp.done}/{wp.total}</span><span className="ty-label ty-mono ty-subtle">{Math.round((wp.done / Math.max(1, wp.total)) * 100)}%</span></div>
                  </Link>
                );
              })}
            </div>
            {course.weeks.some((w) => w.comingSoon) && <p className="ty-note ty-muted mt-3">{course.weeks.filter((w) => w.comingSoon).length} more weeks are being prepared by your trainers.</p>}
          </Panel>

          {/* milestones */}
          <Panel title="Milestones" desc={`${earned.length} of ${MILESTONES.length} earned`}>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MILESTONES.map((m) => {
                const ok = m.earned(course, progress); const I = BADGE_ICON[m.id] ?? Medal;
                return (
                  <li key={m.id} title={m.desc} className={cn("flex items-center gap-2.5 rounded-[var(--radius-md)] border p-2.5", ok ? "border-[var(--border-accent)] bg-[color-mix(in_srgb,var(--accent-subtle)_45%,#fff)]" : "border-dashed border-[var(--border)]")}>
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", ok ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-sunken)] text-[var(--text-subtle)]")}><I className="h-4 w-4" /></span>
                    <span className="min-w-0"><span className={cn("ty-note ty-500 block truncate", ok ? "ty-ink" : "ty-muted")}>{m.title}</span><span className="ty-label ty-subtle block truncate">{ok ? "Earned" : m.desc}</span></span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        {/* ================= aside ================= */}
        <aside aria-label="Summary" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          {/* live class */}
          <section aria-label="Live class" className={cn("nx-card p-5", live && "shadow-[0_0_0_1px_var(--border-accent),0_1px_2px_rgba(17,17,31,.04)]")}>
            {live ? (
              <>
                <div className="flex items-center gap-2"><LiveBadge /><span className="ty-note ty-500 text-[var(--accent-text)]">Happening now</span></div>
                <h2 className="ty-head ty-ink mt-3">{live.title}</h2>
                <div className="ty-body ty-muted mt-1.5 flex items-center gap-2"><Avatar name={live.trainer} size={22} />{live.trainer}</div>
                {canJoinLive && !live.link ? (
                  <p className="ty-body ty-muted mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--surface-sunken)] px-4 py-3"><Video className="h-4 w-4" />Meet link coming soon. Your trainer is adding it.</p>
                ) : canJoinLive ? (
                  <a href={live.link} target="_blank" rel="noopener noreferrer" className={btn("primary", "lg", "mt-4 w-full")}><Video className="h-4 w-4" />Join now on Google Meet</a>
                ) : (
                  <button onClick={() => setDialog(true)} className={btn("secondary", "lg", "mt-4 w-full")}><Lock className="h-4 w-4" />Get the plan to join</button>
                )}
              </>
            ) : nextClass ? (
              <>
                <div className="flex items-center justify-between"><span className="ty-label ty-caps ty-subtle">Next live class</span><Badge tone="neutral">{fmtDate(nextClass.start)}</Badge></div>
                <div className="ty-figure ty-ink mt-3">{fmtTime(nextClass.start)}</div>
                <div className="ty-note ty-accent ty-500 mt-1">{countdown(nextClass, now)}</div>
                <h2 className="ty-subject ty-ink mt-3">{nextClass.title}</h2>
                <div className="ty-note ty-muted mt-1 flex items-center gap-2"><Avatar name={nextClass.trainer} size={20} />{nextClass.trainer} · {nextClass.minutes} min · Google Meet</div>
                <div className="nx-dash-h mt-4 flex gap-2 pt-4">
                  <LinkButton href="/learn/live" variant="secondary" size="sm" className="flex-1">Schedule</LinkButton>
                  <a href={gcalLink(nextClass, enrolled)} target="_blank" rel="noopener noreferrer" className={btn("ghost", "sm", "flex-1")}><CalendarPlus className="h-4 w-4" />Add to calendar</a>
                </div>
                {!enrolled && <p className="ty-note ty-muted mt-3">Get the full plan to receive the Google Meet link.</p>}
              </>
            ) : <EmptyState compact icon={CalendarDays} title="No class scheduled yet" text="Your trainers publish the schedule here." />}
          </section>

          {/* this week */}
          <section aria-label="This week" className="nx-card p-5">
            <div className="flex items-center justify-between"><h2 className="ty-subject ty-ink">This week</h2><span className="ty-note ty-subtle">{activeThisWeek} active {activeThisWeek === 1 ? "day" : "days"}</span></div>
            <div className="mt-3 flex justify-between">
              {week.map((d) => (
                <span key={d.iso} className="flex flex-col items-center gap-1.5">
                  <span className={cn("grid size-7 place-items-center rounded-full text-[10px]", d.active ? "bg-[var(--accent)] text-white shadow-[0_2px_6px_color-mix(in_srgb,var(--accent)_35%,transparent)]" : d.today ? "ring-2 ring-[var(--accent-muted)] ring-offset-1" : "bg-[var(--surface-sunken)]")}>{d.active && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                  <span className={cn("ty-label", d.today ? "ty-ink ty-600" : "ty-subtle")}>{d.label}</span>
                </span>
              ))}
            </div>
            <dl className="nx-facts mt-3">
              <Link href="/learn/path"><dt>Lessons finished</dt><dd>{lessonsDone}</dd></Link>
              <Link href="/learn/path"><dt>Checkpoint stars</dt><dd>{stars}</dd></Link>
              <div><dt>Milestones</dt><dd>{earned.length} / {MILESTONES.length}</dd></div>
              <Link href="/learn/settings"><dt>Focus</dt><dd>{GOAL_LABEL[profile.goal]}</dd></Link>
              <div><dt>Plan</dt><dd>{enrolled ? <Badge tone="success" className="!h-5">Full plan</Badge> : <Badge tone="neutral" className="!h-5">Free</Badge>}</dd></div>
            </dl>
          </section>

          {/* next 7 days */}
          <section aria-label="Next 7 days" className="nx-card p-5">
            <div className="flex items-center justify-between"><h2 className="ty-subject ty-ink">Next 7 days</h2><span className="ty-note ty-subtle">{upcoming.length} {upcoming.length === 1 ? "session" : "sessions"}</span></div>
            {Object.keys(byDay).length ? (
              <div className="mt-2 flex flex-col gap-2">
                {Object.entries(byDay).slice(0, 4).map(([k, list]) => (
                  <div key={k}>
                    <div className="ty-label ty-caps ty-subtle mt-1">{k === dayKey(now.toISOString()) ? "Today" : fmtDate(list[0].start, { weekday: "long", day: "numeric", month: "short" })}</div>
                    <ul className="-mx-2 mt-1">
                      {list.slice(0, 3).map((s) => (
                        <li key={s.id}>
                          <Link href={s.kind === "private" ? "/learn/private" : "/learn/live"} className="flex items-center gap-2.5 rounded-[var(--radius-md)] p-2 hover:bg-[var(--surface-hover)]">
                            <span className={cn("size-2 shrink-0 rounded-full", isLive(s, now) ? "bg-[var(--accent)]" : s.kind === "private" ? "border-2 border-[var(--accent)]" : "bg-[var(--accent)]")} />
                            <span className="ty-body ty-ink min-w-0 flex-1 truncate">{s.title}</span>
                            <span className="ty-note ty-mono ty-muted shrink-0">{fmtTime(s.start)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : <p className="ty-body ty-muted mt-2">Nothing scheduled in the next week.</p>}
            <LinkButton href="/learn/live" variant="secondary" size="sm" className="mt-3 w-full" icon={CalendarDays}>Open calendar</LinkButton>
          </section>

          {/* private session */}
          <section aria-label="Private session" className="nx-card p-5">
            <div className="flex items-center justify-between"><h2 className="ty-subject ty-ink">Private session</h2><span className="ty-note ty-mono ty-subtle">₹{PRIVATE_PRICE} · {PRIVATE_MINUTES} min</span></div>
            {mine ? (
              <div className="mt-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] p-3 shadow-[inset_0_0_0_1px_var(--border)]">
                <div className="ty-label ty-caps ty-accent">Your booking</div>
                <div className="ty-subject ty-ink mt-1">{fmtDate(mine.start)} · {fmtTime(mine.start)}</div>
                <div className="ty-note ty-muted">with {mine.trainer} · {countdown(mine, now)}</div>
                {mine.link && <a href={mine.link} target="_blank" rel="noopener noreferrer" className={btn("primary", "sm", "mt-3")}><Video className="h-4 w-4" />Open Meet link</a>}
              </div>
            ) : (
              <>
                <p className="ty-note ty-muted mt-1">One-to-one practice with a trainer on Google Meet.</p>
                <ul className="-mx-2 mt-2">
                  {slots.length ? slots.map((s) => (
                    <li key={s.id}><Link href="/learn/private" className="flex items-center gap-2.5 rounded-[var(--radius-md)] p-2 hover:bg-[var(--surface-hover)]"><Avatar name={s.trainer} size={24} /><span className="ty-body ty-500 ty-ink">{dayKey(s.start) === dayKey(now.toISOString()) ? "Today" : fmtDate(s.start)}</span><span className="ty-note ty-mono ty-muted">{fmtTime(s.start)}</span><span className="ty-note ty-600 ty-accent ml-auto">Book</span></Link></li>
                  )) : <li className="ty-body ty-muted px-2 py-1">No open slots right now.</li>}
                </ul>
              </>
            )}
          </section>

          {/* tip */}
          <section aria-label="Tip of the day" className="nx-card p-5">
            <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-[var(--accent)]" /><span className="ty-label ty-caps ty-subtle">Tip of the day</span></div>
            <div className="ty-subject ty-ink mt-2">{tip.title}</div>
            <p className="ty-body ty-muted mt-1">{tip.text}</p>
            <Link href="/learn/tips" className="ty-note ty-500 ty-accent mt-2 inline-flex items-center gap-1 hover:underline">More tips<ArrowRight className="h-3.5 w-3.5" /></Link>
          </section>

          {!enrolled && (
            <section aria-label="Enrol" className="nx-glass p-5">
              <Award className="h-5 w-5 text-[var(--accent)]" />
              <div className="ty-head ty-ink mt-2">{freePeriod() ? `Free until ${FREE_UNTIL_LABEL}` : "Go further"}</div>
              <p className="ty-body ty-muted mt-1">{freePeriod() ? "Every lesson, test and grammar topic is free. Add live classes with our trainers and your certificate:" : `Get live classes, every chapter for ${PLAN.months} months and your Certificate of Completion.`}</p>
              <Button onClick={() => setDialog(true)} className="mt-4 w-full">{`Pay ₹${PLAN.price.toLocaleString("en-IN")}`}</Button>
            </section>
          )}
        </aside>
      </div>
      {dialog !== false && <EnrolDialog userId={user.id} week={typeof dialog === "number" ? dialog : undefined} onClose={() => setDialog(false)} />}
    </div>
  );
}
