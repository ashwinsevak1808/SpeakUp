import type { Progress } from "./auth";
import { streakOf } from "./auth";
import { certificateStatus, weekDone, type Course, type Node } from "./course-core";

export type Status = "done" | "current" | "locked" | "paywall";

/** First node in the student's path that is not finished. */
export const currentNode = (c: Course, p: Progress): Node | null => c.sequence.find((n) => !p.done.includes(n.id)) ?? null;

/** done = finished, current = do this next, locked = comes later, paywall = needs a plan or a week unlock.
 *  open(week) says whether this student may open that week (see lib/access.ts). */
export function statusOf(c: Course, node: Node, p: Progress, open: (week: number) => boolean): Status {
  if (p.done.includes(node.id)) return "done";
  if (!open(node.week)) return "paywall";
  const cur = currentNode(c, p);
  return cur && cur.id === node.id ? "current" : "locked";
}
export const publishedNodes = (c: Course) => c.sequence.length;
export const doneNodes = (c: Course, p: Progress) => c.sequence.filter((n) => p.done.includes(n.id)).length;
export function weekProgress(c: Course, p: Progress, weekN: number) {
  const ids = c.sequence.filter((n) => n.week === weekN).map((n) => n.id);
  return { done: ids.filter((i) => p.done.includes(i)).length, total: ids.length };
}

/* ---------------- milestones ---------------- */
export type Milestone = { id: string; title: string; desc: string; earned: (c: Course, p: Progress) => boolean };
const lessonsDone = (c: Course, p: Progress) => c.sequence.filter((n) => n.kind === "lesson" && p.done.includes(n.id)).length;
const monthDone = (c: Course, p: Progress, month: number) => { const ws = c.weeks.filter((w) => w.month === month && !w.comingSoon); return ws.length > 0 && ws.every((w) => weekDone(c, p, w.n)); };
export const MILESTONES: Milestone[] = [
  { id: "first", title: "First Step", desc: "Finish your first lesson", earned: (c, p) => lessonsDone(c, p) >= 1 },
  { id: "streak3", title: "3-Day Streak", desc: "Study 3 days in a row", earned: (_c, p) => streakOf(p.days) >= 3 },
  { id: "week1", title: "Week 1 Complete", desc: "Finish Week 1 and its checkpoint", earned: (c, p) => weekDone(c, p, 1) },
  { id: "speaker", title: "Confident Speaker", desc: "Complete 10 lessons", earned: (c, p) => lessonsDone(c, p) >= 10 },
  { id: "star", title: "Checkpoint Star", desc: "Earn 3 stars on a checkpoint", earned: (_c, p) => Object.values(p.stars).some((s) => s >= 3) },
  { id: "streak7", title: "7-Day Streak", desc: "Study 7 days in a row", earned: (_c, p) => streakOf(p.days) >= 7 },
  { id: "month1", title: "Month 1 Complete", desc: "Finish all of Month 1", earned: (c, p) => monthDone(c, p, 1) },
  { id: "graduate", title: "Graduate", desc: "Finish the whole course", earned: (c, p) => certificateStatus(c, p).eligible },
];
