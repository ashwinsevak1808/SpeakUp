"use client";
import { X } from "@/components/learn/icons";
import { useState } from "react";
import { PRIVATE_PRICE, fmtDate, fmtTime, type SessionView } from "@/lib/live";
import { pay, usePaymentsEnabled } from "@/lib/pay";
import { Avatar } from "./live";

/** Book a private session. With online payment on, the student pays and the slot is booked when the payment is confirmed. */
export function BookDialog({ session, onClose, onDone }: { session: SessionView; user?: { id: string; name: string; email: string }; onClose: () => void; onDone: () => void }) {
  const online = usePaymentsEnabled();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const price = session.price ?? PRIVATE_PRICE;
  const paid = online === true && price > 0;

  async function confirm() {
    setBusy(true); setErr("");
    if (paid) {
      const r = await pay("session", { sessionId: session.id });
      setBusy(false);
      if (r.status === "paid") { onDone(); onClose(); } else if (r.status === "failed") { setErr(r.message ?? "The payment did not go through."); onDone(); }
      return;
    }
    const r = await fetch(`/api/sessions/${session.id}/book`, { method: "POST" });
    const d = (await r.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!r.ok) { setErr(d.error ?? "Could not book this slot."); return; }
    onDone(); onClose();
  }
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(19,26,22,.35)] backdrop-blur-[2px] p-4" role="dialog" aria-modal="true" aria-label="Book private session">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between"><h2 className="font-display text-xl font-semibold text-brand-900">Book a private session</h2><button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted hover:bg-brand-50"><X className="h-5 w-5" /></button></div>
        <div className="mt-4 rounded-xl border border-line p-4">
          <div className="flex items-center gap-3"><Avatar name={session.trainer} size={36} /><div><div className="font-semibold text-brand-900">{session.trainer}</div><div className="text-sm text-muted">1-to-1 · {session.minutes} minutes · online</div></div></div>
          <div className="mt-3 font-display text-lg font-semibold text-brand-900">{fmtDate(session.start, { weekday: "long", day: "numeric", month: "long" })}</div>
          <div className="text-muted">{fmtTime(session.start)} India time</div>
        </div>
        <div className="mt-4 flex items-end justify-between"><span className="text-sm text-muted">Total</span><span className="font-display text-3xl font-semibold text-brand-900">₹{price}</span></div>
        {err && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{err}</p>}
        <button onClick={confirm} disabled={busy || online === null} className="mt-4 w-full rounded-lg bg-accent-600 py-3 font-semibold text-white hover:bg-accent-700 disabled:opacity-60">{busy ? (paid ? "Opening secure payment…" : "Booking…") : paid ? `Pay ₹${price} and book` : "Confirm booking"}</button>
        <p className="mt-3 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-muted">
          {paid ? "Pay by UPI, card or net banking through Razorpay. The slot is yours as soon as the payment succeeds, and the Google Meet link appears on this page." : "Your trainer confirms the payment with you directly (UPI). The Google Meet link appears on this page as soon as you book."}
        </p>
      </div>
    </div>
  );
}
