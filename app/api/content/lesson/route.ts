import { NextResponse } from "next/server";
import { isTrainer } from "@/lib/server/trainer-auth";
import { withLock, writeJson } from "@/lib/server/db";
import { validateLesson } from "@/lib/path-validate";
import type { Lesson } from "@/lib/path-data";
import { CONTENT_FILE, loadContent } from "../route";

/** Trainer only: save one lesson (edit an existing id, or add a new one to its week). */
export async function PUT(req: Request) {
  if (!(await isTrainer())) return NextResponse.json({ error: "Trainer sign-in required." }, { status: 401 });
  const { lesson } = (await req.json().catch(() => ({}))) as { lesson?: Lesson };
  const errors = validateLesson(lesson);
  if (errors.length) return NextResponse.json({ errors }, { status: 422 });
  const l = lesson!;
  const out = await withLock(async () => {
    const c = await loadContent();
    const week = c.weeks.find((w) => w.n === l.week);
    if (!week) return { error: `There is no week ${l.week}.` };
    for (const w of c.weeks) { const i = w.lessons.findIndex((x) => x.id === l.id); if (i >= 0) w.lessons.splice(i, 1); } // moving weeks is allowed
    week.lessons.push(l); week.lessons.sort((a, b) => a.day - b.day);
    week.comingSoon = false;
    c.updatedAt = new Date().toISOString();
    await writeJson(CONTENT_FILE, c);
    return { ok: true };
  });
  return "error" in out ? NextResponse.json(out, { status: 422 }) : NextResponse.json(out);
}

export async function DELETE(req: Request) {
  if (!(await isTrainer())) return NextResponse.json({ error: "Trainer sign-in required." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  const ok = await withLock(async () => {
    const c = await loadContent(); let found = false;
    for (const w of c.weeks) { const i = w.lessons.findIndex((x) => x.id === id); if (i >= 0) { w.lessons.splice(i, 1); found = true; if (!w.lessons.length) w.comingSoon = true; } }
    if (found) { c.updatedAt = new Date().toISOString(); await writeJson(CONTENT_FILE, c); }
    return found;
  });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Lesson not found." }, { status: 404 });
}
