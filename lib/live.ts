/* Live classes: shared types and helpers (used by the student area, trainer area and API). */
export type SessionKind = "group" | "private" | "inperson";
export type Booking = { userId: string; name: string; email: string; at: string };
export type Session = {
  id: string;
  kind: SessionKind;
  title: string;
  trainer: string;
  start: string;            // ISO timestamp (UTC). Shown in India time.
  minutes: number;
  link: string;             // Google Meet link, set by the trainer. Empty for in-person.
  venue?: string;           // in-person sessions
  notes?: string;
  live?: boolean;           // trainer override: true = force LIVE, false = force ended, undefined = by clock
  price?: number;           // private sessions: rupees
  booked?: Booking | null;  // private sessions: who booked this slot
};

/** What the API returns to a student: other people's booking details are hidden. */
export type SessionView = Session & { taken?: boolean; mine?: boolean };

export const PRIVATE_PRICE = 150;      // EDIT: rupees per 30-minute private session
export const PRIVATE_MINUTES = 30;
export const TZ = "Asia/Kolkata";

export const endOf = (s: Session) => new Date(+new Date(s.start) + s.minutes * 60000);
export function isLive(s: Session, now = new Date()) {
  if (s.live === true) return true;
  if (s.live === false) return false;
  return +now >= +new Date(s.start) && +now <= +endOf(s);
}
export const isPast = (s: Session, now = new Date()) => !isLive(s, now) && +endOf(s) < +now;
export const startsInMin = (s: Session, now = new Date()) => Math.round((+new Date(s.start) - +now) / 60000);

export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ }).replace(" am", " AM").replace(" pm", " PM");
export const fmtDate = (iso: string, o: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) => new Date(iso).toLocaleDateString("en-IN", { ...o, timeZone: TZ });
export const dayKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD in India time
export const KIND_LABEL: Record<SessionKind, string> = { group: "Live class", private: "Private session", inperson: "In-person (not offered)" };

/** "Starts in 2h 15m", "Starts in 12 min", "Live now", "Ended". */
export function countdown(s: Session, now = new Date()) {
  if (isLive(s, now)) return "Live now";
  const m = startsInMin(s, now);
  if (m < 0) return "Ended";
  if (m < 60) return `Starts in ${m} min`;
  if (m < 60 * 24) return `Starts in ${Math.floor(m / 60)}h ${m % 60}m`;
  return `${fmtDate(s.start)} · ${fmtTime(s.start)}`;
}

/** Turn "2026-11-25" + "20:00" (India time) into a UTC ISO string. */
export function istToIso(date: string, time: string) {
  const [y, mo, d] = date.split("-").map(Number); const [h, mi] = time.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h, mi) - 5.5 * 3600000).toISOString();
}
