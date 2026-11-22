"use client";
import { X } from "@/components/learn/icons";
import { useState } from "react";
import { enrol } from "@/lib/auth";
import { PLAN } from "@/lib/learn-data";

/** DEMO payment step. Replace the button's handler with Razorpay Checkout before launch. */
export function EnrolDialog({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [mumbai, setMumbai] = useState(false);
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/35 backdrop-blur-[2px] p-4" role="dialog" aria-modal="true" aria-label="Enrol">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-900">{PLAN.name}</h2>
            <p className="text-sm text-muted">{PLAN.months} months · live classes · certificate</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted hover:bg-brand-50"><X className="h-5 w-5" /></button>
        </div>
        <ul className="my-5 space-y-2 text-sm text-ink">
          {PLAN.includes.map((i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />{i}</li>)}
        </ul>
        <label className="mb-5 flex cursor-pointer gap-3 rounded-lg border border-line p-3 text-sm">
          <input type="checkbox" checked={mumbai} onChange={(e) => setMumbai(e.target.checked)} className="mt-1 h-4 w-4 accent-accent-600" />
          <span><b className="text-brand-900">I live in Mumbai</b> and want to join in-person practice sessions too.<br /><span className="text-muted">{PLAN.mumbaiAddon}</span></span>
        </label>
        <div className="mb-4 flex items-end justify-between border-t border-line pt-4">
          <span className="text-sm text-muted">Total</span>
          <span className="font-display text-3xl font-semibold text-brand-900">₹{PLAN.price.toLocaleString("en-IN")}</span>
        </div>
        <button
          onClick={() => { enrol(userId, PLAN.name, mumbai); onClose(); }}
          className="w-full rounded-md bg-accent-600 py-3 font-semibold text-white transition-colors hover:bg-accent-700"
        >
          Confirm enrolment (demo)
        </button>
        <p className="mt-3 rounded-md bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
          Demo mode: no money is charged. The Razorpay payment step will be connected here before launch.
        </p>
      </div>
    </div>
  );
}
