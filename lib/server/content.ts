import type { SupabaseClient } from "@supabase/supabase-js";
import { WEEKS, type Week } from "@/lib/path-data";

/** Lessons live in Supabase (one course document). Until a trainer saves an edit, the built-in course is used. */
export type Content = { weeks: Week[]; updatedAt: string; edited: boolean };

/**
 * Weeks that were still "coming soon" in the saved copy, but now have lessons in the code,
 * are filled in from the code. Weeks that already have lessons (and any trainer edits) are kept.
 * Built-in cards that gained a rule line or mistake pairs get just those fields, and only when the
 * saved card still has the built-in title and the same examples (so trainer edits are never touched).
 */
export function mergeNewWeeks(saved: Week[]): Week[] {
  const weeks = WEEKS.map((code) => {
    const s = saved.find((w) => w.n === code.n);
    if (!s) return code;
    if ((s.comingSoon || s.lessons.length === 0) && !code.comingSoon && code.lessons.length > 0) return code;
    return s;
  });
  const plain = (a?: string[]) => (a ?? []).join("|").replace(/\*/g, "");
  for (const w of weeks) {
    const code = WEEKS.find((c) => c.n === w.n); if (!code || w === code) continue;
    w.lessons = w.lessons.map((l) => {
      const cl = code.lessons.find((x) => x.id === l.id); if (!cl) return l;
      let touched = false;
      const learn = l.learn.map((card) => {
        const cc = cl.learn.find((x) => x.title === card.title);
        if (!cc || card.rule || card.pairs || !(cc.rule || cc.pairs) || plain(card.examples) !== plain(cc.examples)) return card;
        touched = true;
        return { ...card, rule: cc.rule, pairs: cc.pairs, examples: cc.examples };
      });
      return touched ? { ...l, learn } : l;
    });
  }
  const extra = saved.filter((w) => !WEEKS.some((c) => c.n === w.n)); // trainer-added weeks beyond the built-in 12
  return [...weeks, ...extra];
}

export async function loadContent(sb: SupabaseClient): Promise<Content> {
  const { data, error } = await sb.from("course_content").select("weeks, updated_at").eq("id", 1).maybeSingle<{ weeks: Week[]; updated_at: string }>();
  if (error) throw new Error(error.message);
  // A copy, so a caller that edits the weeks never changes the built-in course held in memory.
  if (!data) return { weeks: structuredClone(WEEKS), updatedAt: new Date(0).toISOString(), edited: false };
  return { weeks: structuredClone(mergeNewWeeks(data.weeks)), updatedAt: data.updated_at, edited: true };
}

export async function saveContent(sb: SupabaseClient, weeks: Week[], by: string) {
  const { error } = await sb.from("course_content").upsert({ id: 1, weeks, updated_at: new Date().toISOString(), updated_by: by });
  if (error) throw new Error(error.message);
}
