"use client";
import { useMemo, useState } from "react";
import { Check } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { PRIVATE_MINUTES, PRIVATE_PRICE, dayKey, fmtDate, fmtTime, isPast, type SessionView } from "@/lib/live";
import { Card, Eyebrow, PageTitle } from "@/components/learn/ui";
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
  if (!user) return null;

  async function cancel(s: SessionView) {
    const r = await fetch(`/api/sessions/${s.id}/book`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user!.id }) });
    const d = (await r.json().catch(() => ({}))) as { error?: string };
    setMsg(r.ok ? "Your booking was cancelled." : d.error ?? "Could not cancel."); reload();
  }

  return (
    <>
      <PageTitle title="Private Sessions" text="Book a 1-to-1 online session with a trainer. Practise speaking, fix your mistakes, or prepare for an interview." />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[["₹" + PRIVATE_PRICE, "per session"], [PRIVATE_MINUTES + " min", "one-to-one, on Google Meet"], ["Any student", "you do not need to be enrolled"]].map(([v, l]) => <Card key={l} className="!p-5"><div className="font-display text-3xl font-semibold text-brand-900">{v}</div><div className="mt-1 text-sm text-muted">{l}</div></Card>)}
      </div>
      {msg && <div role="status" className="mb-6 flex items-center gap-2 nx-card p-4 text-sm font-medium text-brand-900"><Check className="h-4 w-4 text-ok" />{msg}</div>}

      {mine.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-lg font-semibold text-brand-900">Your bookings</h2>
          <div className="space-y-3">{mine.map((s) => <SessionCard key={s.id} s={s} now={now} enrolled={user.enrolled} onEnrol={() => {}} action={<button onClick={() => cancel(s)} className="text-xs font-semibold text-muted hover:text-live">Cancel booking</button>} />)}</div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-brand-900">Available slots</h2>
        {!loaded ? <div className="h-32 animate-pulse rounded-xl bg-brand-100" /> : days.length === 0 ? <Card className="text-center text-sm text-muted">No open slots right now. Your trainers add new slots regularly. Check back soon.</Card> : (
          <div className="space-y-6">
            {days.map(([k, list]) => (
              <div key={k}>
                <Eyebrow className="mb-2">{k === dayKey(now.toISOString()) ? "Today" : fmtDate(list[0].start, { weekday: "long", day: "numeric", month: "long" })}</Eyebrow>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <button key={s.id} onClick={() => { setMsg(""); setBooking(s); }} className="flex items-center gap-3 nx-card p-4 text-left transition-colors hover:border-accent-600 hover:bg-brand-50">
                      <Avatar name={s.trainer} size={36} />
                      <span className="min-w-0 flex-1"><span className="block font-display font-semibold text-brand-900">{fmtTime(s.start)}</span><span className="block truncate text-sm text-muted">{s.trainer}</span></span>
                      <span className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-semibold text-white">Book ₹{s.price ?? PRIVATE_PRICE}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {booking && <BookDialog session={booking} user={user} onClose={() => setBooking(null)} onDone={() => { setMsg("Booked. Your trainer's Google Meet link now appears under Your bookings."); reload(); }} />}
    </>
  );
}
