import { istToIso, type Session, type SessionKind, type SessionView } from "../live";

/** A sessions row as stored in Supabase, with the link and booking the caller is allowed to see. */
export type SessionRow = {
  id: string; kind: SessionKind; title: string; trainer: string; start_at: string; minutes: number;
  venue: string | null; notes: string | null; live: boolean | null; price: number | null; booked: boolean;
  session_links: { link: string } | null;
  bookings: { user_id: string; name: string; email: string; booked_at: string } | null;
};
export const SESSION_SELECT = "*, session_links(link), bookings(user_id, name, email, booked_at)";

export function toView(r: SessionRow, userId: string): SessionView {
  const b = r.bookings;
  return {
    id: r.id, kind: r.kind, title: r.title, trainer: r.trainer, start: r.start_at, minutes: r.minutes,
    link: r.session_links?.link ?? "", venue: r.venue ?? undefined, notes: r.notes ?? undefined,
    live: r.live ?? undefined, price: r.price ?? undefined,
    booked: b ? { userId: b.user_id, name: b.name, email: b.email, at: b.booked_at } : r.kind === "private" ? null : undefined,
    taken: r.booked, mine: !!b && b.user_id === userId,
  };
}

export type SessionInput = Partial<Session> & { date?: string; time?: string; repeat?: "none" | "daily" | "weekdays" | "weekly"; count?: number };
const KINDS: SessionKind[] = ["group", "private", "inperson"];

export function validateSession(x: SessionInput, creating: boolean): string[] {
  const e: string[] = [];
  if (!x.title?.trim()) e.push("Title is required.");
  if (!x.trainer?.trim()) e.push("Trainer name is required.");
  if (x.kind && !KINDS.includes(x.kind)) e.push("Unknown session type.");
  if (x.minutes !== undefined && (!Number.isFinite(x.minutes) || x.minutes < 10 || x.minutes > 240)) e.push("Length must be between 10 and 240 minutes.");
  if (x.link && !/^https:\/\/[^\s]+$/i.test(x.link)) e.push("The link must start with https:// (for example your Google Meet link).");
  if (x.price !== undefined && x.price !== null && (!Number.isFinite(x.price) || x.price < 0)) e.push("Price must be 0 or more.");
  if (creating) {
    if (!x.date || !/^\d{4}-\d{2}-\d{2}$/.test(x.date)) e.push("Pick a start date.");
    if (!x.time || !/^\d{2}:\d{2}$/.test(x.time)) e.push("Pick a start time.");
    if (x.count !== undefined && (x.count < 1 || x.count > 60)) e.push("Repeat count must be between 1 and 60.");
  }
  return e;
}

/** Expand one form submission into 1..60 sessions (daily / weekdays / weekly repeats), ready to insert. */
export function expand(x: SessionInput, createdBy: string) {
  const kind = x.kind ?? "group";
  const count = x.repeat && x.repeat !== "none" ? Math.min(60, x.count ?? 1) : 1;
  const rows: { id: string; kind: SessionKind; title: string; trainer: string; start_at: string; minutes: number; venue: string | null; notes: string | null; price: number | null; created_by: string }[] = [];
  const links: { session_id: string; link: string }[] = [];
  const base = new Date(`${x.date}T00:00:00Z`);
  for (let i = 0; rows.length < count && i < 400; i++) {
    const d = new Date(+base + i * 86400000);
    const dow = d.getUTCDay();
    if (x.repeat === "weekdays" && (dow === 0 || dow === 6)) continue;
    if (x.repeat === "weekly" && i % 7 !== 0) continue;
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    rows.push({
      id, kind, title: x.title!.trim(), trainer: x.trainer!.trim(), start_at: istToIso(d.toISOString().slice(0, 10), x.time!),
      minutes: x.minutes ?? (kind === "private" ? 30 : 60), venue: x.venue?.trim() || null, notes: x.notes?.trim() || null,
      price: kind === "private" ? x.price ?? 150 : null, created_by: createdBy,
    });
    if (kind !== "inperson" && x.link?.trim()) links.push({ session_id: id, link: x.link.trim() });
  }
  return { rows, links };
}
