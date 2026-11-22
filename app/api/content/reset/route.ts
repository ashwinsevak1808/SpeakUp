import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/guard";

/** Staff: throw away all lesson edits and go back to the built-in course. */
export async function POST() {
  const g = await requireUser(true); if (g.error) return g.error;
  const { error } = await g.sb.from("course_content").delete().eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
