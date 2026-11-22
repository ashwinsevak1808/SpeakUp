import { NextResponse } from "next/server";
import { isTrainer } from "@/lib/server/trainer-auth";
import { withLock, writeJson } from "@/lib/server/db";
import { WEEKS } from "@/lib/path-data";
import { CONTENT_FILE } from "../route";

/** Trainer only: throw away all lesson edits and go back to the built-in course. */
export async function POST() {
  if (!(await isTrainer())) return NextResponse.json({ error: "Trainer sign-in required." }, { status: 401 });
  await withLock(() => writeJson(CONTENT_FILE, { weeks: WEEKS, updatedAt: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
