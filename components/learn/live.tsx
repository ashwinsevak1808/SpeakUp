"use client";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, ChevronLeft, ChevronRight, ExternalLink, Lock, MapPin, Video } from "@/components/learn/icons";
import { KIND_LABEL, PRIVATE_PRICE, countdown, dayKey, endOf, fmtDate, fmtTime, isLive, isPast, startsInMin, type SessionKind, type SessionView } from "@/lib/live";
import { cn } from "@/lib/utils";
import { btn } from "./ui";

/** One colour for everything (the accent). Session types are told apart by marker shape, not colour. */
export function KindMarker({ kind, className, inverse }: { kind: SessionKind; className?: string; inverse?: boolean }) {
  const c = inverse ? "border-white bg-white" : "border-[var(--accent)] bg-[var(--accent)]";
  return <span aria-hidden className={cn("inline-block size-1.5 shrink-0 border", kind === "private" ? "rounded-full !bg-transparent" : kind === "inperson" ? "rotate-45" : "rounded-full", c, className)} />;
}

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white", className)}>
      <span className="relative flex size-1.5"><span className="absolute inset-0 animate-ping rounded-full bg-white/70" /><span className="relative size-1.5 rounded-full bg-white" /></span>LIVE
    </span>
  );
}

/** Sessions a student should see as "live now": group classes, plus private sessions they booked. */
export const liveNow = (sessions: SessionView[], now: Date) => sessions.filter((s) => isLive(s, now) && (s.kind !== "private" || s.mine));
const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
export const Avatar = ({ name, size = 28 }: { name: string; size?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-full bg-[var(--accent-subtle)] text-[10px] font-semibold text-[var(--accent-text)]" style={{ width: size, height: size }} aria-hidden>{initials(name)}</span>
);

/** Google Calendar "add event" link so a student can put a class in their own calendar. */
export const gcalLink = (s: SessionView, withLink = false) => {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(s.title + " with " + s.trainer)}&dates=${f(new Date(s.start))}/${f(endOf(s))}&details=${encodeURIComponent((withLink ? s.link : "") || s.venue || s.notes || "")}`;
};

/** One class as a row. Enrolled students get the Google Meet link; everyone else sees what it is and how to join. */
export function SessionCard({ s, now, enrolled, onEnrol, action, compact }: { s: SessionView; now: Date; enrolled: boolean; onEnrol: () => void; action?: React.ReactNode; compact?: boolean }) {
  const live = isLive(s, now);
  const soon = !live && startsInMin(s, now) >= 0 && startsInMin(s, now) <= 15;
  const past = isPast(s, now);
  const canJoin = (s.kind === "group" && enrolled) || (s.kind === "private" && s.mine);
  const when = countdown(s, now);
  return (
    <div className={cn("nx-card flex flex-col gap-4 p-4 sm:flex-row sm:items-start", live && "shadow-[0_0_0_1.5px_var(--accent),0_0_0_5px_var(--accent-ring)]", past && "opacity-60")}>
      <div className="flex shrink-0 items-baseline gap-2 sm:w-[92px] sm:flex-col sm:gap-0.5">
        <div className="ty-mono whitespace-nowrap text-[15px] font-semibold text-[var(--text-primary)]">{fmtTime(s.start)}</div>
        <div className="ty-note ty-subtle">{s.minutes} min</div>
      </div>
      <div className="min-w-0 flex-1 sm:border-l sm:border-[var(--border)] sm:pl-4">
        <div className="flex flex-wrap items-center gap-2">
          {live ? <LiveBadge /> : <span className="ty-label ty-caps ty-subtle inline-flex items-center gap-1.5"><KindMarker kind={s.kind} />{KIND_LABEL[s.kind]}</span>}
          {s.kind === "private" && <span className="ty-label ty-mono ty-subtle">₹{s.price ?? PRIVATE_PRICE}</span>}
        </div>
        <div className="ty-subject ty-ink mt-1">{s.title}</div>
        <div className="ty-note ty-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1"><Avatar name={s.trainer} size={20} /><span className="whitespace-nowrap">{s.trainer}</span>{s.kind === "inperson" && s.venue && <><MapPin className="ml-1 h-3.5 w-3.5" />{s.venue}</>}</div>
        {!compact && s.notes && <p className="ty-body ty-muted mt-2">{s.notes}</p>}
        <div className={cn("ty-note mt-2", live || soon ? "ty-600 ty-accent" : "ty-subtle")}>{/^(Live now|Starts in|Ended)/.test(when) ? `${fmtDate(s.start)} · ${when}` : when}</div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        {s.kind === "inperson" ? (
          <span className="ty-note ty-muted rounded-[var(--radius-md)] bg-[var(--surface-sunken)] px-2.5 py-1.5">Venue shared on WhatsApp</span>
        ) : canJoin && s.link ? (
          <a href={s.link} target="_blank" rel="noopener noreferrer" className={btn(live || soon ? "primary" : "secondary", "md")}><Video className="h-4 w-4" />{live ? "Join now" : "Open Meet link"}<ExternalLink className="h-3.5 w-3.5 opacity-70" /></a>
        ) : s.kind === "group" ? (
          <button onClick={onEnrol} className={btn("secondary", "md")}><Lock className="h-3.5 w-3.5" />Get the plan to join</button>
        ) : null}
        {action}
        {(!past && s.kind !== "private") || (s.kind === "private" && s.mine && !past) ? <a href={gcalLink(s, canJoin)} target="_blank" rel="noopener noreferrer" className={btn("ghost", "sm")}><CalendarPlus className="h-3.5 w-3.5" />Add to calendar</a> : null}
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
    <div className="nx-card self-start p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="ty-head ty-ink">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => move(-1)} aria-label="Previous month" className={btn("tertiary", "sm", "!px-2")}><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => move(1)} aria-label="Next month" className={btn("tertiary", "sm", "!px-2")}><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="ty-label ty-caps ty-subtle grid grid-cols-7 gap-1 text-center">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const items = byDay[key] ?? [];
          const inMonth = d.getUTCMonth() === cur.m;
          const live = items.some((s) => isLive(s, now));
          const isSel = key === selected;
          return (
            <button key={key} onClick={() => onSelect(key)} aria-label={`${key}${items.length ? `, ${items.length} sessions` : ""}`} aria-pressed={isSel}
              className={cn("relative flex h-12 flex-col items-center justify-start gap-1 rounded-[var(--radius-md)] pt-1.5 text-[13px] transition-colors sm:h-14",
                isSel ? "bg-[var(--accent)] font-semibold text-white" : key === todayKey ? "font-semibold text-[var(--accent-text)] shadow-[inset_0_0_0_1px_var(--border-accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]", !inMonth && !isSel && "text-[var(--border-strong)]")}>
              <span className="ty-mono">{d.getUTCDate()}</span>
              <span className="flex items-center gap-0.5">
                {live && <span className={cn("size-1.5 animate-pulse rounded-full", isSel ? "bg-white" : "bg-[var(--accent)]")} />}
                {items.slice(0, 3).map((s, i) => <KindMarker key={i} kind={s.kind} inverse={isSel} />)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="ty-note ty-muted nx-dash-h mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pt-3">
        <span className="flex items-center gap-1.5"><KindMarker kind="group" />Live class</span>
        <span className="flex items-center gap-1.5"><KindMarker kind="private" />Your private session</span>
      </div>
    </div>
  );
}

export const EmptyDay = () => <div className="ty-body ty-muted rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-8 text-center">No sessions on this day.</div>;
export const ViewAll = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} className="ty-body ty-500 ty-accent inline-flex items-center gap-1.5 hover:underline">{children}<ArrowRight className="h-4 w-4" /></a>;
