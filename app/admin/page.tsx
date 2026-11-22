"use client";
/** Admin dashboard: today at a glance. KPIs, what needs action, today's classes, who is active. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Grad, ShieldCheck, Users, Video, Zap } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { KIND_LABEL, dayKey, fmtTime, isLive, type SessionView } from "@/lib/live";
import { useNow } from "@/lib/use-live";
import { LiveBadge } from "@/components/learn/live";
import { EmptyState, Meter, PageTitle, Panel, StatCard, btn } from "@/components/learn/ui";
import { api } from "@/components/admin/api";
import { Person, ReqActions, StatusBadge } from "@/components/admin/bits";
import { ago, daysSince, fmtDay, useAdmin, waLink } from "@/components/admin/data";

const greet = (h: number) => (h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");

export default function AdminHome() {
  const { user } = useAuth();
  const { students, requests, newLeads, loaded, error, reload } = useAdmin();
  const now = useNow(30000);
  const [sessions, setSessions] = useState<SessionView[] | null>(null);
  useEffect(() => { api<{ sessions: SessionView[] }>("/api/sessions").then((r) => setSessions(r.ok ? r.data.sessions : [])); }, []);

  const t = +now;
  const pending = requests.filter((r) => r.status === "pending");
  const enrolled = students.filter((s) => s.enrolled);
  const active7 = students.filter((s) => daysSince(s.lastActive, t) <= 7);
  const new7 = students.filter((s) => daysSince(s.createdAt, t) <= 7);
  const signups = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = dayKey(new Date(t - (13 - i) * 86400000).toISOString()); return students.filter((s) => dayKey(s.createdAt) === d).length; }), [students, t]);
  const quiet = enrolled.filter((s) => daysSince(s.lastActive, t) > 7 && daysSince(s.enrolledAt ?? s.createdAt, t) > 7).sort((a, b) => daysSince(b.lastActive, t) - daysSince(a.lastActive, t));
  const recent = [...students].filter((s) => s.lastActive).sort((a, b) => (b.lastActive! > a.lastActive! ? 1 : -1)).slice(0, 6);
  const today = (sessions ?? []).filter((s) => dayKey(s.start) === dayKey(now.toISOString())).sort((a, b) => (a.start > b.start ? 1 : -1));
  const avg = students.length ? Math.round(students.reduce((n, s) => n + s.pct, 0) / students.length) : 0;
  const first = user?.name.split(" ")[0] ?? "";

  return (
    <div className="nx-page">
      <PageTitle eyebrow={now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })} title={`${greet(+now.toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }))}, ${first}`} text="Your students, enrolments and classes at a glance.">
        <Link href="/admin/classes" className={btn("secondary", "md")}><CalendarDays className="h-4 w-4" />Schedule a class</Link>
        <Link href="/admin/students" className={btn("primary", "md")}><Grad className="h-4 w-4" />All students</Link>
      </PageTitle>
      {error && <p role="alert" className="nx-card mb-6 p-4 text-sm text-[var(--danger)]">Could not load everything: {error}</p>}

      <section aria-label="Key numbers" className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Students" icon={Grad} value={loaded ? students.length : "–"} trend={signups} delta={{ label: `+${new7.length} this week`, good: new7.length > 0 }} href="/admin/students" />
        <StatCard label="Enrolled" icon={ShieldCheck} value={enrolled.length} of={String(students.length)} meter={{ pct: students.length ? (enrolled.length / students.length) * 100 : 0, label: `${students.length ? Math.round((enrolled.length / students.length) * 100) : 0}% paid` }} href="/admin/students?f=enrolled" />
        <StatCard label="Active this week" icon={Users} value={active7.length} of={String(students.length)} meter={{ pct: students.length ? (active7.length / students.length) * 100 : 0, label: "last 7 days" }} />
        <StatCard label="Waiting for you" icon={Zap} value={pending.length + newLeads} note={`${pending.length} enrolment ${pending.length === 1 ? "request" : "requests"} · ${newLeads} new ${newLeads === 1 ? "lead" : "leads"}`} href={pending.length ? "/admin/enrolments" : "/admin/leads"} />
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel title="Enrolment requests" desc="Approve once the payment has arrived. The student is unlocked straight away." action={<Link href="/admin/enrolments" className={btn("ghost", "sm")}>View all</Link>} bodyClass="!p-0">
            {pending.length === 0 ? <EmptyState compact icon={Check} title="All caught up" text="New requests from the Enrol button appear here." /> : (
              <ul>{pending.slice(0, 5).map((r) => {
                const s = students.find((x) => x.id === r.user_id);
                return (
                  <li key={r.id} className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
                    <div className="min-w-0 flex-1">{s ? <Person p={s} sub={`${ago(r.created_at, t)}${r.student_note ? ` · “${r.student_note}”` : ""}`} /> : <span className="ty-body ty-ink">{r.student?.name}</span>}</div>
                    <span className="ty-mono ty-body ty-ink">₹{(r.amount ?? 0).toLocaleString("en-IN")}</span>
                    <ReqActions req={r} onDone={reload} compact />
                  </li>
                );
              })}</ul>
            )}
          </Panel>

          <Panel title="Today's classes" desc={sessions ? `${today.length} scheduled` : "Loading…"} action={<Link href="/admin/classes" className={btn("ghost", "sm")}>Manage</Link>} bodyClass="!p-0">
            {sessions && today.length === 0 ? <EmptyState compact icon={Video} title="No classes today" text="Schedule one, or a whole series, from Classes." /> : (
              <ul>{today.map((s) => {
                const live = isLive(s, now); const noLink = s.kind !== "inperson" && !s.link;
                return (
                  <li key={s.id} className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
                    <div className="ty-mono w-20 shrink-0 text-[13px] font-semibold text-[var(--text-primary)]">{fmtTime(s.start)}</div>
                    <div className="min-w-0 flex-1"><div className="ty-body ty-500 ty-ink flex items-center gap-2 truncate">{live && <LiveBadge />}{s.title}</div><div className="ty-note ty-muted truncate">{KIND_LABEL[s.kind]} · {s.trainer}{s.kind === "private" ? s.booked ? ` · booked by ${s.booked.name}` : " · open slot" : ""}</div></div>
                    {noLink ? <Link href="/admin/classes" className="ty-label ty-600 rounded-full px-2.5 py-1 text-[var(--danger)] shadow-[inset_0_0_0_1px_currentColor]">Add Meet link</Link> : <span className="ty-label ty-subtle">{s.minutes} min</span>}
                  </li>
                );
              })}</ul>
            )}
          </Panel>

          <Panel title="Recently active" desc="Students who studied most recently" action={<Link href="/admin/students?sort=active" className={btn("ghost", "sm")}>View all</Link>} bodyClass="!p-0">
            {recent.length === 0 ? <EmptyState compact icon={Grad} title="No activity yet" text="When students start lessons, they show up here." /> : (
              <ul>{recent.map((s) => (
                <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-[var(--border)] px-5 py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_160px_90px]">
                  <Person p={s} sub={`Week ${s.week} · ${s.streak ? `${s.streak} day streak` : "no streak"}`} />
                  <div className="hidden items-center gap-2 sm:flex"><Meter pct={s.pct} className="!h-1.5" /><span className="ty-label ty-mono ty-subtle w-9 text-right">{s.pct}%</span></div>
                  <span className="ty-note ty-muted text-right">{ago(s.lastActive, t)}</span>
                </li>
              ))}</ul>
            )}
          </Panel>
        </div>

        <aside aria-label="Summary" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">This week</div>
            <dl className="nx-facts mt-2">
              <div><dt>New sign-ups</dt><dd>{new7.length}</dd></div>
              <div><dt>Studied this week</dt><dd>{active7.length}</dd></div>
              <div><dt>Average progress</dt><dd>{avg}%</dd></div>
              <div><dt>Full plan</dt><dd>{students.filter((s) => s.enrolled).length}</dd></div>
              <div><dt>New leads</dt><dd><Link href="/admin/leads" className="hover:text-[var(--accent-text)]">{newLeads}</Link></dd></div>
            </dl>
          </section>

          <section className="nx-card p-5">
            <div className="flex items-baseline justify-between"><div className="ty-subject ty-ink">Need a nudge</div><span className="ty-note ty-subtle">{quiet.length}</span></div>
            <p className="ty-note ty-muted mt-0.5">Enrolled, but no study for 7+ days.</p>
            {quiet.length === 0 ? <p className="ty-body ty-muted mt-3">Everyone enrolled is active.</p> : (
              <ul className="mt-3 space-y-3">{quiet.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1"><Person p={s} sub={`Last seen ${ago(s.lastActive, t).toLowerCase()}`} /></div>
                  {s.phone && <a href={waLink(s.phone, `Hi ${s.name.split(" ")[0]}! We missed you in class. Shall we continue your English practice today?`)} target="_blank" rel="noopener" className={btn("ghost", "sm")}>WhatsApp</a>}
                </li>
              ))}</ul>
            )}
          </section>

          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">Newest students</div>
            <ul className="mt-3 space-y-3">{students.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center gap-2"><div className="min-w-0 flex-1"><Person p={s} sub={`Joined ${fmtDay(s.createdAt)}`} /></div><StatusBadge status={s.status} /></li>
            ))}</ul>
            {loaded && students.length === 0 && <p className="ty-body ty-muted mt-1">No students yet. Share the sign-up link: /signup</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}
