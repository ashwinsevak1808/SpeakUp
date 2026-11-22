"use client";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, ChevronLeft, ChevronRight, ExternalLink, Lock, MapPin, Video } from "@/components/learn/icons";
import { KIND_LABEL, PRIVATE_PRICE, countdown, dayKey, endOf, fmtDate, fmtTime, isLive, isPast, startsInMin, type SessionView } from "@/lib/live";
import { cn } from "@/lib/utils";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-live px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white", className)}>
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />LIVE
    </span>
  );
}

/** Sessions a student should see as "live now": group classes, plus private sessions they booked. */
export const liveNow = (sessions: SessionView[], now: Date) => sessions.filter((s) => isLive(s, now) && (s.kind !== "private" || s.mine));
const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
export const Avatar = ({ name, size = 28 }: { name: string; size?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-full bg-accent-100 font-display text-[10px] font-semibold text-accent-700" style={{ width: size, height: size }} aria-hidden>{initials(name)}</span>
);

/** Google Calendar "add event" link so a student can put a class in their own calendar. */
export const gcalLink = (s: SessionView, withLink = false) => {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(s.title + " with " + s.trainer)}&dates=${f(new Date(s.start))}/${f(endOf(s))}&details=${encodeURIComponent((withLink ? s.link : "") || s.venue || s.notes || "")}`;
};

/** One class. Enrolled students get the Google Meet link; everyone else sees what it is and how to join. */
export function SessionCard({ s, now, enrolled, onEnrol, action, compact }: { s: SessionView; now: Date; enrolled: boolean; onEnrol: () => void; action?: React.ReactNode; compact?: boolean }) {
  const live = isLive(s, now);
  const soon = !live && startsInMin(s, now) >= 0 && startsInMin(s, now) <= 15;
  const past = isPast(s, now);
  const canJoin = (s.kind === "group" && enrolled) || (s.kind === "private" && s.mine);
  return (
    <div className={cn("rounded-xl border bg-white p-4 transition-colors", live ? "border-live/40 ring-1 ring-live/20" : "border-line", past && "opacity-60")}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="w-[84px] shrink-0">
          <div className="whitespace-nowrap font-display text-lg font-semibold leading-none text-brand-900">{fmtTime(s.start)}</div>
          <div className="mt-1 text-xs text-muted">{s.minutes} min</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {live && <LiveBadge />}
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600">{KIND_LABEL[s.kind]}</span>
            {s.kind === "private" && <span className="text-[11px] font-semibold text-muted">₹{s.price ?? PRIVATE_PRICE}</span>}
          </div>
          <div className="mt-1.5 font-display font-semibold text-brand-900">{s.title}</div>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-muted"><Avatar name={s.trainer} size={22} />{s.trainer}{s.kind === "inperson" && s.venue && <><MapPin className="ml-2 h-3.5 w-3.5" />{s.venue}</>}</div>
          {!compact && s.notes && <p className="mt-2 text-sm text-muted">{s.notes}</p>}
          <div className={cn("mt-2 text-xs font-semibold", live ? "text-live" : soon ? "text-brand-900" : "text-muted")}>{/^(Live now|Starts in|Ended)/.test(countdown(s, now)) ? `${fmtDate(s.start)} · ${countdown(s, now)}` : countdown(s, now)}</div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {s.kind === "inperson" ? (
            <span className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-muted">Venue shared on WhatsApp</span>
          ) : canJoin && s.link ? (
            <a href={s.link} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors", live || soon ? "bg-accent-600 text-white hover:bg-accent-700" : "border border-line text-brand-900 hover:bg-brand-50")}>
              <Video className="h-4 w-4" />{live ? "Join now" : "Open Meet link"}<ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          ) : s.kind === "group" ? (
            <button onClick={onEnrol} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-brand-900 hover:bg-brand-50"><Lock className="h-3.5 w-3.5" />Enrol to join</button>
          ) : null}
          {action}
          {!past && s.kind !== "private" || (s.kind === "private" && s.mine && !past) ? <a href={gcalLink(s, canJoin)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-muted hover:text-brand-900"><CalendarPlus className="h-3.5 w-3.5" />Add to calendar</a> : null}
        </div>
      </div>
    </div>
  );
}

/* ---------------- month calendar ---------------- */
export function Calendar({ sessions, now, selected, onSelect }: { sessions: SessionView[]; now: Date; selected: string; onSelect: (key: string) => void }) {
  const todayKey = dayKey(now.toISOString());
  const [cur, setCur] = useState(() => ({ y: Number(todayKey.slice(0, 4)), m: Number(todayKey.slice(5, 7)) - 1 }));
  const byDay = useMemo(() => {
    const map: Record<string, SessionView[]> = {};
    for (const s of sessions) { if (s.kind === "private" && !s.mine) continue; (map[dayKey(s.start)] ||= []).push(s); }
    return map;
  }, [sessions]);
  const first = new Date(Date.UTC(cur.y, cur.m, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const cells = Array.from({ length: 42 }, (_, i) => new Date(Date.UTC(cur.y, cur.m, 1 - offset + i)));
  const title = first.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
  const move = (d: number) => setCur((c) => { const n = new Date(Date.UTC(c.y, c.m + d, 1)); return { y: n.getUTCFullYear(), m: n.getUTCMonth() }; });

  return (
    <div className="nx-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-900">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => move(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-lg border border-line hover:bg-brand-50"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => move(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-lg border border-line hover:bg-brand-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const items = byDay[key] ?? [];
          const inMonth = d.getUTCMonth() === cur.m;
          const live = items.some((s) => isLive(s, now));
          const isSel = key === selected;
          return (
            <button key={key} onClick={() => onSelect(key)} aria-label={`${key}${items.length ? `, ${items.length} sessions` : ""}`} aria-pressed={isSel}
              className={cn("relative flex h-14 flex-col items-center justify-start gap-1 rounded-lg border pt-1.5 text-sm transition-colors sm:h-16",
                isSel ? "border-accent-600 bg-accent-600 text-white" : key === todayKey ? "border-brand-300 bg-brand-50 font-semibold text-brand-900" : "border-transparent hover:bg-brand-50", !inMonth && !isSel && "text-slate-300")}>
              <span>{d.getUTCDate()}</span>
              <span className="flex items-center gap-0.5">
                {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />}
                {items.slice(0, 3).map((s, i) => <span key={i} className={cn("h-1.5 w-1.5", s.kind === "private" ? "rounded-full border" : s.kind === "inperson" ? "rotate-45" : "rounded-full", isSel ? "border-white bg-white" : "border-accent-600 bg-accent-600", s.kind === "private" && "bg-transparent")} />)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent-600" />Live class</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full border border-accent-600" />Your private session</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rotate-45 bg-accent-600" />Mumbai in-person</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-live" />Live now</span>
      </div>
    </div>
  );
}

export const EmptyDay = () => <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No sessions on this day.</div>;
export const ViewAll = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-900 hover:underline">{children}<ArrowRight className="h-4 w-4" /></a>;
