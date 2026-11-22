"use client";
import { useState } from "react";
import { BookOpen, Mic, PenLine, Sparkles, Target, Volume2, type IconType } from "@/components/learn/icons";
import { TIPS, type Tip } from "@/lib/learn-data";
import { PageTitle, Tabs } from "@/components/learn/ui";

/** One icon per tip category. The app uses a single accent colour, so categories differ by icon and label only. */
const CAT_ICON: Record<Tip["cat"], IconType> = { Speaking: Mic, Listening: Volume2, Vocabulary: BookOpen, Confidence: Sparkles, Grammar: PenLine, Interviews: Target };
const CATS = ["All", ...Array.from(new Set(TIPS.map((t) => t.cat)))] as ("All" | Tip["cat"])[];

export default function Tips() {
  const [cat, setCat] = useState<"All" | Tip["cat"]>("All");
  const list = TIPS.filter((t) => cat === "All" || t.cat === cat);
  return (
    <div className="nx-page">
      <PageTitle eyebrow={`${TIPS.length} tips`} title="Speaking tips" text="Short, practical advice you can use today. Pick one and try it before you sleep." />
      <div className="nx-card px-5">
        <Tabs label="Tip categories" value={cat} onChange={setCat} className="pt-2" tabs={CATS.map((c) => ({ id: c, label: c, count: c === "All" ? TIPS.length : TIPS.filter((t) => t.cat === c).length }))} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => {
          const I = CAT_ICON[t.cat];
          const n = TIPS.indexOf(t) + 1;
          return (
            <article key={t.id} className="nx-card group flex flex-col p-5 transition-shadow hover:shadow-[0_0_0_1px_var(--border-accent),0_2px_8px_rgba(19,26,22,.05)]">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-white text-[var(--text-muted)] shadow-[inset_0_0_0_1px_var(--border)] transition-colors group-hover:bg-[var(--accent-subtle)] group-hover:text-[var(--accent-text)] group-hover:shadow-[inset_0_0_0_1px_var(--border-accent)]"><I className="h-[18px] w-[18px]" /></span>
                <span className="ty-label ty-mono ty-subtle">{String(n).padStart(2, "0")}</span>
              </div>
              <div className="ty-label ty-caps ty-accent mt-4">{t.cat}</div>
              <h2 className="ty-head ty-ink mt-1">{t.title}</h2>
              <p className="ty-body ty-secondary mt-2">{t.text}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
