import { NextResponse } from "next/server";
import { isTrainer } from "@/lib/server/trainer-auth";
import { mutateSessions, validateSession, type SessionInput } from "@/lib/server/sessions";
import { istToIso, type Session } from "@/lib/live";

type Ctx = { params: Promise<{ id: string }> };

/** Trainer only: edit a session (title, time, link, notes, "live now" switch). */
export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isTrainer())) return NextResponse.json({ error: "Trainer sign-in required." }, { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as SessionInput;
  const errs = validateSession({ title: "x", trainer: "x", ...body }, false);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 422 });
  const found = await mutateSessions((all) => {
    const s = all.find((x) => x.id === id); if (!s) return false;
    const next: Partial<Session> = {};
    for (const k of ["title", "trainer", "link", "venue", "notes", "minutes", "price"] as const) if (body[k] !== undefined) (next as Record<string, unknown>)[k] = typeof body[k] === "string" ? (body[k] as string).trim() : body[k];
    if (body.date && body.time) next.start = istToIso(body.date, body.time);
    if ("live" in body) next.live = body.live === null ? undefined : body.live; // true = LIVE now, false = ended, null = follow the clock
    Object.assign(s, next);
    if (s.live === undefined) delete s.live;
    return true;
  });
  return found ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isTrainer())) return NextResponse.json({ error: "Trainer sign-in required." }, { status: 401 });
  const { id } = await params;
  const removed = await mutateSessions((all) => { const i = all.findIndex((x) => x.id === id); if (i < 0) return false; all.splice(i, 1); return true; });
  return removed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
}
