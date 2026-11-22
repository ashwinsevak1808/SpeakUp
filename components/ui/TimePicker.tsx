"use client";
/**
 * Time picker in the same style as the Neemo date picker: same field, same centred card.
 * Hour grid + minute grid + AM/PM, with quick picks for common class times. Value is "HH:MM" (24 h).
 */
import { useState } from "react";
import { Clock } from "@/components/learn/icons";
import { cn } from "@/lib/utils";
import { PickerCard, PickerField } from "./DatePicker";

const pad = (n: number) => String(n).padStart(2, "0");
const split = (v: string) => { const [h, m] = v.split(":").map(Number); return Number.isFinite(h) && Number.isFinite(m) ? { h, m } : null; };
export const fmt12 = (v: string) => { const t = split(v); if (!t) return ""; const h12 = t.h % 12 || 12; return `${h12}:${pad(t.m)} ${t.h < 12 ? "AM" : "PM"}`; };

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const QUICK = ["07:00", "09:00", "18:00", "19:00", "20:00", "21:00"];

export function TimePicker({ value, onChange, placeholder = "Select time", id, note = "India time", className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; id?: string; note?: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = split(value) ?? { h: 20, m: 0 };
  const pm = t.h >= 12, h12 = t.h % 12 || 12;
  const set = (h24: number, m: number) => onChange(`${pad(h24)}:${pad(m)}`);
  const to24 = (h: number, isPm: boolean) => (h % 12) + (isPm ? 12 : 0);
  const cell = (on: boolean) => cn("h-9 rounded-[10px] text-[13px] font-medium transition-all", on ? "bg-[var(--accent)] font-semibold text-white" : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]");

  return (
    <>
      <PickerField id={id} className={className} icon={<Clock className="h-4 w-4" />} text={value ? `${fmt12(value)}${note ? ` · ${note}` : ""}` : ""} placeholder={placeholder} open={open} onOpen={() => setOpen(true)} />
      {open && typeof window !== "undefined" && (
        <PickerCard label="Choose a time" title="Select time" subtitle={value ? `${fmt12(value)}${note ? ` (${note})` : ""}` : "Pick an hour and minutes"} onClose={() => setOpen(false)}>
          <div className="px-4 pt-2">
            <div className="mb-3 flex items-center justify-between">
              <span className="ty-label ty-caps ty-subtle">Hour</span>
              <div role="group" aria-label="AM or PM" className="flex rounded-[9px] bg-[var(--surface-sunken)] p-0.5">
                {(["AM", "PM"] as const).map((p) => {
                  const on = (p === "PM") === pm;
                  return <button key={p} type="button" aria-pressed={on} onClick={() => set(to24(h12, p === "PM"), t.m)} className={cn("h-7 rounded-[7px] px-3 text-[12px] font-semibold transition-colors", on ? "bg-white text-[var(--text-primary)] shadow-[0_1px_2px_rgba(19,26,22,.12)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]")}>{p}</button>;
                })}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {HOURS.map((h) => <button key={h} type="button" aria-pressed={h === h12} aria-label={`${h} o'clock`} onClick={() => set(to24(h, pm), t.m)} className={cell(h === h12)}>{h}</button>)}
            </div>
            <p className="ty-label ty-caps ty-subtle mb-2 mt-4">Minutes</p>
            <div className="grid grid-cols-6 gap-1">
              {MINUTES.map((m) => <button key={m} type="button" aria-pressed={m === t.m} aria-label={`${m} minutes`} onClick={() => { set(t.h, m); setOpen(false); }} className={cell(m === t.m)}>:{pad(m)}</button>)}
            </div>
            <p className="ty-label ty-caps ty-subtle mb-2 mt-4">Quick picks</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK.map((q) => <button key={q} type="button" onClick={() => { onChange(q); setOpen(false); }} className={cn("h-7 rounded-full px-3 text-[12px] font-medium transition-colors", value === q ? "bg-[var(--accent-subtle)] text-[var(--accent-text)] shadow-[inset_0_0_0_1px_var(--border-accent)]" : "bg-white text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--border)] hover:bg-[var(--surface-hover)]")}>{fmt12(q)}</button>)}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] px-4 pb-3.5 pt-2.5">
            <span className="ty-note ty-muted">Choosing minutes closes this</span>
            <button type="button" onClick={() => setOpen(false)} className="ty-note font-semibold text-[var(--accent-text)] hover:underline">Done</button>
          </div>
        </PickerCard>
      )}
    </>
  );
}
