"use client";
/**
 * ⌘K command palette, in the Neemo company style: a plain search field, grouped compact rows
 * (36px, small icon tile, hint on the right), the highlighted row tinted, and a key-hint footer.
 * Used by the admin panel and the student app; each passes its own items.
 */
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Search, type IconType } from "@/components/learn/icons";
import { cn } from "@/lib/utils";

export type PaletteItem = {
  id: string;
  group: string;
  label: string;
  /** Second line under the label (e.g. an email). */
  sub?: string;
  /** Short text on the right (e.g. a status). */
  hint?: string;
  icon?: IconType;
  /** Drawn instead of the icon tile (e.g. an avatar). */
  mark?: ReactNode;
  /** Extra words that should match the search. */
  keywords?: string;
  disabled?: boolean;
  run: () => void;
};

export function CommandPalette({ items, groups, placeholder, onClose, emptyHint, limits = {}, emptyLimits = {} }: {
  items: PaletteItem[];
  /** Group order. Items in groups not listed are not shown. */
  groups: string[];
  placeholder: string;
  onClose: () => void;
  emptyHint?: string;
  /** Max rows per group while searching, e.g. { Students: 8 }. */
  limits?: Record<string, number>;
  /** Max rows per group before anything is typed (0 hides the group). */
  emptyLimits?: Record<string, number>;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const hit = (i: PaletteItem) => !t || `${i.label} ${i.sub ?? ""} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(t);
    const cap = (g: string) => (t ? limits[g] : emptyLimits[g] ?? limits[g]) ?? 50;
    return groups.flatMap((g) => items.filter((i) => i.group === g && hit(i)).slice(0, cap(g)));
  }, [items, groups, q, limits, emptyLimits]);

  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) { setPrevQ(q); setSel(0); }

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { listRef.current?.querySelector<HTMLElement>(`[data-index="${sel}"]`)?.scrollIntoView({ block: "nearest" }); }, [sel]);

  const go = (i?: PaletteItem) => { if (!i || i.disabled) return; onClose(); i.run(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(rows.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); go(rows[sel]); }
  };

  return (
    <div className="app-theme fixed inset-0 z-[60] flex items-start justify-center bg-[rgba(19,26,22,.28)] px-3 pt-[10vh] backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label="Search" onKeyDown={onKey} className="nx-pop flex max-h-[76vh] w-full max-w-[600px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_1px_var(--border),0_24px_60px_-16px_rgba(19,26,22,.32)]">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] px-4">
          <Search className="h-[18px] w-[18px] shrink-0 text-[var(--text-subtle)]" />
          <input
            ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={placeholder}
            aria-controls="cmdk-list" aria-activedescendant={rows[sel] ? `cmdk-${rows[sel].id}` : undefined}
            style={{ outline: "none", boxShadow: "none" }} className="h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)]"
          />
          {q && <button onClick={() => { setQ(""); inputRef.current?.focus(); }} className="ty-label rounded-md px-2 py-1 text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">Clear</button>}
        </div>

        <div id="cmdk-list" role="listbox" ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {rows.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="ty-body ty-500 ty-ink">Nothing matches “{q.trim()}”</p>
              {emptyHint && <p className="ty-note ty-muted mt-1">{emptyHint}</p>}
            </div>
          )}
          {rows.map((i, idx) => {
            const head = idx === 0 || rows[idx - 1].group !== i.group ? i.group : null;
            const on = idx === sel;
            const Icon = i.icon;
            return (
              <Fragment key={i.group + i.id}>
                {head && <p className="ty-label ty-caps ty-subtle px-2.5 pb-1 pt-3 first:pt-1.5">{head}</p>}
                <button
                  type="button" id={`cmdk-${i.id}`} role="option" aria-selected={on} aria-disabled={i.disabled || undefined} data-index={idx}
                  onMouseMove={() => setSel(idx)} onClick={() => go(i)}
                  className={cn("flex w-full items-center gap-2.5 rounded-[8px] px-2.5 text-left transition-colors", i.sub ? "h-12" : "h-9", on && !i.disabled && "bg-[var(--surface-hover)]", i.disabled && "cursor-default")}
                >
                  {i.mark ? <span className="grid shrink-0 place-items-center" aria-hidden>{i.mark}</span>
                    : <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-[6px] transition-colors", on ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{Icon && <Icon className="h-3.5 w-3.5" />}</span>}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[13.5px] font-medium", i.disabled ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]")}>{i.label}</span>
                    {i.sub && <span className="block truncate text-[12px] text-[var(--text-muted)]">{i.sub}</span>}
                  </span>
                  {i.hint && <span className={cn("ty-label shrink-0 rounded-full px-2 py-0.5", on ? "bg-white text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--border)]" : "text-[var(--text-subtle)]")}>{i.hint}</span>}
                </button>
              </Fragment>
            );
          })}
        </div>

        <div aria-hidden className="ty-label hidden shrink-0 items-center gap-4 border-t border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-2 text-[var(--text-subtle)] sm:flex">
          <span className="inline-flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> Move</span>
          <span className="inline-flex items-center gap-1"><Kbd>↵</Kbd> Open</span>
          <span className="ml-auto inline-flex items-center gap-1"><Kbd>Esc</Kbd> Close</span>
        </div>
      </div>
    </div>
  );
}

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[5px] bg-white px-1 font-sans text-[11px] text-[var(--text-muted)] shadow-[inset_0_0_0_1px_var(--border),0_1px_0_var(--border)]">{children}</kbd>
);
