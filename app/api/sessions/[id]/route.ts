import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { validateSession, type SessionInput } from "@/lib/server/sessions";
import { istToIso } from "@/lib/live";

type Ctx = { params: Promise<{ id: string }> };

/** Staff: edit a session (title, time, link, notes, price, "live now" switch). */
export async function PUT(req: Request, { params }: Ctx) {
  const g = await requireUser(true); if (g.error) return g.error;
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as SessionInput;
  const errs = validateSession({ title: "x", trainer: "x", ...body }, false);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 422 });

  const next: Record<string, unknown> = {};
  for (const k of ["title", "trainer", "venue", "notes", "minutes", "price"] as const) if (body[k] !== undefined) next[k] = typeof body[k] === "string" ? (body[k] as string).trim() || (k === "title" || k === "trainer" ? undefined : null) : body[k];
  if (body.date && body.time) next.start_at = istToIso(body.date, body.time);
  if ("live" in body) next.live = body.live ?? null; // true = LIVE now, false = ended, null = follow the clock
  for (const k of Object.keys(next)) if (next[k] === undefined) delete next[k];

  if (Object.keys(next).length) {
    const { data, error } = await g.sb.from("sessions").update(next).eq("id", id).select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data.length) return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (body.link !== undefined) {
    const { error } = await g.sb.from("session_links").upsert({ session_id: id, link: body.link.trim() });
    if (error) return NextResponse.json({ error: error.message }, { status: error.code === "23503" ? 404 : 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = await requireUser(true); if (g.error) return g.error;
  const { id } = await params;
  const { data, error } = await g.sb.from("sessions").delete().eq("id", id).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return data.length ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
}
