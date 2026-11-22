import { NextResponse } from "next/server";
import { readJson } from "@/lib/server/db";
import { WEEKS, type Week } from "@/lib/path-data";

/** Lessons come from here, not from the code. Starts as the built-in course; trainers edit it from /trainer. */
export type ContentFile = { weeks: Week[]; updatedAt: string };
export const CONTENT_FILE = "content.json";
export const loadContent = () => readJson<ContentFile>(CONTENT_FILE, () => ({ weeks: WEEKS, updatedAt: new Date().toISOString() }));

export async function GET() {
  return NextResponse.json(await loadContent());
}
