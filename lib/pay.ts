"use client";
/**
 * Online payment in the browser: ask our server for a Razorpay order, open Razorpay Checkout
 * (UPI, cards, net banking, wallets), then let the server confirm the signed result.
 * Nothing here can mark a payment as paid; only the database can, after checking Razorpay's signature.
 */
import { useEffect, useState } from "react";

type Rzp = { open: () => void; on: (ev: string, cb: (r: { error?: { description?: string } }) => void) => void };
type RzpCtor = new (o: Record<string, unknown>) => Rzp;
declare global { interface Window { Razorpay?: RzpCtor } }

let enabled: Promise<boolean> | null = null;
export const paymentsEnabled = () => (enabled ??= fetch("/api/pay/config", { cache: "no-store" }).then((r) => r.json()).then((d: { enabled?: boolean }) => !!d.enabled).catch(() => false));

/** null while checking, then true/false. */
export function usePaymentsEnabled() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => { let alive = true; paymentsEnabled().then((v) => alive && setOn(v)); return () => { alive = false; }; }, []);
  return on;
}

function loadCheckout(): Promise<RzpCtor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.async = true;
    s.onload = () => (window.Razorpay ? res(window.Razorpay) : rej(new Error("Payment window did not load.")));
    s.onerror = () => rej(new Error("Could not reach the payment service. Check your internet and try again."));
    document.head.appendChild(s);
  });
}

export type PayResult = { status: "paid" | "cancelled" | "failed"; message?: string };

export async function pay(purpose: "enrol" | "session" | "week", opts: { sessionId?: string; mumbai?: boolean; week?: number } = {}): Promise<PayResult> {
  const r = await fetch("/api/pay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ purpose, ...opts }) });
  const o = (await r.json().catch(() => ({}))) as { error?: string; keyId: string; orderId: string; amount: number; currency: string; name: string; description: string; prefill: Record<string, string> };
  if (!r.ok) return { status: "failed", message: o.error ?? "Could not start the payment." };
  let Razorpay: RzpCtor;
  try { Razorpay = await loadCheckout(); } catch (e) { return { status: "failed", message: (e as Error).message }; }

  return new Promise<PayResult>((resolve) => {
    let settled = false;
    const done = (x: PayResult) => { if (!settled) { settled = true; resolve(x); } };
    const rzp = new Razorpay({
      key: o.keyId, order_id: o.orderId, amount: o.amount, currency: o.currency, name: o.name, description: o.description, prefill: o.prefill,
      theme: { color: "#1f7249" },
      modal: { ondismiss: () => done({ status: "cancelled" }) },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const v = await fetch("/api/pay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature }) });
        const d = (await v.json().catch(() => ({}))) as { error?: string };
        done(v.ok ? { status: "paid" } : { status: "failed", message: d.error ?? "We could not confirm the payment. If money left your account, contact us." });
      },
    });
    rzp.on("payment.failed", (e) => done({ status: "failed", message: e.error?.description ?? "The payment did not go through. You were not charged." }));
    rzp.open();
  });
}
