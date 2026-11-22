import { NextResponse } from "next/server";
import { loadContent } from "@/lib/server/content";
import { publicSupabase } from "@/lib/supabase/server";

/** The course everyone learns from (the built-in course until a trainer saves an edit). */
export async function GET() {
  try { return NextResponse.json(await loadContent(publicSupabase())); }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
