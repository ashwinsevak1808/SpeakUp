"use client";
import { useState } from "react";
import { BookOpen, Check, ExternalLink, Lock } from "@/components/learn/icons";
import { toggleRead, useAuth } from "@/lib/auth";
import { CHAPTERS, FREE_CHAPTERS } from "@/lib/learn-data";
import { Card, PageTitle, Ring } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { cn } from "@/lib/utils";

/** One colour per part of the book. EDIT here to restyle. */
const PART_COLORS = ["#0e9f6e", "#4f46e5", "#0891b2", "#d97706", "#e0457b"];
type Filter = "all" | "unread" | "free";

export default function Library() {
  const { user, progress } = useAuth();
  const [dialog, setDialog] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  if (!user) return null;
  const parts = Array.from(new Set(CHAPTERS.map((l) => l.part)));
  const read = progress.read.length;
  const pct = Math.round((read / CHAPTERS.length) * 100);
  const nextUp = CHAPTERS.find((c) => !progress.read.includes(c.id) && (c.n <= FREE_CHAPTERS || user.enrolled));
  const FILTERS: { id: Filter; label: string }[] = [{ id: "all", label: `All ${CHAPTERS.length}` }, { id: "unread", label: "Not read yet" }, { id: "free", label: `Free ${FREE_CHAPTERS}` }];

  return (
    <>
      <PageTitle title="Library" text={`Your daily lessons are on My Path. This is the full “Speak Up” guide to read at your own pace. The first ${FREE_CHAPTERS} chapters are free.`} />

      <Card className="mb-6 flex flex-wrap items-center gap-6 !p-5 sm:!p-6">
        <Ring value={pct} size={96} stroke={10}><div className="text-center"><div className="ty-title">{read}</div><div className="ty-label ty-subtle">of {CHAPTERS.length}</div></div></Ring>
        <div className="min-w-[200px] flex-1">
          <div className="ty-label ty-caps ty-subtle">{read === 0 ? "Start reading" : "Continue with"}</div>
          {nextUp ? <><div className="ty-head mt-1">Chapter {nextUp.n}: {nextUp.title}</div><div className="ty-note ty-muted mt-0.5">{nextUp.desc}</div></> : <div className="ty-head mt-1">You have read every chapter available to you.</div>}
        </div>
        {nextUp && <a href={nextUp.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-700"><BookOpen className="h-4 w-4" />{read === 0 ? "Read chapter 1" : "Keep reading"}</a>}
      </Card>

      <div className="mb-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter chapters">
        {FILTERS.map((f) => <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)} className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors", filter === f.id ? "border-brand-900 bg-brand-900 text-white" : "border-line bg-white text-muted hover:border-brand-300 hover:text-brand-900")}>{f.label}</button>)}
      </div>

      <div className="space-y-9">
        {parts.map((part, pi) => {
          const color = PART_COLORS[pi % PART_COLORS.length];
          const list = CHAPTERS.filter((l) => l.part === part && (filter === "all" || (filter === "unread" ? !progress.read.includes(l.id) : l.n <= FREE_CHAPTERS)));
          if (!list.length) return null;
          const partRead = CHAPTERS.filter((l) => l.part === part && progress.read.includes(l.id)).length;
          const partTotal = CHAPTERS.filter((l) => l.part === part).length;
          return (
            <section key={part} style={{ ["--k" as string]: color }}>
              <h2 className="mb-3 flex items-center gap-3"><span className="h-5 w-1 rounded-full bg-[var(--k)]" /><span className="ty-head">{part}</span><span className="ty-note ty-muted">{partRead}/{partTotal} read</span></h2>
              <div className="grid gap-3 md:grid-cols-2">
                {list.map((l) => {
                  const locked = l.n > FREE_CHAPTERS && !user.enrolled;
                  const done = progress.read.includes(l.id);
                  return (
                    <article key={l.id} className={cn("flex gap-4 rounded-[var(--radius-xl)] bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]", locked && "bg-brand-50")}>
                      <span className="grid h-14 w-12 shrink-0 place-items-center rounded-md text-lg font-semibold text-white shadow-sm" style={{ background: locked ? "var(--color-brand-300)" : "linear-gradient(160deg, color-mix(in srgb, var(--k) 85%, white), var(--k))" }}>{locked ? <Lock className="h-5 w-5" /> : l.n}</span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="ty-subject ty-ink">{l.title}{done && <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-ok"><Check className="h-3 w-3" />Read</span>}</div>
                        <p className="ty-note ty-muted mt-0.5 flex-1">{l.desc}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {locked ? <button onClick={() => setDialog(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-brand-50"><Lock className="h-3.5 w-3.5" />Enrol to unlock</button> : (
                            <>
                              <a href={l.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-700">Read <ExternalLink className="h-3 w-3" /></a>
                              <button onClick={() => toggleRead(user.id, l.id)} aria-pressed={done} className={cn("inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold", done ? "border-ok/30 bg-green-50 text-ok" : "border-line bg-white text-muted hover:bg-brand-50")}><Check className="h-3.5 w-3.5" />{done ? "Read" : "Mark as read"}</button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </>
  );
}
