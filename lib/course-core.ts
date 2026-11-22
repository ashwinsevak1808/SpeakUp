/* Pure course logic (no React, no browser): used by the backend, the student app and the tests. */
import type { Goal, Item, Lesson, Level, Week } from "./path-data";
import type { Progress } from "./auth";

export type Node =
  | { kind: "lesson"; id: string; week: number; lesson: Lesson }
  | { kind: "checkpoint"; id: string; week: number; title: string };

export type Course = ReturnType<typeof buildCourse>;

/** Build the walkable course for one student. Intermediate students skip lessons tagged ["beginner"]. */
export function buildCourse(weeks: Week[], level: Level = "beginner") {
  const visible = (l: Lesson) => !l.levels || l.levels.includes(level);
  const sequence: Node[] = [];
  const skipped: Lesson[] = [];
  for (const w of weeks) {
    if (w.comingSoon) continue;
    for (const l of w.lessons) { if (visible(l)) sequence.push({ kind: "lesson", id: l.id, week: w.n, lesson: l }); else skipped.push(l); }
    sequence.push({ kind: "checkpoint", id: w.checkpoint.id, week: w.n, title: w.checkpoint.title });
  }
  const allLessons = weeks.flatMap((w) => w.lessons);
  const lessonById = (id: string) => allLessons.find((l) => l.id === id);
  return {
    weeks, level, sequence, skipped, allLessons, lessonById,
    weekOfLesson: (l: Lesson) => weeks.find((w) => w.n === l.week)!,
    checkpointById: (id: string) => { const w = weeks.find((x) => x.checkpoint.id === id); return w ? { week: w, ...w.checkpoint, items: checkpointItems(w, visible) } : undefined; },
    itemById: (id: string): Item | undefined => allLessons.flatMap((l) => l.practice).find((i) => i.id === id),
    totalWeeks: weeks.length,
    publishedWeeks: weeks.filter((w) => !w.comingSoon).length,
  };
}
/** Weekly review = first two exercises of each lesson (speech exercises excluded). Always in sync with lesson edits. */
export const checkpointItems = (w: Week, visible: (l: Lesson) => boolean = () => true): Item[] =>
  w.lessons.filter(visible).flatMap((l) => l.practice.filter((p) => p.t !== "say").slice(0, 2));

export const GOAL_LABEL: Record<Goal, string> = { everyday: "Everyday confidence", work: "Work and career", interview: "Job interviews", study: "College and study" };
export const LEVEL_LABEL: Record<Level, string> = { beginner: "Beginner: I am starting or rebuilding", intermediate: "Intermediate: I can talk, but I want to improve" };

export function weekDone(course: Course, p: Progress, weekN: number) {
  const w = course.weeks.find((x) => x.n === weekN);
  if (!w || w.comingSoon) return false;
  const ids = course.sequence.filter((n) => n.week === weekN).map((n) => n.id);
  return ids.length > 0 && ids.every((i) => p.done.includes(i));
}
export function certificateStatus(course: Course, p: Progress) {
  const weeksDone = course.weeks.filter((w) => weekDone(course, p, w.n)).length;
  return { weeksDone, weeksNeeded: course.totalWeeks, eligible: weeksDone >= course.totalWeeks };
}
