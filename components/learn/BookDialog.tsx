"use client";
import { X } from "@/components/learn/icons";
import { useState } from "react";
import { PRIVATE_PRICE, fmtDate, fmtTime, type SessionView } from "@/lib/live";
import { Avatar } from "./live";

/** DEMO payment for a private session. Replace the confirm handler with Razorpay Checkout before launch. */
export function BookDialog({ session, user, onClose, onDone }: { session: SessionView; user: { id: string; name: string; email: string }; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function confirm() {
    setBusy(true); setErr("");
    const r = await fetch(`/api/sessions/${session.id}/book`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, name: user.name, email: user.email }) });
    const d = (await r.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!r.ok) { setErr(d.error ?? "Could not book this slot."); return; }
    onDone(); onClose();
  }
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/35 backdrop-blur-[2px] p-4" role="dialog" aria-modal="true" aria-label="Book private session">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between"><h2 className="font-display text-xl font-semibold text-brand-900">Book a private session</h2><button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted hover:bg-brand-50"><X className="h-5 w-5" /></button></div>
        <div className="mt-4 rounded-xl border border-line p-4">
          <div className="flex items-center gap-3"><Avatar name={session.trainer} size={36} /><div><div className="font-semibold text-brand-900">{session.trainer}</div><div className="text-sm text-muted">1-to-1 · {session.minutes} minutes · online</div></div></div>
          <div className="mt-3 font-display text-lg font-semibold text-brand-900">{fmtDate(session.start, { weekday: "long", day: "numeric", month: "long" })}</div>
          <div className="text-muted">{fmtTime(session.start)} India time</div>
        </div>
        <div className="mt-4 flex items-end justify-between"><span className="text-sm text-muted">Total</span><span className="font-display text-3xl font-semibold text-brand-900">₹{session.price ?? PRIVATE_PRICE}</span></div>
        {err && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{err}</p>}
        <button onClick={confirm} disabled={busy} className="mt-4 w-full rounded-lg bg-accent-600 py-3 font-semibold text-white hover:bg-accent-700 disabled:opacity-60">{busy ? "Booking…" : "Confirm booking (demo)"}</button>
        <p className="mt-3 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-muted">Demo mode: no money is charged. The Razorpay payment step will be connected here before launch. Your trainer shares the Google Meet link on this page after booking.</p>
      </div>
    </div>
  );
}
