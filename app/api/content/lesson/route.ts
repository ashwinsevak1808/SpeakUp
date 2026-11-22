import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";
import { loadContent, saveContent } from "@/lib/server/content";
import { validateLesson } from "@/lib/path-validate";
import type { Lesson } from "@/lib/path-data";

/** Staff: save one lesson (edit an existing id, or add a new one to its week). */
export async function PUT(req: Request) {
  const g = await requireUser(true); if (g.error) return g.error;
  const { lesson } = (await req.json().catch(() => ({}))) as { lesson?: Lesson };
  const errors = validateLesson(lesson);
  if (errors.length) return NextResponse.json({ errors }, { status: 422 });
  const l = lesson!;
  const c = await loadContent(g.sb);
  const week = c.weeks.find((w) => w.n === l.week);
  if (!week) return NextResponse.json({ error: `There is no week ${l.week}.` }, { status: 422 });
  for (const w of c.weeks) { const i = w.lessons.findIndex((x) => x.id === l.id); if (i >= 0) w.lessons.splice(i, 1); } // moving weeks is allowed
  week.lessons.push(l); week.lessons.sort((a, b) => a.day - b.day);
  week.comingSoon = false;
  try { await saveContent(g.sb, c.weeks, g.me.id); } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = await requireUser(true); if (g.error) return g.error;
  const id = new URL(req.url).searchParams.get("id");
  const c = await loadContent(g.sb); let found = false;
  for (const w of c.weeks) { const i = w.lessons.findIndex((x) => x.id === id); if (i >= 0) { w.lessons.splice(i, 1); found = true; if (!w.lessons.length) w.comingSoon = true; } }
  if (!found) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  try { await saveContent(g.sb, c.weeks, g.me.id); } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
