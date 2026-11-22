"use client";
/**
 * Date picker ported from the Neemo company design system (components/ui/DatePicker.tsx).
 * Click the field: a centred card opens with day / month / year views. Choosing a day applies it.
 * Value is "YYYY-MM-DD" (same as <input type="date">).
 */
import { useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, X } from "@/components/learn/icons";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
type View = "day" | "month" | "year";

const parse = (v: string) => { const p = v.split("-"); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Shared trigger look for the date and time pickers: the field skin with a lead icon and a clear button. */
export function PickerField({ id, icon, text, placeholder, open, onOpen, onClear, className }: {
  id?: string; icon: React.ReactNode; text: string; placeholder: string; open: boolean; onOpen: () => void; onClear?: () => void; className?: string;
}) {
  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-[var(--text-subtle)]">{icon}</span>
      <button
        id={id} type="button" onClick={onOpen} aria-haspopup="dialog" aria-expanded={open}
        className={cn("h-10 w-full min-w-0 truncate rounded-[9px] bg-white pl-9 text-left text-[13.5px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border-strong)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--text-subtle)] focus-visible:outline-none", onClear && text ? "pr-9" : "pr-3",
          open && "!shadow-[inset_0_0_0_1px_var(--accent),0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)]")}
      >
        <span className={cn(!text && "text-[var(--text-subtle)]")}>{text || placeholder}</span>
      </button>
      {onClear && text && (
        <button type="button" onClick={onClear} aria-label="Clear" className="absolute inset-y-0 right-1.5 my-auto grid size-7 place-items-center rounded-md text-[var(--text-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"><X className="h-3.5 w-3.5" /></button>
      )}
    </div>
  );
}

/** The centred card both pickers open in (portal, scrim, Escape / backdrop to close). */
export function PickerCard({ title, subtitle, onClose, children, label }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode; label: string }) {
  return createPortal(
    <div
      className="app-theme fixed inset-0 z-[99999] grid place-items-center p-4"
      style={{ background: "rgba(19,26,22,.32)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog" aria-modal="true" aria-label={label}
    >
      <div className="nx-pop w-[336px] max-w-full overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_1px_var(--border),0_24px_60px_-16px_rgba(19,26,22,.32)]">
        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0"><p className="ty-subject ty-ink">{title}</p><p className="ty-note ty-muted mt-0.5">{subtitle}</p></div>
          <button type="button" onClick={onClose} aria-label="Close" autoFocus className="grid size-8 shrink-0 place-items-center rounded-[9px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

const navBtn = "grid size-[30px] place-items-center rounded-[9px] bg-white text-[var(--text-muted)] shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]";
const headBtn = "-mx-2 -my-1 flex items-center gap-1 rounded-[8px] px-2 py-1 text-[14px] font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]";

export function DatePicker({ value, onChange, placeholder = "Select date", id, min, max, clearable = false, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; id?: string;
  /** Earliest / latest selectable date, "YYYY-MM-DD". */
  min?: string; max?: string; clearable?: boolean; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("day");
  const [cursor, setCursor] = useState(() => parse(value) ?? new Date());
  const [yearStart, setYearStart] = useState(() => Math.floor(new Date().getFullYear() / 16) * 16);
  const today = new Date();
  const sel = parse(value);
  const year = cursor.getFullYear(), month = cursor.getMonth();

  const openIt = () => { const s = parse(value) ?? today; setCursor(new Date(s.getFullYear(), s.getMonth(), 1)); setYearStart(Math.floor(s.getFullYear() / 16) * 16); setView("day"); setOpen(true); };
  const pick = (d: Date) => { onChange(iso(d)); setOpen(false); };
  const same = (d: Date | null, y: number, m: number, day: number) => !!d && d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;

  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const prevTotal = new Date(year, month, 0).getDate();
  const trailing = (first + total) % 7 === 0 ? 0 : 7 - ((first + total) % 7);
  const display = sel ? `${DAY_NAMES[sel.getDay()].slice(0, 3)}, ${sel.getDate()} ${SHORT[sel.getMonth()]} ${sel.getFullYear()}` : "";

  return (
    <>
      <PickerField id={id} className={className} icon={<CalendarDays className="h-4 w-4" />} text={display} placeholder={placeholder} open={open} onOpen={openIt} onClear={clearable ? () => onChange("") : undefined} />
      {open && typeof window !== "undefined" && (
        <PickerCard label="Choose a date" title="Select date" subtitle={sel ? `${DAY_NAMES[sel.getDay()]}, ${sel.getDate()} ${SHORT[sel.getMonth()]} ${sel.getFullYear()}` : "Pick a day to apply it"} onClose={() => setOpen(false)}>
          {view === "day" && (
            <div>
              <div className="flex items-center justify-between px-5 pb-2.5 pt-3.5">
                <button type="button" onClick={() => setView("month")} className={headBtn}>{MONTHS[month]} {year}<ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" /></button>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month" className={navBtn}><ChevronLeft className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month" className={navBtn}><ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="mb-1 grid grid-cols-7 px-4">{DOW.map((d) => <span key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--text-subtle)]">{d}</span>)}</div>
              <div className="grid grid-cols-7 gap-[2px] px-4">
                {Array.from({ length: first }, (_, i) => <span key={`p${i}`} className="pointer-events-none flex aspect-square items-center justify-center text-[12px] font-medium text-[var(--border-strong)]">{prevTotal - first + i + 1}</span>)}
                {Array.from({ length: total }, (_, i) => i + 1).map((day) => {
                  const d = new Date(year, month, day); const key = iso(d);
                  const blocked = (!!min && key < min) || (!!max && key > max);
                  const on = same(sel, year, month, day); const now = same(today, year, month, day);
                  return (
                    <button key={day} type="button" disabled={blocked} onClick={() => pick(d)} aria-label={`${day} ${MONTHS[month]} ${year}`} aria-pressed={on}
                      className={cn("relative flex aspect-square items-center justify-center rounded-[10px] text-[13px] font-medium transition-all",
                        blocked ? "cursor-not-allowed text-[var(--border-strong)]"
                          : on ? "scale-105 bg-[var(--accent)] font-semibold text-white"
                          : now ? "bg-[var(--surface-subtle)] font-semibold text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border-strong)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]")}>
                      {day}
                      {now && !on && !blocked && <span className="absolute bottom-[5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-[var(--accent)]" />}
                    </button>
                  );
                })}
                {Array.from({ length: trailing }, (_, i) => <span key={`n${i}`} className="pointer-events-none flex aspect-square items-center justify-center text-[12px] font-medium text-[var(--border-strong)]">{i + 1}</span>)}
              </div>
            </div>
          )}
          {view === "month" && (
            <div>
              <div className="flex items-center justify-between px-5 pb-2.5 pt-3.5">
                <button type="button" onClick={() => setView("year")} className={headBtn}>{year}<ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" /></button>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setCursor(new Date(year - 1, month, 1))} aria-label="Previous year" className={navBtn}><ChevronLeft className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setCursor(new Date(year + 1, month, 1))} aria-label="Next year" className={navBtn}><ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 px-4">
                {SHORT.map((m, i) => {
                  const on = !!sel && sel.getMonth() === i && sel.getFullYear() === year; const now = i === today.getMonth() && year === today.getFullYear();
                  return <button key={m} type="button" onClick={() => { setCursor(new Date(year, i, 1)); setView("day"); }} className={cn("h-12 rounded-[12px] text-[13px] font-medium transition-all", on ? "bg-[var(--accent)] font-semibold text-white" : now ? "font-semibold text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border-strong)] hover:bg-[var(--surface-hover)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]")}>{m}</button>;
                })}
              </div>
            </div>
          )}
          {view === "year" && (
            <div>
              <div className="flex items-center justify-between px-5 pb-2.5 pt-3.5">
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">{yearStart} – {yearStart + 15}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setYearStart((y) => y - 16)} aria-label="Earlier years" className={navBtn}><ChevronLeft className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setYearStart((y) => y + 16)} aria-label="Later years" className={navBtn}><ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 px-4">
                {Array.from({ length: 16 }, (_, i) => yearStart + i).map((y) => {
                  const on = !!sel && sel.getFullYear() === y; const now = y === today.getFullYear();
                  return <button key={y} type="button" onClick={() => { setCursor(new Date(y, month, 1)); setView("month"); }} className={cn("h-[38px] rounded-[10px] text-[13px] font-medium transition-all", on ? "bg-[var(--accent)] font-semibold text-white" : now ? "font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]")}>{y}</button>;
                })}
              </div>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] px-4 pb-3.5 pt-2.5">
            <button type="button" onClick={() => pick(new Date())} disabled={(!!min && iso(today) < min) || (!!max && iso(today) > max)} className="ty-note font-semibold text-[var(--accent-text)] hover:underline disabled:opacity-40">Today</button>
            {clearable && value && <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="ty-note font-semibold text-[var(--text-muted)] hover:underline">Clear</button>}
          </div>
        </PickerCard>
      )}
    </>
  );
}
