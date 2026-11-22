"use client";
/**
 * Admin data: everything the panel needs, read straight from Supabase as the signed-in trainer.
 * Row-level security in the database is what allows staff to see all students.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyProgress, streakOf, type Progress, type Role } from "@/lib/auth";
import { buildCourse } from "@/lib/course-core";
import { useFullCourse } from "@/lib/course";
import type { Goal, Level } from "@/lib/path-data";
import { supabase } from "@/lib/supabase/client";

export type StudentStatus = "enrolled" | "requested" | "free";
export type Student = {
  id: string; email: string; name: string; phone: string | null; role: Role;
  enrolled: boolean; plan: string | null; mumbai: boolean; enrolledAt: string | null; planUntil: string | null; createdAt: string;
  lastActive: string | null; level: Level; goal: Goal; avatar: string;
  progress: Progress; done: number; total: number; pct: number; streak: number; week: number; xp: number;
  status: StudentStatus;
};
export type EnrolReq = {
  id: number; user_id: string; plan: string; mumbai: boolean; amount: number | null; status: "pending" | "approved" | "declined" | "cancelled";
  student_note: string | null; staff_note: string | null; created_at: string; handled_at: string | null;
  student: { name: string; email: string; phone: string | null } | null;
};

type Row = {
  id: string; email: string; name: string; phone: string | null; role: Role; enrolled: boolean; plan: string | null; mumbai: boolean;
  enrolled_at: string | null; plan_until: string | null; created_at: string; last_seen_at: string | null;
  student_data: { progress: Partial<Progress> | null; updated_at: string; level: Level | null; goal: Goal | null; avatar: string | null } | null;
};
const PROFILE_SELECT = "id, email, name, phone, role, enrolled, plan, mumbai, enrolled_at, plan_until, created_at, last_seen_at, student_data(progress, updated_at, level:settings->>level, goal:settings->>goal, avatar:settings->>avatar)";
export const REQ_SELECT = "*, student:profiles!enrol_requests_user_id_fkey(name, email, phone)";

type Ctx = { people: Student[]; students: Student[]; staff: Student[]; requests: EnrolReq[]; newLeads: number; loaded: boolean; error: string; reload: () => void };
const AdminCtx = createContext<Ctx>({ people: [], students: [], staff: [], requests: [], newLeads: 0, loaded: false, error: "", reload: () => {} });

const later = (a: string | null, b: string | null) => (!a ? b : !b ? a : a > b ? a : b);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { weeks } = useFullCourse();
  const [rows, setRows] = useState<Row[]>([]);
  const [requests, setRequests] = useState<EnrolReq[]>([]);
  const [newLeads, setNewLeads] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    const sb = supabase();
    const load = async () => {
      const [p, r, l] = await Promise.all([
        sb.from("profiles").select(PROFILE_SELECT).order("created_at", { ascending: false }).limit(5000),
        sb.from("enrol_requests").select(REQ_SELECT).order("created_at", { ascending: false }).limit(500),
        sb.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      if (!alive) return;
      const err = p.error ?? r.error ?? l.error;
      setError(err ? err.message : "");
      if (p.data) setRows(p.data as unknown as Row[]);
      if (r.data) setRequests(r.data as unknown as EnrolReq[]);
      setNewLeads(l.count ?? 0);
      setLoaded(true);
    };
    void load();
    const t = setInterval(load, 60000);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => { alive = false; clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [tick]);

  const people = useMemo(() => {
    const courses = { beginner: buildCourse(weeks, "beginner"), intermediate: buildCourse(weeks, "intermediate") };
    const pendingBy = new Set(requests.filter((x) => x.status === "pending").map((x) => x.user_id));
    return rows.map((r): Student => {
      const d = r.student_data;
      const level: Level = d?.level === "intermediate" ? "intermediate" : "beginner";
      const course = courses[level];
      const progress = { ...emptyProgress(), ...(d?.progress ?? {}) };
      const ids = course.sequence.map((n) => n.id);
      const done = ids.filter((i) => progress.done.includes(i)).length;
      const next = course.sequence.find((n) => !progress.done.includes(n.id));
      return {
        id: r.id, email: r.email, name: r.name || r.email, phone: r.phone, role: r.role, enrolled: r.enrolled, plan: r.plan, mumbai: r.mumbai,
        enrolledAt: r.enrolled_at, planUntil: r.plan_until, createdAt: r.created_at,
        lastActive: later(r.last_seen_at, progress.done.length || progress.days.length ? d?.updated_at ?? null : null),
        level, goal: (d?.goal ?? "everyday") as Goal, avatar: d?.avatar ?? "",
        progress, done, total: ids.length, pct: ids.length ? Math.round((done / ids.length) * 100) : 0,
        streak: streakOf(progress.days), week: next?.week ?? course.totalWeeks, xp: progress.xp,
        status: r.enrolled ? "enrolled" : pendingBy.has(r.id) ? "requested" : "free",
      };
    });
  }, [rows, requests, weeks]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  const value = useMemo<Ctx>(() => ({
    people, students: people.filter((p) => p.role === "student"), staff: people.filter((p) => p.role !== "student"),
    requests, newLeads, loaded, error, reload,
  }), [people, requests, newLeads, loaded, error, reload]);
  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
export const useAdmin = () => useContext(AdminCtx);

/* ---------- small formatting helpers ---------- */
export function ago(iso: string | null, now = Date.now()) {
  if (!iso) return "Never";
  const m = Math.round((now - +new Date(iso)) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24); if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}
export const daysSince = (iso: string | null, now = Date.now()) => (iso ? (now - +new Date(iso)) / 86400000 : Infinity);
export const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
export const fmtDayTime = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
export const STATUS_LABEL: Record<StudentStatus, string> = { enrolled: "Full plan", requested: "Requested", free: "Free" };
export const waLink = (phone: string | null, text = "") => {
  if (!phone) return "";
  const n = phone.replace(/[^\d]/g, ""); const full = n.length === 10 ? `91${n}` : n;
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};
