"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import { buildCourse, type Course } from "./course-core";
import { WEEKS, type Week } from "./path-data";

/**
 * Lessons come from the backend (/api/content), so trainers can improve them without a code change.
 * The built-in course is the instant starting point; the server copy replaces it as soon as it loads.
 * The path is shaped per student: intermediate students skip the beginner-only lessons.
 */
type Ctx = { weeks: Week[]; fromServer: boolean; reload: () => void };
const CourseCtx = createContext<Ctx>({ weeks: WEEKS, fromServer: false, reload: () => {} });

export function CourseProvider({ children }: { children: ReactNode }) {
  const [weeks, setWeeks] = useState<Week[]>(WEEKS);
  const [fromServer, setFromServer] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () => fetch("/api/content", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { weeks?: Week[] } | null) => {
      if (alive && d?.weeks) { setWeeks(d.weeks); setFromServer(true); }
    }).catch(() => {});
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => { alive = false; window.removeEventListener("focus", onFocus); };
  }, [tick]);

  const value = useMemo<Ctx>(() => ({ weeks, fromServer, reload: () => setTick((t) => t + 1) }), [weeks, fromServer]);
  return <CourseCtx.Provider value={value}>{children}</CourseCtx.Provider>;
}

/** The course shaped for the signed-in student. */
export function useCourse(): Course & { fromServer: boolean; reload: () => void } {
  const { weeks, fromServer, reload } = useContext(CourseCtx);
  const { profile } = useAuth();
  const course = useMemo(() => buildCourse(weeks, profile.level), [weeks, profile.level]);
  return { ...course, fromServer, reload };
}
/** The whole course for a trainer (nothing skipped). */
export function useFullCourse() {
  const { weeks, fromServer, reload } = useContext(CourseCtx);
  const course = useMemo(() => buildCourse(weeks, "beginner"), [weeks]);
  return { ...course, fromServer, reload };
}
