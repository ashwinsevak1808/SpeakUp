"use client";
/** All students: filter, search, sort, open one, or export the list. */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Grad, Search } from "@/components/learn/icons";
import { EmptyState, Meter, PageTitle, Tabs, btn } from "@/components/learn/ui";
import { GOAL_LABEL } from "@/lib/course-core";
import { Person, StatusBadge, Td, Th, downloadCsv, input } from "@/components/admin/bits";
import { ago, daysSince, fmtDay, useAdmin, type Student } from "@/components/admin/data";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-live";
import { SelectMenu } from "@/components/ui/Dropdown";

type F = "all" | "enrolled" | "requested" | "free" | "quiet";
type S = "active" | "new" | "name" | "progress";
const SORTS: { id: S; label: string }[] = [{ id: "active", label: "Recently active" }, { id: "new", label: "Newest first" }, { id: "progress", label: "Most progress" }, { id: "name", label: "Name A to Z" }];

export default function StudentsPage() {
  return <Suspense fallback={<div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" />}><Students /></Suspense>;
}

function Students() {
  const { students, loaded } = useAdmin();
  const params = useSearchParams();
  const router = useRouter();
  const [f, setF] = useState<F>(((params.get("f") as F) || "all"));
  const [sort, setSort] = useState<S>(((params.get("sort") as S) || "active"));
  const [q, setQ] = useState("");
  const now = +useNow(60000);
  const test: Record<F, (s: Student) => boolean> = {
    all: () => true, enrolled: (s) => s.status === "enrolled", requested: (s) => s.status === "requested", free: (s) => s.status === "free",
    quiet: (s) => daysSince(s.lastActive, now) > 7,
  };
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = students.filter(test[f]).filter((s) => !t || s.name.toLowerCase().includes(t) || s.email.includes(t) || (s.phone ?? "").includes(t));
    const by: Record<S, (a: Student, b: Student) => number> = {
      active: (a, b) => (b.lastActive ?? "").localeCompare(a.lastActive ?? ""), new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      name: (a, b) => a.name.localeCompare(b.name), progress: (a, b) => b.pct - a.pct || b.xp - a.xp,
    };
    return [...list].sort(by[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, f, sort, q]);
  const count = (k: F) => students.filter(test[k]).length;

  const exportCsv = () => downloadCsv(`students-${new Date().toISOString().slice(0, 10)}.csv`, [
    ["Name", "Email", "Phone", "Status", "Plan", "Plan until", "Level", "Goal", "Progress %", "Lessons done", "Week", "Streak", "Points", "Last active", "Joined"],
    ...rows.map((s) => [s.name, s.email, s.phone, s.status, s.plan, s.planUntil ? fmtDay(s.planUntil) : "", s.level, GOAL_LABEL[s.goal], s.pct, `${s.done}/${s.total}`, s.week, s.streak, s.xp, s.lastActive ? fmtDay(s.lastActive) : "", fmtDay(s.createdAt)]),
  ]);

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`${students.length} students · ${count("enrolled")} enrolled`} title="Students" text="Everyone who has an account. Open a student to see their progress, bookings and notes, or to enrol them.">
        <button onClick={exportCsv} disabled={!rows.length} className={btn("secondary", "md")}>Export CSV</button>
      </PageTitle>

      <section className="nx-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 pt-3 lg:flex-row lg:items-end lg:justify-between">
          <Tabs label="Filter students" value={f} onChange={setF} tabs={[
            { id: "all", label: "All", count: count("all") }, { id: "enrolled", label: "Enrolled", count: count("enrolled") }, { id: "requested", label: "Requested", count: count("requested") },
            { id: "free", label: "Free preview", count: count("free") }, { id: "quiet", label: "Inactive 7+ days", count: count("quiet") },
          ]} />
          <div className="flex gap-2 pb-3">
            <label className="relative min-w-0 flex-1 lg:w-64"><span className="sr-only">Search students</span><Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-subtle)]" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone" className={cn(input, "pl-8")} /></label>
            <label><span className="sr-only">Sort</span><SelectMenu aria-label="Sort" block={false} value={sort} onChange={(e) => setSort(e.target.value as S)}>{SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</SelectMenu></label>
          </div>
        </div>

        {!loaded ? <div className="m-5 h-40 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" /> : rows.length === 0 ? (
          <EmptyState icon={Grad} title={students.length ? "No students match" : "No students yet"} text={students.length ? "Try another filter or search." : "Students appear here as soon as they create an account at /signup."} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-[13px]">
                <thead className="bg-[var(--surface-subtle)]"><tr><Th>Student</Th><Th>Status</Th><Th>Level</Th><Th className="w-[180px]">Progress</Th><Th>Streak</Th><Th>Last active</Th><Th>Joined</Th></tr></thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} onClick={() => router.push(`/admin/students/${s.id}`)} className="cursor-pointer border-t border-[var(--border)] hover:bg-[var(--surface-hover)]">
                      <Td className="max-w-[280px]"><Person p={s} /></Td>
                      <Td><StatusBadge status={s.status} /></Td>
                      <Td className="text-[var(--text-secondary)] capitalize">{s.level}</Td>
                      <Td><div className="flex items-center gap-2"><Meter pct={s.pct} className="!h-1.5" /><span className="ty-label ty-mono ty-subtle w-9 shrink-0 text-right">{s.pct}%</span></div><div className="ty-label ty-subtle mt-1">Week {s.week} · {s.done}/{s.total}</div></Td>
                      <Td className="ty-mono text-[var(--text-secondary)]">{s.streak ? `${s.streak}d` : "–"}</Td>
                      <Td className={cn("whitespace-nowrap", daysSince(s.lastActive, now) > 7 ? "text-[var(--text-subtle)]" : "text-[var(--text-secondary)]")}>{ago(s.lastActive, now)}</Td>
                      <Td className="whitespace-nowrap text-[var(--text-muted)]">{fmtDay(s.createdAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="md:hidden">
              {rows.map((s) => (
                <li key={s.id} className="border-t border-[var(--border)] px-4 py-3 first:border-t-0">
                  <div className="flex items-center gap-2"><div className="min-w-0 flex-1"><Person p={s} /></div><StatusBadge status={s.status} /></div>
                  <div className="mt-2 flex items-center gap-2"><Meter pct={s.pct} className="!h-1.5" /><span className="ty-label ty-mono ty-subtle shrink-0">{s.pct}% · {ago(s.lastActive, now)}</span></div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
