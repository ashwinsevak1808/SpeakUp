import type { Metadata } from "next";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { WEEKS } from "@/lib/path-data";

// Lessons come from the backend and can be added by trainers at any time, so the page
// resolves the lesson in the browser instead of only knowing the ids built into the code.
export function generateStaticParams() {
  return WEEKS.flatMap((w) => w.lessons.map((l) => ({ id: l.id })));
}
export const metadata: Metadata = { title: "Lesson" };

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonPlayer lessonId={id} />;
}
