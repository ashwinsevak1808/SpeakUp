import { readJson, withLock, writeJson } from "./db";
import { seedSessions } from "./seed";
import { istToIso, type Session, type SessionKind, type SessionView } from "../live";

const FILE = "sessions.json";
export const loadSessions = () => readJson<Session[]>(FILE, seedSessions);
export const saveSessions = (s: Session[]) => writeJson(FILE, s.sort((a, b) => +new Date(a.start) - +new Date(b.start)));
export const mutateSessions = <T,>(fn: (all: Session[]) => T | Promise<T>) => withLock(async () => { const all = await loadSessions(); const out = await fn(all); await saveSessions(all); return out; });

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3);

/** What a visitor may see. Trainers see everything; private links and bookers stay private. */
export function toView(s: Session, userId: string | null, trainer: boolean): SessionView {
  const mine = !!userId && s.booked?.userId === userId;
  const v: SessionView = { ...s, taken: !!s.booked, mine };
  if (!trainer) {
    if (s.kind === "private" && !mine) v.link = "";
    if (!mine) delete v.booked;
  }
  return v;
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
  if (creating) {
    if (!x.date || !/^\d{4}-\d{2}-\d{2}$/.test(x.date)) e.push("Pick a start date.");
    if (!x.time || !/^\d{2}:\d{2}$/.test(x.time)) e.push("Pick a start time.");
    if (x.count !== undefined && (x.count < 1 || x.count > 60)) e.push("Repeat count must be between 1 and 60.");
  }
  return e;
}

/** Expand one form submission into 1..60 sessions (daily / weekdays / weekly repeats). */
export function expand(x: SessionInput): Session[] {
  const kind = x.kind ?? "group";
  const count = x.repeat && x.repeat !== "none" ? Math.min(60, x.count ?? 1) : 1;
  const out: Session[] = [];
  const base = new Date(`${x.date}T00:00:00Z`);
  let made = 0;
  for (let i = 0; made < count && i < 400; i++) {
    const d = new Date(+base + i * 86400000);
    const dow = d.getUTCDay();
    if (x.repeat === "weekdays" && (dow === 0 || dow === 6)) continue;
    if (x.repeat === "weekly" && i % 7 !== 0) continue;
    out.push({
      id: newId(), kind, title: x.title!.trim(), trainer: x.trainer!.trim(), start: istToIso(d.toISOString().slice(0, 10), x.time!), minutes: x.minutes ?? (kind === "private" ? 30 : 60),
      link: kind === "inperson" ? "" : (x.link ?? "").trim(), venue: x.venue?.trim() || undefined, notes: x.notes?.trim() || undefined,
      price: kind === "private" ? x.price ?? 150 : undefined, booked: kind === "private" ? null : undefined,
    });
    made++;
  }
  return out;
}
