import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { SESSION_SELECT, expand, toView, validateSession, type SessionInput, type SessionRow } from "@/lib/server/sessions";
import { isStaffRole } from "@/lib/supabase/server";

/** Signed-in people: the schedule. The database hides links and bookings the caller may not see. */
export async function GET() {
  const g = await requireUser(); if (g.error) return g.error;
  const staff = isStaffRole(g.me.role);
  const since = new Date(Date.now() - (staff ? 30 * 86400000 : 36 * 3600000)).toISOString();
  const { data, error } = await g.sb.from("sessions").select(SESSION_SELECT).gte("start_at", since).order("start_at").limit(1000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: (data as SessionRow[]).map((r) => toView(r, g.me.id)) });
}

/** Staff: create one session, or a repeating series (daily / weekdays / weekly). */
export async function POST(req: Request) {
  const g = await requireUser(true); if (g.error) return g.error;
  const body = (await req.json().catch(() => ({}))) as SessionInput;
  const errs = validateSession(body, true);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 422 });
  const { rows, links } = expand(body, g.me.id);
  const a = await g.sb.from("sessions").insert(rows);
  if (a.error) return NextResponse.json({ error: a.error.message }, { status: 500 });
  if (links.length) { const b = await g.sb.from("session_links").insert(links); if (b.error) return NextResponse.json({ error: b.error.message }, { status: 500 }); }
  return NextResponse.json({ created: rows.length });
}
