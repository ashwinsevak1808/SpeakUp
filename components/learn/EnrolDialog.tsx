"use client";
import { useState } from "react";
import { Check, ShieldCheck, X } from "@/components/learn/icons";
import { refreshMe, useAuth } from "@/lib/auth";
import { PLAN } from "@/lib/learn-data";
import { WA_LINK } from "@/lib/data";
import { WEEK_PRICE } from "@/lib/access";
import { fmtDate } from "@/lib/live";
import { pay, usePaymentsEnabled } from "@/lib/pay";
import { cn } from "@/lib/utils";

/**
 * Buy access. Pressing a Pay button opens Razorpay straight away (UPI, cards, net banking).
 * With `week`, the student can also unlock just that week for ₹1,000 instead of the full plan.
 */
export function EnrolDialog({ onClose, week }: { userId?: string; onClose: () => void; week?: number }) {
  const { user } = useAuth();
  const online = usePaymentsEnabled();
  const [busy, setBusy] = useState<"" | "plan" | "week">("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState<"" | "plan" | "week">("");
  const price = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  async function buy(kind: "plan" | "week") {
    setBusy(kind); setErr("");
    const r = await pay(kind === "plan" ? "enrol" : "week", kind === "week" ? { week } : {});
    if (r.status === "paid") { await refreshMe(); setDone(kind); }
    else if (r.status === "failed") setErr(r.message ?? "The payment did not go through. You were not charged.");
    setBusy("");
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[rgba(19,26,22,.35)] p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Enrol">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-900">{week && !done ? `Week ${week} is locked` : PLAN.name}</h2>
            <p className="text-sm text-muted">{week && !done ? "Unlock just this week, or get everything." : `${PLAN.months} months · live classes · every chapter · certificate`}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted hover:bg-brand-50"><X className="h-5 w-5" /></button>
        </div>

        {done || (user?.enrolled && !week) ? (
          <div role="status" className="mt-5 space-y-4">
            <p className="flex items-center gap-2 rounded-lg bg-[var(--accent-subtle)] p-4 text-sm font-semibold text-[var(--accent-text)]">
              <Check className="h-4 w-4" />{done === "week" ? `Week ${week} is unlocked. Enjoy!` : `You are enrolled${user?.planUntil ? ` until ${fmtDate(user.planUntil, { day: "numeric", month: "long", year: "numeric" })}` : ""}. Everything is unlocked.`}
            </p>
            <button onClick={onClose} className="btn-base btn-primary btn-lg w-full">Continue learning</button>
          </div>
        ) : online === false ? (
          <div className="mt-5 space-y-4">
            <p className="rounded-lg bg-brand-50 p-4 text-sm text-brand-800">Online payment is not available right now. Message us and we will help you join.</p>
            <a href={WA_LINK(`Hi! I want to join the ${PLAN.name} on SpeakUp (${user?.email ?? ""}).`)} target="_blank" rel="noopener" className="btn-base btn-primary btn-lg w-full">Message us on WhatsApp</a>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {week && (
              <div className="rounded-xl p-4 shadow-[inset_0_0_0_1px_var(--border)]">
                <div className="flex items-baseline justify-between gap-3"><span className="font-semibold text-brand-900">Just Week {week}</span><span className="font-display text-2xl font-semibold text-brand-900">{price(WEEK_PRICE)}</span></div>
                <p className="mt-1 text-sm text-muted">All lessons and the checkpoint of this week, yours to keep.</p>
                <button onClick={() => buy("week")} disabled={!!busy || online === null} className={cn("btn-base btn-secondary btn-lg mt-3 w-full")}>{busy === "week" ? "Opening secure payment…" : `Pay ${price(WEEK_PRICE)}`}</button>
              </div>
            )}
            <div className="rounded-xl p-4 shadow-[inset_0_0_0_1.5px_var(--accent)]">
              <div className="flex items-baseline justify-between gap-3"><span className="font-semibold text-brand-900">Full plan · {PLAN.months} months</span><span className="font-display text-2xl font-semibold text-brand-900">{price(PLAN.price)}</span></div>
              <ul className="mt-2 space-y-1.5 text-sm text-ink">
                {["Live online classes with our trainers", "Every chapter, test and grammar lesson", "Certificate of Completion when you finish"].map((i) => <li key={i} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />{i}</li>)}
              </ul>
              <button onClick={() => buy("plan")} disabled={!!busy || online === null} className="mt-3 w-full rounded-md bg-accent-600 py-3 font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-60">{busy === "plan" ? "Opening secure payment…" : `Pay ${price(PLAN.price)}`}</button>
            </div>
            <p className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" /><span>Secure payment by Razorpay: UPI, cards, net banking and wallets. Access unlocks the moment the payment succeeds. By paying you agree to our <a href="/terms" target="_blank" className="underline underline-offset-2">Terms</a> and <a href="/refund-policy" target="_blank" className="underline underline-offset-2">Refund Policy</a>.</span></p>
          </div>
        )}
        {err && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{err}</p>}
      </div>
    </div>
  );
}
