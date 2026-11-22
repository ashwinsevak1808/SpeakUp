import { NextResponse } from "next/server";
import { checkPasscode, clearTrainerCookie, isTrainer, issueTrainerCookie, trainerAuthReady, usingDevDefaults } from "@/lib/server/trainer-auth";

export async function GET() {
  return NextResponse.json({ trainer: await isTrainer(), ready: trainerAuthReady(), devDefaults: usingDevDefaults() });
}
export async function POST(req: Request) {
  if (!trainerAuthReady()) return NextResponse.json({ ok: false, error: "Trainer sign-in is not configured. Set TRAINER_PASSCODE and TRAINER_SECRET in .env.local." }, { status: 503 });
  const { passcode } = (await req.json().catch(() => ({}))) as { passcode?: string };
  if (!passcode || !checkPasscode(passcode)) return NextResponse.json({ ok: false, error: "Wrong passcode." }, { status: 401 });
  await issueTrainerCookie();
  return NextResponse.json({ ok: true });
}
export async function DELETE() { await clearTrainerCookie(); return NextResponse.json({ ok: true }); }
