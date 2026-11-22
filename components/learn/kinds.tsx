"use client";
import type { LessonKind } from "@/lib/path-data";
import { BookOpen, Flag, Mic, PenLine, Sparkles, Trophy, Users, type IconType } from "@/components/learn/icons";
import { cn } from "@/lib/utils";

/**
 * One icon per lesson kind, used wherever a lesson appears (path, dashboard, library).
 * Kinds are told apart by icon and label only: the app uses a single accent colour.
 */
export type KindKey = LessonKind | "Checkpoint";

export const KIND_STYLE: Record<KindKey, { icon: IconType; hint: string }> = {
  "Start here": { icon: Sparkles, hint: "Your first steps" },
  Grammar: { icon: PenLine, hint: "Rules and patterns" },
  Speaking: { icon: Mic, hint: "Say it out loud" },
  Vocabulary: { icon: BookOpen, hint: "Words and phrases" },
  Conversation: { icon: Users, hint: "Real situations" },
  Project: { icon: Trophy, hint: "Put it all together" },
  Checkpoint: { icon: Flag, hint: "Weekly review" },
};

export const KIND_ORDER: KindKey[] = ["Grammar", "Speaking", "Conversation", "Vocabulary", "Project", "Checkpoint"];

/** Square tile with the kind's icon. tone: neutral (default), accent (current item), solid (done). */
export function KindIcon({ kind, size = "md", tone = "neutral", className }: { kind: KindKey; size?: "sm" | "md" | "lg"; tone?: "neutral" | "accent" | "solid"; className?: string }) {
  const I = KIND_STYLE[kind].icon;
  const box = size === "lg" ? "size-12 rounded-[var(--radius-lg)]" : size === "sm" ? "size-7 rounded-[var(--radius-sm)]" : "size-9 rounded-[var(--radius-md)]";
  const ic = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  return (
    <span aria-hidden className={cn("grid shrink-0 place-items-center", box,
      tone === "solid" ? "bg-[var(--accent)] text-white" : tone === "accent" ? "bg-[var(--accent-subtle)] text-[var(--accent-text)] shadow-[inset_0_0_0_1px_var(--border-accent)]" : "bg-white text-[var(--text-muted)] shadow-[inset_0_0_0_1px_var(--border)]", className)}>
      <I className={ic} />
    </span>
  );
}

/** The kind as a small caps label. */
export function KindBadge({ kind, className }: { kind: KindKey; className?: string }) {
  return <span className={cn("ty-label ty-caps ty-subtle", className)}>{kind}</span>;
}
