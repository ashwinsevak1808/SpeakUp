"use client";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** Text with *highlighted* words (the course content marks key words with asterisks). */
export function Mark({ text, tone = "accent", className }: { text: string; tone?: "accent" | "strong" | "muted"; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <span className={className}>
      {parts.map((p, i) => p.startsWith("*") && p.endsWith("*") && p.length > 2
        ? <mark key={i} className={cn("rounded-[3px] px-[2px] font-semibold", tone === "accent" ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : tone === "strong" ? "bg-transparent text-[var(--text-primary)] underline decoration-[var(--accent)] decoration-2 underline-offset-4" : "bg-transparent text-inherit")}>{p.slice(1, -1)}</mark>
        : <Fragment key={i}>{p}</Fragment>)}
    </span>
  );
}

/** The same text, ready to be read aloud: no asterisks and no notes in brackets. */
export const speakable = (text: string) => text.replace(/\*/g, "").replace(/\s*\([^)]*\)/g, "").replace(/\s*(→|\/)\s*/g, ". ").trim();
