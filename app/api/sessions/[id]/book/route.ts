import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { alertTeam } from "@/lib/server/notify";

type Ctx = { params: Promise<{ id: string }> };

/** Student books a private slot (the database locks the slot so it can only be booked once).
 *  Payment is not taken yet: connect Razorpay here before charging for sessions. */
export async function POST(_req: Request, { params }: Ctx) {
  const g = await requireUser(); if (g.error) return g.error;
  const { id } = await params;
  const { data, error } = await g.sb.rpc("book_session", { p_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, [number, string]> = { ok: [200, "Booked."], missing: [404, "Slot not found."], past: [409, "That slot has already started."], taken: [409, "Someone just booked that slot. Please choose another."], auth: [401, "Please log in."], pay: [402, "Please pay to book this slot."] };
  const [status, msg] = map[data as string] ?? [500, "Could not book."];
  if (status === 200) await alertTeam(`Private session booked by ${g.me.name}`, [`${g.me.name} (${g.me.email}) booked slot ${id}.`, "Collect the payment and check the Meet link."], "/admin/bookings");
  return NextResponse.json(status === 200 ? { ok: true } : { error: msg }, { status });
}

/** Student cancels their own booking (up to 2 hours before). Staff can cancel any booking. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await requireUser(); if (g.error) return g.error;
  const { id } = await params;
  const { data, error } = await g.sb.rpc("cancel_booking", { p_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (data === "ok") return NextResponse.json({ ok: true });
  return NextResponse.json({ error: data === "late" ? "You can cancel up to 2 hours before the session." : "Booking not found." }, { status: data === "late" ? 409 : 404 });
}
