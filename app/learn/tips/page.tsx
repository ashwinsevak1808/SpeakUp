"use client";
import { useState } from "react";
import { BookOpen, Mic, PenLine, Sparkles, Target, Volume2, type IconType } from "@/components/learn/icons";
import { TIPS, type Tip } from "@/lib/learn-data";
import { PageTitle } from "@/components/learn/ui";
import { cn } from "@/lib/utils";

/** One colour and icon per tip category. EDIT here to restyle. */
const CAT: Record<Tip["cat"], { color: string; icon: IconType }> = {
  Speaking: { color: "#e0457b", icon: Mic },
  Listening: { color: "#0891b2", icon: Volume2 },
  Vocabulary: { color: "#d97706", icon: BookOpen },
  Confidence: { color: "#7c3aed", icon: Sparkles },
  Grammar: { color: "#4f46e5", icon: PenLine },
  Interviews: { color: "#0e9f6e", icon: Target },
};
const CATS = ["All", ...Array.from(new Set(TIPS.map((t) => t.cat)))] as ("All" | Tip["cat"])[];

export default function Tips() {
  const [cat, setCat] = useState<"All" | Tip["cat"]>("All");
  const list = TIPS.filter((t) => cat === "All" || t.cat === cat);
  return (
    <>
      <PageTitle title="Speaking tips" text="Short, practical advice you can use today. Pick one and try it before you sleep." />
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Tip categories">
        {CATS.map((c) => {
          const on = cat === c; const color = c === "All" ? undefined : CAT[c].color;
          return (
            <button key={c} role="tab" aria-selected={on} onClick={() => setCat(c)} style={on && color ? { borderColor: color, background: `color-mix(in srgb, ${color} 10%, white)` } : undefined}
              className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors", on ? (color ? "text-brand-900" : "border-brand-900 bg-brand-900 text-white") : "border-line bg-white text-muted hover:border-brand-300 hover:text-brand-900")}>
              {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}{c}
            </button>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((t, i) => {
          const { color, icon: I } = CAT[t.cat];
          return (
            <article key={t.id} style={{ ["--k" as string]: color }} className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]">
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} aria-hidden />
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl text-[var(--k)]" style={{ background: "color-mix(in srgb, var(--k) 12%, white)" }}><I className="h-5 w-5" /></span>
                <span className="text-2xl font-semibold text-brand-200 ty-mono">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="ty-label ty-caps mt-4" style={{ color: `color-mix(in srgb, ${color} 80%, black)` }}>{t.cat}</div>
              <h2 className="ty-title mt-1">{t.title}</h2>
              <p className="ty-body ty-secondary mt-2 leading-relaxed">{t.text}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
