import { NextResponse } from "next/server";
import { checkoutSignature, webhookValid } from "@/lib/server/razorpay";
import { publicSupabase } from "@/lib/supabase/server";

/**
 * Razorpay webhook (set it up in Razorpay Dashboard > Webhooks: URL https://YOUR-DOMAIN/api/pay/webhook,
 * events payment.captured and order.paid, and the same secret as RAZORPAY_WEBHOOK_SECRET).
 * This is the safety net: if the student closes the tab right after paying, the payment is still applied.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!webhookValid(raw, req.headers.get("x-razorpay-signature"))) return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  const ev = JSON.parse(raw) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } } };
  const p = ev.payload?.payment?.entity;
  if ((ev.event === "payment.captured" || ev.event === "order.paid") && p?.id && p.order_id) {
    const { data, error } = await publicSupabase().rpc("confirm_payment", { p_order_id: p.order_id, p_payment_id: p.id, p_signature: checkoutSignature(p.order_id, p.id) });
    if (error) { console.error("Webhook confirm failed:", error.message); return NextResponse.json({ error: "retry" }, { status: 500 }); }
    return NextResponse.json({ ok: true, result: data });
  }
  return NextResponse.json({ ok: true, ignored: ev.event });
}
