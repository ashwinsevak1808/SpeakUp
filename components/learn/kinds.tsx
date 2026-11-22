"use client";
import type { CSSProperties } from "react";
import type { LessonKind } from "@/lib/path-data";
import { BookOpen, Flag, Mic, PenLine, Sparkles, Trophy, Users, type IconType } from "@/components/learn/icons";
import { cn } from "@/lib/utils";

/**
 * One look per lesson kind, used everywhere a lesson appears (path, dashboard, library).
 * EDIT: change a colour or icon here and every screen follows.
 */
export type KindKey = LessonKind | "Checkpoint";

export const KIND_STYLE: Record<KindKey, { color: string; icon: IconType; hint: string }> = {
  "Start here": { color: "#0e9f6e", icon: Sparkles, hint: "Your first steps" },
  Grammar: { color: "#4f46e5", icon: PenLine, hint: "Rules and patterns" },
  Speaking: { color: "#e0457b", icon: Mic, hint: "Say it out loud" },
  Vocabulary: { color: "#d97706", icon: BookOpen, hint: "Words and phrases" },
  Conversation: { color: "#0891b2", icon: Users, hint: "Real situations" },
  Project: { color: "#7c3aed", icon: Trophy, hint: "Put it all together" },
  Checkpoint: { color: "#475569", icon: Flag, hint: "Weekly review" },
};

export const KIND_ORDER: KindKey[] = ["Grammar", "Speaking", "Conversation", "Vocabulary", "Project", "Checkpoint"];

const vars = (color: string): CSSProperties => ({ ["--k" as string]: color });

/** Rounded square with the kind's icon. */
export function KindIcon({ kind, size = "md", className }: { kind: KindKey; size?: "sm" | "md" | "lg"; className?: string }) {
  const { color, icon: I } = KIND_STYLE[kind];
  const box = size === "lg" ? "h-12 w-12 rounded-xl" : size === "sm" ? "h-7 w-7 rounded-md" : "h-10 w-10 rounded-lg";
  const ic = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span style={vars(color)} className={cn("grid shrink-0 place-items-center text-[var(--k)]", box, className)} aria-hidden>
      <span className={cn("grid h-full w-full place-items-center", box)} style={{ background: "color-mix(in srgb, var(--k) 12%, white)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--k) 22%, white)" }}>
        <I className={ic} />
      </span>
    </span>
  );
}

/** Small coloured pill with the kind name. */
export function KindBadge({ kind, className }: { kind: KindKey; className?: string }) {
  const { color } = KIND_STYLE[kind];
  return (
    <span
      style={{ ...vars(color), background: "color-mix(in srgb, var(--k) 11%, white)", color: "color-mix(in srgb, var(--k) 82%, black)" }}
      className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none", className)}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--k)]" />
      {kind}
    </span>
  );
}
