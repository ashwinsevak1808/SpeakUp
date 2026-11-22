"use client";
import { useState } from "react";
import { Check, ExternalLink, Lock } from "@/components/learn/icons";
import { toggleRead, useAuth } from "@/lib/auth";
import { CHAPTERS, FREE_CHAPTERS } from "@/lib/learn-data";
import { Bar, Card, PageTitle } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { cn } from "@/lib/utils";

export default function Library() {
  const { user, progress } = useAuth();
  const [dialog, setDialog] = useState(false);
  if (!user) return null;
  const parts = Array.from(new Set(CHAPTERS.map((l) => l.part)));
  return (
    <>
      <PageTitle title="Library" text={`Your daily lessons are on My Path. This is the full “Speak Up” guide to read at your own pace: ${CHAPTERS.length} chapters. The first ${FREE_CHAPTERS} are free.`}>
        <div className="w-48"><div className="mb-1 text-right text-xs text-muted">{progress.read.length} of {CHAPTERS.length} read</div><Bar value={(progress.read.length / CHAPTERS.length) * 100} /></div>
      </PageTitle>
      <div className="space-y-8">
        {parts.map((part) => (
          <section key={part}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">{part}</h2>
            <div className="grid gap-3">
              {CHAPTERS.filter((l) => l.part === part).map((l) => {
                const locked = l.n > FREE_CHAPTERS && !user.enrolled;
                const done = progress.read.includes(l.id);
                return (
                  <Card key={l.id} className={cn("flex flex-wrap items-center gap-4 !p-4", locked && "bg-slate-50")}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-100 font-display font-semibold text-brand-700">{l.n}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-semibold text-brand-900">{l.title}</div>
                      <div className="text-sm text-muted">{l.desc}</div>
                    </div>
                    {locked ? (
                      <button onClick={() => setDialog(true)} className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-white"><Lock className="h-4 w-4" />Enrol to unlock</button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <a href={l.href} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700">Read <ExternalLink className="h-3.5 w-3.5" /></a>
                        <button onClick={() => toggleRead(user.id, l.id)} aria-pressed={done} className={cn("flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold", done ? "border-brand-600 bg-brand-50 text-brand-800" : "border-line text-muted hover:bg-brand-50")}>
                          <Check className="h-4 w-4" />{done ? "Read" : "Mark as read"}
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </>
  );
}
