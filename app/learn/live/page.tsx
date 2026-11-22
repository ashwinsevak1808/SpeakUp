"use client";
/** Live classes, in the dashboard layout: page head · calendar + day agenda · next-class aside. */
import { useMemo, useState } from "react";
import { CalendarDays, Lock, Video } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { KIND_LABEL, countdown, dayKey, fmtDate, fmtTime, isLive, isPast } from "@/lib/live";
import { Button, Card, PageTitle, btn } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { Avatar, Calendar, EmptyDay, LiveBadge, SessionCard, liveNow } from "@/components/learn/live";
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
  const thisWeek = mineOrGroup.filter((s) => !isPast(s, now) && +new Date(s.start) < +now + 7 * 86400000).length;

  return (
    <div className="nx-page">
      <PageTitle eyebrow="All times are India time (IST)" title="Live classes" text="Classes run every day on Google Meet. Your trainers set the schedule and share the join link here.">
        {!user.enrolled && <Button onClick={() => setDialog(true)} icon={Lock}>Pay ₹3,000 to join classes</Button>}
      </PageTitle>

      {live.length > 0 && (
        <div className="nx-glass flex flex-wrap items-center gap-3 p-4">
          <LiveBadge /><span className="ty-subject ty-ink">{live[0].title}</span><span className="ty-body ty-muted">with {live[0].trainer} is on right now</span>
        </div>
      )}
      {error && !loaded && <Card className="ty-body ty-muted">The class schedule could not be loaded. Check your connection and refresh.</Card>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <aside aria-label="Class summary" className="flex min-w-0 flex-col gap-4 xl:order-2">
          <Calendar sessions={sessions} now={now} selected={selected} onSelect={setSelected} />
          {next && (
            <section className="nx-card p-5">
              <div className="flex items-center justify-between"><span className="ty-label ty-caps ty-subtle">Next class</span><span className="ty-label ty-caps ty-subtle">{KIND_LABEL[next.kind]}</span></div>
              <div className="ty-figure ty-ink mt-3">{fmtTime(next.start)}</div>
              <div className="ty-note ty-500 ty-accent mt-1">{countdown(next, now)}</div>
              <div className="ty-subject ty-ink mt-3">{next.title}</div>
              <div className="ty-note ty-muted mt-1 flex items-center gap-2"><Avatar name={next.trainer} size={20} />{next.trainer} · {fmtDate(next.start)} · {next.minutes} min</div>
            </section>
          )}
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">How live classes work</div>
            <dl className="nx-facts mt-2">
              <div><dt>Where</dt><dd>Google Meet</dd></div>
              <div><dt>How often</dt><dd>Every day</dd></div>
              <div><dt>Next 7 days</dt><dd>{thisWeek} sessions</dd></div>
              <div><dt>Your access</dt><dd>{user.enrolled ? "Join link shown" : "With the full plan"}</dd></div>
            </dl>
            <p className="ty-note ty-muted nx-dash-h mt-3 flex gap-2 pt-3"><Video className="mt-0.5 h-3.5 w-3.5 shrink-0" />Join 5 minutes early and keep your microphone on mute until you speak.</p>
          </section>
          {!user.enrolled && (
            <section className="nx-glass p-5">
              <CalendarDays className="h-5 w-5 text-[var(--accent)]" />
              <div className="ty-subject ty-ink mt-2">Get the Meet link for every class</div>
              <p className="ty-note ty-muted mt-1">With the full plan you see the join link here and can join any day.</p>
              <button onClick={() => setDialog(true)} className={btn("primary", "md", "mt-3 w-full")}>Pay ₹3,000</button>
            </section>
          )}
        </aside>
        <div className="min-w-0 xl:order-1">
          <div className="min-w-0">
            <div className="mb-3 flex items-baseline justify-between"><h2 className="ty-head ty-ink">{selected === today ? "Today" : fmtDate(selected + "T12:00:00+05:30", { weekday: "long", day: "numeric", month: "long" })}</h2><span className="ty-note ty-subtle">{day.length} {day.length === 1 ? "session" : "sessions"}</span></div>
            <div className="space-y-3">{day.length ? day.map((s) => <SessionCard key={s.id} s={s} now={now} enrolled={user.enrolled} onEnrol={() => setDialog(true)} />) : <EmptyDay />}</div>
            {upcoming.length > 0 && (
              <>
                <h2 className="ty-head ty-ink mb-3 mt-8">Coming up</h2>
                <div className="space-y-3">{upcoming.map((s) => <SessionCard key={s.id} s={s} now={now} enrolled={user.enrolled} onEnrol={() => setDialog(true)} compact />)}</div>
              </>
            )}
          </div>
        </div>

      </div>
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </div>
  );
}
