/* Shared types and builders for the course content files (path-data.ts, path-month2.ts, path-month3.ts). */
import { TOPICS } from "./practice-data";

export type Choose = { t: "choose"; id: string; q: string; options: string[]; answer: number; why: string; hint?: string };
export type TypeIn = { t: "type"; id: string; q: string; answers: string[]; why: string; hint?: string };
export type Order = { t: "order"; id: string; prompt: string; words: string[]; answers: string[]; why?: string };
export type Say = { t: "say"; id: string; text: string; hint?: string };
export type Item = Choose | TypeIn | Order | Say;
export type Level = "beginner" | "intermediate";
export type Goal = "everyday" | "work" | "interview" | "study";

/**
 * One learn card. Optional extras for grammar:
 *   rule  - the pattern in one line, e.g. "an + vowel *sound*"
 *   pairs - common mistakes as [wrong, right]
 * Wrap a word in *asterisks* in examples, pairs or rule to highlight it.
 */
export type Card = { title: string; text: string; examples?: string[]; tip?: string; rule?: string; pairs?: [string, string][] };
export type LessonKind = "Start here" | "Grammar" | "Speaking" | "Vocabulary" | "Conversation" | "Project";
export type Lesson = {
  id: string; day: number; week: number; title: string; kind: LessonKind; goal: string; minutes: number;
  warm: { phrase: string; meaning: string; example: string };
  learn: Card[]; practice: Item[];
  speak: { prompt: string; model: string; checklist: string[]; check?: { minWords: number; mustInclude?: string[] } };
  recap: string[];
  levels?: Level[]; // omit = for everyone. ["beginner"] = skipped for intermediate students.
  goals?: Goal[];   // shown as "recommended for your goal"
};
export type Week = {
  n: number; month: number; title: string; theme: string; comingSoon?: boolean;
  lessons: Lesson[]; checkpoint: { id: string; title: string };
};

/* ---------------- item builders ---------------- */
let seed = 7;
const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
function shuffle<T>(arr: T[], key: string): T[] {
  seed = [...key].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 233280, 11);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.length > 1 && a.every((w, i) => w === arr[i])) a.push(a.shift() as T);
  return a;
}
/** Questions from the grammar bank (practice-data.ts) by topic and 1-based number. */
export const bank = (topic: string, nums: number[]): Item[] => {
  const t = TOPICS.find((x) => x.id === topic);
  if (!t) throw new Error("unknown topic " + topic);
  return nums.map((n) => { const q = t.questions[n - 1]; return { t: "choose", id: q.id, q: q.q, options: q.options, answer: q.answer, why: q.why } as Choose; });
};
export const choose = (id: string, q: string, options: string[], answer: number, why: string, hint?: string): Choose => ({ t: "choose", id, q, options, answer, why, hint });
export const type = (id: string, q: string, answers: string[], why: string, hint?: string): TypeIn => ({ t: "type", id, q, answers, why, hint });
export const order = (id: string, prompt: string, sentence: string, extra: string[] = [], alts: string[] = []): Order => ({
  t: "order", id, prompt, words: shuffle([...sentence.split(" "), ...extra], id), answers: [sentence, ...alts],
});

/** Compact lesson builder for the later months. Without a recap, the cards' rules (or titles) are used. */
export function lesson(
  id: string, day: number, week: number, title: string, kind: LessonKind, minutes: number, goal: string,
  warm: [phrase: string, meaning: string, example: string],
  learn: Card[], practice: Item[],
  speak: { prompt: string; model: string; checklist: string[]; minWords: number; must?: string[] },
  recap?: string[], extra: Pick<Lesson, "levels" | "goals"> = {},
): Lesson {
  return {
    id, day, week, title, kind, minutes, goal,
    warm: { phrase: warm[0], meaning: warm[1], example: warm[2] },
    learn, practice,
    speak: { prompt: speak.prompt, model: speak.model, checklist: speak.checklist, check: { minWords: speak.minWords, mustInclude: speak.must } },
    recap: recap?.length ? recap : learn.map((c) => (c.rule ?? c.title).replace(/\*/g, "")), ...extra,
  };
}
