"use client";
import { useEffect, useState } from "react";
import { PRIVATE_PRICE, fmtDate, fmtTime, type SessionView } from "@/lib/live";
import { useNow } from "@/lib/use-live";
import { api } from "@/components/trainer/api";

export default function Bookings() {
  const [list, setList] = useState<SessionView[] | null>(null);
  const now = +useNow(60000);
  useEffect(() => { api<{ sessions: SessionView[] }>("/api/sessions").then((r) => setList(r.ok ? r.data.sessions.filter((s) => s.kind === "private") : [])); }, []);
  if (!list) return <div className="h-40 animate-pulse rounded-xl bg-brand-100" />;
  const booked = list.filter((s) => s.booked && +new Date(s.start) > now - 3600000);
  const open = list.filter((s) => !s.booked && +new Date(s.start) > now);
  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-semibold text-brand-900">Private bookings</h1>
      <p className="mb-6 text-muted">Students pay ₹{PRIVATE_PRICE} per 30-minute session. {open.length} open slots remain.</p>
      {booked.length === 0 ? <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No upcoming private bookings yet.</p> : (
        <div className="overflow-x-auto nx-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr className="border-b border-line bg-brand-50 text-xs uppercase tracking-wider text-muted">{["When", "Student", "Email", "Trainer", "Meet link"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {booked.map((s) => <tr key={s.id}><td className="px-4 py-3 font-semibold text-brand-900">{fmtDate(s.start)} · {fmtTime(s.start)}</td><td className="px-4 py-3">{s.booked!.name}</td><td className="px-4 py-3 text-muted">{s.booked!.email}</td><td className="px-4 py-3">{s.trainer}</td><td className="max-w-[220px] truncate px-4 py-3 text-muted">{s.link || "Add a link on the Schedule page"}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
