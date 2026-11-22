import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { createOrder, orderProof, razorpayKeyId, razorpayReady } from "@/lib/server/razorpay";

const MSG: Record<string, [number, string]> = {
  "payments-off": [503, "Online payment is not switched on yet. Please use Request enrolment."],
  "already-enrolled": [409, "Your full plan is already active."],
  "already-unlocked": [409, "You already unlocked this week."],
  "bad-week": [400, "Unknown week."],
  "slot-missing": [404, "That slot no longer exists."],
  "slot-taken": [409, "Someone just booked that slot. Please choose another."],
  "slot-past": [409, "That slot has already started."],
};

/** Start a payment: the database decides the price, then we create the Razorpay order for exactly that amount. */
export async function POST(req: Request) {
  const g = await requireUser(); if (g.error) return g.error;
  if (!razorpayReady()) return NextResponse.json({ error: MSG["payments-off"][1] }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { purpose?: string; sessionId?: string; mumbai?: boolean; week?: number };
  if (body.purpose !== "enrol" && body.purpose !== "session" && body.purpose !== "week") return NextResponse.json({ error: "Unknown payment." }, { status: 400 });

  const { data, error } = await g.sb.rpc("begin_payment", { p_purpose: body.purpose, p_session_id: body.sessionId ?? null, p_mumbai: false, p_week: body.purpose === "week" ? Number(body.week) || null : null });
  if (error) { const m = MSG[error.message] ?? [500, "Could not start the payment."]; return NextResponse.json({ error: m[1] }, { status: m[0] }); }
  const row = (data as { payment_id: string; amount: number; description: string }[])[0];

  let orderId: string;
  try { orderId = await createOrder(row.amount, row.payment_id, { purpose: body.purpose, user: g.me.id, payment: row.payment_id }); }
  catch (e) { console.error("Razorpay order failed:", (e as Error).message); return NextResponse.json({ error: "The payment service is not responding. Please try again." }, { status: 502 }); }

  const a = await g.sb.rpc("attach_order", { p_payment_id: row.payment_id, p_order_id: orderId, p_proof: orderProof(row.payment_id, orderId) });
  if (a.data !== "ok") return NextResponse.json({ error: "Could not start the payment." }, { status: 500 });

  return NextResponse.json({
    keyId: razorpayKeyId(), orderId, amount: row.amount * 100, currency: "INR", name: "SpeakUp", description: row.description,
    prefill: { name: g.me.name, email: g.me.email },
  });
}
