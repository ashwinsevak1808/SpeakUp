"use client";
/** Library, in the dashboard layout: page head · chapters grouped by part (rows) · reading aside. */
import { useState } from "react";
import { BookOpen, Check, ExternalLink, Lock } from "@/components/learn/icons";
import { toggleRead, useAuth } from "@/lib/auth";
import { CHAPTERS, FREE_CHAPTERS } from "@/lib/learn-data";
import { Badge, Button, Meter, PageTitle, Ring, Tabs, btn } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { cn } from "@/lib/utils";
import { freePeriod } from "@/lib/access";

type Filter = "all" | "unread" | "free";

export default function Library() {
  const { user, progress } = useAuth();
  const [dialog, setDialog] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  if (!user) return null;
  const parts = Array.from(new Set(CHAPTERS.map((l) => l.part)));
  const read = progress.read.length;
  const pct = Math.round((read / CHAPTERS.length) * 100);
  const nextUp = CHAPTERS.find((c) => !progress.read.includes(c.id) && (c.n <= FREE_CHAPTERS || user.enrolled || freePeriod()));
  const unread = CHAPTERS.filter((c) => !progress.read.includes(c.id)).length;

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`The “Speak Up” guide · ${CHAPTERS.length} chapters`} title="Library" text={`Your daily lessons are on My path. This is the full guide to read at your own pace. The first ${FREE_CHAPTERS} chapters are free.`}>
        {nextUp && <a href={nextUp.href} target="_blank" rel="noopener" className={btn("primary", "md")}><BookOpen className="h-4 w-4" />{read === 0 ? "Read chapter 1" : "Keep reading"}</a>}
      </PageTitle>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="nx-card px-5">
            <Tabs label="Filter chapters" value={filter} onChange={setFilter} className="pt-2"
              tabs={[{ id: "all", label: "All", count: CHAPTERS.length }, { id: "unread", label: "Not read yet", count: unread }, { id: "free", label: "Free", count: FREE_CHAPTERS }]} />
          </div>

          {parts.map((part) => {
            const list = CHAPTERS.filter((l) => l.part === part && (filter === "all" || (filter === "unread" ? !progress.read.includes(l.id) : l.n <= FREE_CHAPTERS)));
            if (!list.length) return null;
            const partRead = CHAPTERS.filter((l) => l.part === part && progress.read.includes(l.id)).length;
            const partTotal = CHAPTERS.filter((l) => l.part === part).length;
            return (
              <section key={part} aria-label={part} className="nx-card overflow-hidden">
                <header className="flex items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1"><h2 className="ty-head ty-ink">{part}</h2></div>
                  <div className="w-24"><div className="ty-label ty-mono ty-subtle mb-1 text-right">{partRead}/{partTotal} read</div><Meter pct={(partRead / partTotal) * 100} className="!h-1.5" /></div>
                </header>
                <ul>
                  {list.map((l) => {
                    const locked = l.n > FREE_CHAPTERS && !user.enrolled && !freePeriod();
                    const done = progress.read.includes(l.id);
                    return (
                      <li key={l.id} className={cn("flex flex-wrap items-center gap-3 border-t border-[var(--border)] px-5 py-3.5 sm:flex-nowrap sm:gap-4", locked && "opacity-75")}>
                        <span className={cn("ty-mono grid h-10 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[13px] font-semibold", done ? "bg-[var(--accent)] text-white" : locked ? "bg-[var(--surface-sunken)] text-[var(--text-subtle)]" : "bg-white text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--border-strong)]")}>{locked ? <Lock className="h-3.5 w-3.5" /> : done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : l.n}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2"><span className="ty-subject ty-ink truncate">{l.title}</span>{l.n <= FREE_CHAPTERS && !user.enrolled && <Badge tone="accent" className="!h-5 !px-2">Free</Badge>}</div>
                          <p className="ty-note ty-muted mt-0.5">Chapter {l.n} · {l.desc}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {locked ? <button onClick={() => setDialog(true)} className={btn("tertiary", "sm")}><Lock className="h-3.5 w-3.5" />Unlock with the plan</button> : (
                            <>
                              <button onClick={() => toggleRead(user.id, l.id)} aria-pressed={done} className={btn("ghost", "sm", done ? "!text-[var(--accent-text)]" : undefined)}><Check className="h-3.5 w-3.5" />{done ? "Read" : "Mark as read"}</button>
                              <a href={l.href} target="_blank" rel="noopener" className={btn("secondary", "sm")}>Read <ExternalLink className="h-3 w-3" /></a>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <aside aria-label="Reading progress" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="flex items-center gap-4">
              <Ring value={pct} size={76} stroke={7}><div className="ty-mono text-[15px] font-semibold text-[var(--text-primary)]">{read}</div></Ring>
              <div><div className="ty-subject ty-ink">Chapters read</div><div className="ty-note ty-muted">{read} of {CHAPTERS.length} · {pct}%</div></div>
            </div>
            <dl className="nx-facts mt-4">{parts.map((p) => <div key={p}><dt className="truncate">{p.split(": ")[1] ?? p}</dt><dd>{CHAPTERS.filter((c) => c.part === p && progress.read.includes(c.id)).length}/{CHAPTERS.filter((c) => c.part === p).length}</dd></div>)}</dl>
          </section>
          {nextUp ? (
            <section className="nx-glass p-5">
              <span className="ty-label ty-caps ty-accent">{read === 0 ? "Start reading" : "Continue with"}</span>
              <div className="ty-subject ty-ink mt-2">Chapter {nextUp.n}: {nextUp.title}</div>
              <p className="ty-note ty-muted mt-1">{nextUp.desc}</p>
              <a href={nextUp.href} target="_blank" rel="noopener" className={btn("primary", "md", "mt-4 w-full")}><BookOpen className="h-4 w-4" />Open chapter</a>
            </section>
          ) : !user.enrolled && (
            <section className="nx-glass p-5">
              <div className="ty-subject ty-ink">Unlock every chapter</div>
              <p className="ty-note ty-muted mt-1">With the full plan you can read all {CHAPTERS.length} chapters.</p>
              <Button onClick={() => setDialog(true)} className="mt-4 w-full">Pay ₹3,000</Button>
            </section>
          )}
        </aside>
      </div>
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </div>
  );
}
