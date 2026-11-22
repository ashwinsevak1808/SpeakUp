"use client";
/** Private 1-to-1 sessions, in the dashboard layout: page head · bookings + slot grid · details aside. */
import { useMemo, useState } from "react";
import { Check, UserRound } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { PRIVATE_MINUTES, PRIVATE_PRICE, dayKey, fmtDate, fmtTime, isPast, type SessionView } from "@/lib/live";
import { Card, EmptyState, PageTitle, btn } from "@/components/learn/ui";
import { Avatar, SessionCard } from "@/components/learn/live";
import { BookDialog } from "@/components/learn/BookDialog";
import { useLive } from "@/components/learn/LiveProvider";

export default function PrivatePage() {
  const { user } = useAuth();
  const { sessions, loaded, now, reload } = useLive();
  const [booking, setBooking] = useState<SessionView | null>(null);
  const [msg, setMsg] = useState("");
  const slots = useMemo(() => sessions.filter((s) => s.kind === "private" && !s.taken && +new Date(s.start) > +now), [sessions, now]);
  const mine = sessions.filter((s) => s.kind === "private" && s.mine && !isPast(s, now));
  const days = useMemo(() => { const m = new Map<string, SessionView[]>(); for (const s of slots) { const k = dayKey(s.start); m.set(k, [...(m.get(k) ?? []), s]); } return [...m.entries()].slice(0, 7); }, [slots]);
  const trainers = useMemo(() => Array.from(new Set(slots.map((s) => s.trainer))), [slots]);
  if (!user) return null;

  async function cancel(s: SessionView) {
    const r = await fetch(`/api/sessions/${s.id}/book`, { method: "DELETE" });
    const d = (await r.json().catch(() => ({}))) as { error?: string };
    setMsg(r.ok ? "Your booking was cancelled." : d.error ?? "Could not cancel."); reload();
  }

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`₹${PRIVATE_PRICE} · ${PRIVATE_MINUTES} minutes · Google Meet`} title="Private sessions" text="Book a one-to-one online session with a trainer. Practise speaking, fix your mistakes, or prepare for an interview." />
      {msg && <div role="status" className="nx-card ty-body ty-500 ty-ink flex items-center gap-2 p-4"><Check className="h-4 w-4 text-[var(--accent)]" />{msg}</div>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          {mine.length > 0 && (
            <section>
              <h2 className="ty-head ty-ink mb-3">Your bookings</h2>
              <div className="space-y-3">{mine.map((s) => <SessionCard key={s.id} s={s} now={now} enrolled={user.enrolled} onEnrol={() => {}} action={<button onClick={() => cancel(s)} className={btn("ghost", "sm")}>Cancel booking</button>} />)}</div>
            </section>
          )}

          <section className="nx-card overflow-hidden">
            <div className="flex items-baseline justify-between px-5 pt-5"><h2 className="ty-head ty-ink">Available slots</h2><span className="ty-note ty-subtle">{slots.length} open</span></div>
            {!loaded ? <div className="m-5 h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" /> : days.length === 0 ? (
              <EmptyState compact icon={UserRound} title="No open slots right now" text="Your trainers add new slots regularly. Check back soon." />
            ) : (
              <div className="mt-3">
                {days.map(([k, list]) => (
                  <div key={k} className="border-t border-[var(--border)] px-5 py-4">
                    <div className="ty-label ty-caps ty-subtle mb-2.5">{k === dayKey(now.toISOString()) ? "Today" : fmtDate(list[0].start, { weekday: "long", day: "numeric", month: "long" })}</div>
                    <div className="grid gap-2.5 sm:grid-cols-2 2xl:grid-cols-3">
                      {list.map((s) => (
                        <button key={s.id} onClick={() => { setMsg(""); setBooking(s); }} className="group flex items-center gap-3 rounded-[var(--radius-lg)] bg-white p-3 text-left shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-subtle)_45%,#fff)] hover:shadow-[inset_0_0_0_1px_var(--border-accent)]">
                          <Avatar name={s.trainer} size={32} />
                          <span className="min-w-0 flex-1"><span className="ty-mono block text-[14px] font-semibold text-[var(--text-primary)]">{fmtTime(s.start)}</span><span className="ty-note ty-muted block truncate">{s.trainer}</span></span>
                          <span className={btn("secondary", "sm", "group-hover:!text-[var(--accent-text)]")}>Book ₹{s.price ?? PRIVATE_PRICE}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside aria-label="About private sessions" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <Card>
            <div className="ty-subject ty-ink">What you get</div>
            <dl className="nx-facts mt-2">
              <div><dt>Price</dt><dd>₹{PRIVATE_PRICE} per session</dd></div>
              <div><dt>Length</dt><dd>{PRIVATE_MINUTES} minutes</dd></div>
              <div><dt>Where</dt><dd>Google Meet</dd></div>
              <div><dt>Who can book</dt><dd>Any student</dd></div>
              <div><dt>Cancel</dt><dd>Up to 2 hours before</dd></div>
            </dl>
          </Card>
          {trainers.length > 0 && (
            <Card>
              <div className="ty-subject ty-ink">Trainers with open slots</div>
              <ul className="mt-3 space-y-2.5">{trainers.map((t) => <li key={t} className="ty-body ty-ink flex items-center gap-2.5"><Avatar name={t} size={26} />{t}<span className="ty-note ty-mono ty-subtle ml-auto">{slots.filter((s) => s.trainer === t).length}</span></li>)}</ul>
            </Card>
          )}
          <Card>
            <div className="ty-subject ty-ink">Good uses for a session</div>
            <ul className="mt-2 space-y-1.5">{["Mock interview with feedback", "Fix the mistakes you repeat", "Practise a presentation", "Talk freely, with corrections"].map((t) => <li key={t} className="ty-body ty-secondary flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />{t}</li>)}</ul>
          </Card>
        </aside>
      </div>
      {booking && <BookDialog session={booking} user={user} onClose={() => setBooking(null)} onDone={() => { setMsg("Booked. Your trainer's Google Meet link now appears under Your bookings."); reload(); }} />}
    </div>
  );
}
