"use client";
import { useMemo, useState } from "react";
import { Lock, Video } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { KIND_LABEL, countdown, dayKey, fmtDate, fmtTime, isLive, isPast } from "@/lib/live";
import { Card, PageTitle } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { Calendar, EmptyDay, LiveBadge, SessionCard, liveNow } from "@/components/learn/live";
import { useLive } from "@/components/learn/LiveProvider";

export default function LivePage() {
  const { user } = useAuth();
  const { sessions, loaded, error, now } = useLive();
  const [dialog, setDialog] = useState(false);
  const today = dayKey(now.toISOString());
  const [selected, setSelected] = useState(today);
  const mineOrGroup = useMemo(() => sessions.filter((s) => s.kind !== "private" || s.mine), [sessions]);
  const day = mineOrGroup.filter((s) => dayKey(s.start) === selected);
  const upcoming = mineOrGroup.filter((s) => !isPast(s, now) && dayKey(s.start) !== selected).slice(0, 3);
  if (!user) return null;
  const live = liveNow(sessions, now);
  const next = mineOrGroup.filter((s) => !isPast(s, now) && !isLive(s, now)).sort((a, b) => +new Date(a.start) - +new Date(b.start))[0];

  return (
    <>
      <PageTitle title="Live Classes" text="Classes run every day on Google Meet. Your trainers set the schedule and share the join link here. All times are India time." />
      {next && live.length === 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-5 rounded-[var(--radius-xl)] p-5 text-white shadow-[var(--shadow-card)] sm:p-6" style={{ background: "linear-gradient(120deg, #4547cc 0%, #6366f1 55%, #8b5cf6 100%)" }}>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15"><Video className="h-7 w-7" /></span>
          <div className="min-w-[200px] flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">Next class · {KIND_LABEL[next.kind]}</div>
            <div className="mt-1 text-xl font-semibold">{next.title}</div>
            <div className="mt-0.5 text-sm text-white/85">with {next.trainer} · {fmtDate(next.start)}, {fmtTime(next.start)} · {next.minutes} min</div>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-2 text-center"><div className="text-[11px] font-semibold uppercase tracking-wide text-white/75">Starts</div><div className="text-base font-semibold">{countdown(next, now).replace(/^Starts /, "")}</div></div>
        </div>
      )}
      {live.length > 0 && (
        <div className="mb-6 rounded-xl border border-live/30 bg-red-50 p-4"><div className="flex flex-wrap items-center gap-3"><LiveBadge /><span className="font-display font-semibold text-brand-900">{live[0].title}</span><span className="text-sm text-muted">with {live[0].trainer} is on right now</span></div></div>
      )}
      {!user.enrolled && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 nx-card p-4 text-sm">
          <span className="flex items-center gap-2 text-brand-900"><Lock className="h-4 w-4" />Enrol to get the Google Meet link for every live class.</span>
          <button onClick={() => setDialog(true)} className="rounded-lg bg-accent-600 px-5 py-2 font-semibold text-white hover:bg-accent-700">Enrol now</button>
        </div>
      )}
      {error && !loaded && <Card className="mb-6 text-sm text-muted">The class schedule could not be loaded. Check your connection and refresh.</Card>}
      <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
        <Calendar sessions={sessions} now={now} selected={selected} onSelect={setSelected} />
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-brand-900">{selected === today ? "Today" : fmtDate(selected + "T12:00:00+05:30", { weekday: "long", day: "numeric", month: "long" })}</h2>
          <div className="space-y-3">{day.length ? day.map((s) => <SessionCard key={s.id} s={s} now={now} enrolled={user.enrolled} onEnrol={() => setDialog(true)} />) : <EmptyDay />}</div>
          {upcoming.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 font-display text-lg font-semibold text-brand-900">Coming up</h2>
              <div className="space-y-3">{upcoming.map((s) => <SessionCard key={s.id} s={s} now={now} enrolled={user.enrolled} onEnrol={() => setDialog(true)} compact />)}</div>
            </>
          )}
        </div>
      </div>
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </>
  );
}
