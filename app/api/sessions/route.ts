import { NextResponse } from "next/server";
import { isTrainer } from "@/lib/server/trainer-auth";
import { expand, loadSessions, mutateSessions, toView, validateSession, type SessionInput } from "@/lib/server/sessions";

/** Students: GET /api/sessions?userId=... Trainers (cookie): full details. */
export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  const trainer = await isTrainer();
  const all = await loadSessions();
  const from = Date.now() - 36 * 3600000; // keep the list short: from yesterday onwards (trainers see 30 days back)
  const since = trainer ? Date.now() - 30 * 86400000 : from;
  return NextResponse.json({ sessions: all.filter((s) => +new Date(s.start) >= since).map((s) => toView(s, userId, trainer)) });
}

/** Trainer only: create one session, or a repeating series (daily / weekdays / weekly). */
export async function POST(req: Request) {
  if (!(await isTrainer())) return NextResponse.json({ error: "Trainer sign-in required." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as SessionInput;
  const errs = validateSession(body, true);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 422 });
  const made = expand(body);
  await mutateSessions((all) => { all.push(...made); });
  return NextResponse.json({ created: made.length });
}
