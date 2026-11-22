import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { alertTeam } from "@/lib/server/notify";
import { PLAN } from "@/lib/learn-data";

/** A student asks to enrol (pay offline). Saved as a request; the team approves it in Admin > Enrolments. */
export async function POST(req: Request) {
  const g = await requireUser(); if (g.error) return g.error;
  const b = (await req.json().catch(() => ({}))) as { mumbai?: boolean; note?: string };
  const note = typeof b.note === "string" ? b.note.trim().slice(0, 300) : "";
  const { data, error } = await g.sb.from("enrol_requests")
    .insert({ user_id: g.me.id, plan: PLAN.name, mumbai: !!b.mumbai, amount: PLAN.price, student_note: note || null })
    .select("id, plan, mumbai, created_at").single();
  if (error) return NextResponse.json({ error: /duplicate|unique/i.test(error.message) ? "You already have a request waiting. We will confirm it soon." : error.message }, { status: 409 });
  await alertTeam(`Enrolment request: ${g.me.name}`, [`${g.me.name} (${g.me.email}) wants to join the ${PLAN.name} (₹${PLAN.price}).`, note && `Note: ${note}`, "Collect the payment, then approve."], "/admin/enrolments");
  return NextResponse.json({ request: data });
}
