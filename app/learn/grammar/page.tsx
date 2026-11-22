"use client";
/** Grammar guide: the complete syllabus, grouped, with where each topic is taught and your progress. */
import Link from "next/link";
import { useState } from "react";
import { Check, Lock, Play } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { GRAMMAR_MAP, GRAMMAR_TOPIC_COUNT } from "@/lib/grammar-map";
import { statusOf } from "@/lib/path-state";
import { Badge, Meter, PageTitle, Ring, Tabs, btn } from "@/components/learn/ui";
import { nodeHref } from "@/components/learn/LessonPlayer";
import { cn } from "@/lib/utils";
import { opener } from "@/lib/access";

type Filter = "all" | "todo" | "done";
type Row = { topic: string; level: string; id: string; week: number; day: number; title: string; st: "done" | "current" | "locked" | "paywall" | "optional" | "missing" };

export default function GrammarGuide() {
  const { user, progress } = useAuth();
  const course = useCourse();
  const [filter, setFilter] = useState<Filter>("all");
  if (!user) return null;

  const rowsOf = (g: (typeof GRAMMAR_MAP)[number]): Row[] => g.topics.map((t) => {
    const l = course.lessonById(t.lesson);
    if (!l) return { ...t, id: t.lesson, week: 0, day: 0, title: "", st: "missing" };
    const node = course.sequence.find((n) => n.id === t.lesson);
    const st = progress.done.includes(t.lesson) ? "done" : node ? statusOf(course, node, progress, opener(user)) : "optional";
    return { ...t, id: t.lesson, week: l.week, day: l.day, title: l.title, st };
  });
  const all = GRAMMAR_MAP.flatMap(rowsOf);
  const done = all.filter((r) => r.st === "done").length;
  const pct = Math.round((done / GRAMMAR_TOPIC_COUNT) * 100);
  const next = all.filter((r) => r.st === "current")[0];
  const levels = ["Beginner", "Intermediate", "Advanced"].map((lv) => ({ lv, total: all.filter((r) => r.level === lv).length, done: all.filter((r) => r.level === lv && r.st === "done").length }));

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`${GRAMMAR_TOPIC_COUNT} topics · ${GRAMMAR_MAP.length} groups · taught across 12 weeks`} title="Grammar guide" text="Every grammar topic in the course in one place. Each one has its own lesson with rules, examples, common mistakes and practice.">
        {next && <Link href={`/learn/lesson/${next.id}`} className={btn("primary", "md")}><Play className="h-4 w-4" />Next topic</Link>}
      </PageTitle>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="nx-card px-5">
            <Tabs label="Filter topics" value={filter} onChange={setFilter} className="pt-2"
              tabs={[{ id: "all", label: "All topics", count: GRAMMAR_TOPIC_COUNT }, { id: "todo", label: "Still to learn", count: GRAMMAR_TOPIC_COUNT - done }, { id: "done", label: "Learned", count: done }]} />
          </div>

          {GRAMMAR_MAP.map((g) => {
            const rows = rowsOf(g).filter((r) => filter === "all" || (filter === "done" ? r.st === "done" : r.st !== "done"));
            if (!rows.length) return null;
            const gDone = rowsOf(g).filter((r) => r.st === "done").length;
            return (
              <section key={g.title} aria-label={g.title} className="nx-card overflow-hidden">
                <header className="flex items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1"><h2 className="ty-head ty-ink">{g.title}</h2><p className="ty-note ty-muted">{g.desc}</p></div>
                  <div className="w-24"><div className="ty-label ty-mono ty-subtle mb-1 text-right">{gDone}/{g.topics.length}</div><Meter pct={(gDone / g.topics.length) * 100} className="!h-1.5" /></div>
                </header>
                <ul>
                  {rows.map((r) => {
                    const open = r.st === "done" || r.st === "current" || r.st === "optional";
                    return (
                      <li key={r.id + r.topic} className={cn("flex flex-wrap items-center gap-3 border-t border-[var(--border)] px-5 py-3 sm:flex-nowrap sm:gap-4", r.st === "current" && "bg-[color-mix(in_srgb,var(--accent-subtle)_55%,#fff)]")}>
                        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", r.st === "done" ? "bg-[var(--accent)] text-white" : r.st === "current" ? "shadow-[inset_0_0_0_1.5px_var(--accent)]" : "shadow-[inset_0_0_0_1px_var(--border-strong)]")}>
                          {r.st === "done" ? <Check className="h-3 w-3" strokeWidth={3} /> : r.st === "current" ? <span className="size-2 rounded-full bg-[var(--accent)]" /> : null}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="ty-subject ty-ink">{r.topic}</div>
                          <div className="ty-note ty-muted mt-0.5 flex flex-wrap items-center gap-x-2"><span className="ty-label ty-caps ty-subtle">{r.level}</span><span aria-hidden className="size-1 rounded-full bg-[var(--border-strong)]" /><span>Week {r.week} · Day {r.day}</span>{r.st === "optional" && <Badge tone="neutral" className="!h-5 !px-2">Optional for your level</Badge>}</div>
                        </div>
                        <div className="shrink-0">
                          {open ? <Link href={nodeHref({ kind: "lesson", id: r.id })} className={btn(r.st === "current" ? "primary" : "tertiary", "sm")}>{r.st === "done" ? "Revise" : r.st === "current" ? "Start" : "Open"}</Link>
                            : r.st === "paywall" ? <Link href="/learn/path" className={btn("ghost", "sm")}><Lock className="h-3.5 w-3.5" />Unlock</Link>
                            : <Lock className="h-4 w-4 text-[var(--text-subtle)]" aria-label="Locked until you reach it" />}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <aside aria-label="Grammar progress" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="flex items-center gap-4">
              <Ring value={pct} size={76} stroke={7}><div className="ty-mono text-[15px] font-semibold text-[var(--text-primary)]">{pct}%</div></Ring>
              <div><div className="ty-subject ty-ink">Topics learned</div><div className="ty-note ty-muted">{done} of {GRAMMAR_TOPIC_COUNT}</div></div>
            </div>
            <dl className="nx-facts mt-4">{levels.map((l) => <div key={l.lv}><dt>{l.lv}</dt><dd>{l.done} / {l.total}</dd></div>)}</dl>
          </section>
          {next && (
            <section className="nx-glass p-5">
              <span className="ty-label ty-caps ty-accent">Next topic</span>
              <div className="ty-subject ty-ink mt-2">{next.topic}</div>
              <div className="ty-note ty-muted">Week {next.week} · Day {next.day}</div>
              <Link href={`/learn/lesson/${next.id}`} className={btn("primary", "md", "mt-4 w-full")}><Play className="h-4 w-4" />Start</Link>
            </section>
          )}
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">How each topic is taught</div>
            <ol className="mt-2 space-y-1.5">{["A rule in one line", "Examples you can listen to", "Common mistakes, wrong and right", "Practice until it feels easy", "A speaking task that uses it"].map((t, n) => <li key={t} className="ty-body ty-secondary flex gap-2.5"><span className="ty-label ty-mono mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)]">{n + 1}</span>{t}</li>)}</ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
