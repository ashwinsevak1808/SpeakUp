import { NextResponse } from "next/server";
import { mutateSessions } from "@/lib/server/sessions";

type Ctx = { params: Promise<{ id: string }> };

/** Student books a private slot. (Demo: payment is simulated in the browser; connect Razorpay before launch.) */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { userId, name, email } = (await req.json().catch(() => ({}))) as { userId?: string; name?: string; email?: string };
  if (!userId || !name || !email) return NextResponse.json({ error: "Missing student details." }, { status: 400 });
  const result = await mutateSessions((all) => {
    const s = all.find((x) => x.id === id);
    if (!s || s.kind !== "private") return "missing" as const;
    if (+new Date(s.start) < Date.now()) return "past" as const;
    if (s.booked) return "taken" as const;
    s.booked = { userId, name, email, at: new Date().toISOString() };
    return "ok" as const;
  });
  const map = { ok: [200, "Booked."], missing: [404, "Slot not found."], past: [409, "That slot has already started."], taken: [409, "Someone just booked that slot. Please choose another."] } as const;
  return NextResponse.json(result === "ok" ? { ok: true } : { error: map[result][1] }, { status: map[result][0] });
}

/** Student cancels their own booking (up to 2 hours before the start). */
export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { userId } = (await req.json().catch(() => ({}))) as { userId?: string };
  const result = await mutateSessions((all) => {
    const s = all.find((x) => x.id === id);
    if (!s || !s.booked || s.booked.userId !== userId) return "missing" as const;
    if (+new Date(s.start) - Date.now() < 2 * 3600000) return "late" as const;
    s.booked = null; return "ok" as const;
  });
  if (result === "ok") return NextResponse.json({ ok: true });
  return NextResponse.json({ error: result === "late" ? "You can cancel up to 2 hours before the session." : "Booking not found." }, { status: result === "late" ? 409 : 404 });
}
