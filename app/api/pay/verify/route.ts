import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { alertTeam } from "@/lib/server/notify";

/** After Razorpay Checkout succeeds: the database checks Razorpay's signature, then enrols or books. */
export async function POST(req: Request) {
  const g = await requireUser(); if (g.error) return g.error;
  const b = (await req.json().catch(() => ({}))) as { orderId?: string; paymentId?: string; signature?: string };
  if (!b.orderId || !b.paymentId || !b.signature) return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  const { data, error } = await g.sb.rpc("confirm_payment", { p_order_id: b.orderId, p_payment_id: b.paymentId, p_signature: b.signature });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (data === "ok" || data === "refund_needed") {
    const { data: p } = await g.sb.from("payments").select("purpose, amount").eq("order_id", b.orderId).single();
    await alertTeam(data === "ok" ? `Payment received: ₹${p?.amount} from ${g.me.name}` : `Refund needed: ${g.me.name} paid for a slot that was taken`,
      [`${g.me.name} (${g.me.email})`, p?.purpose === "enrol" ? "Enrolled in the course (unlocked automatically)." : "Private session.", `Payment id: ${b.paymentId}`], "/admin/payments");
  }
  const status = data === "ok" ? 200 : data === "refund_needed" ? 409 : 400;
  const msg: Record<string, string> = { ok: "Paid.", refund_needed: "Your payment arrived, but someone booked that slot first. We will refund you in full.", "bad-signature": "We could not confirm this payment. If money left your account, contact us and we will sort it out.", missing: "Payment not found." };
  return NextResponse.json(data === "ok" ? { ok: true } : { error: msg[data as string] ?? "Could not confirm the payment.", status: data }, { status });
}
