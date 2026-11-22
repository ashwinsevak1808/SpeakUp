"use client";
import { useState } from "react";
import { TIPS } from "@/lib/learn-data";
import { Card, PageTitle } from "@/components/learn/ui";
import { cn } from "@/lib/utils";

const CATS = ["All", ...Array.from(new Set(TIPS.map((t) => t.cat)))];

export default function Tips() {
  const [cat, setCat] = useState("All");
  const list = TIPS.filter((t) => cat === "All" || t.cat === cat);
  return (
    <>
      <PageTitle title="Tips" text="Short, practical advice you can use today." />
      <div className="mb-6 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("rounded-md border px-4 py-1.5 text-sm font-medium transition-colors", cat === c ? "border-accent-600 bg-accent-600 text-white" : "border-line bg-white text-brand-800 hover:bg-brand-50")}>{c}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((t) => (
          <Card key={t.id}>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t.cat}</div>
            <h2 className="mt-1 font-display text-lg font-semibold text-brand-900">{t.title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{t.text}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
