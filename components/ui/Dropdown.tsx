"use client";
/**
 * Dropdown: a value picked from a short list. Ported from the Neemo company design system
 * (components/ui/Dropdown.tsx + Popover.tsx). The browser's native <select> list cannot be styled,
 * so every picker here opens this menu instead: same look in the student app, admin panel and website.
 *
 *  - Dropdown    options + value + onChange(value)
 *  - SelectMenu  drop-in for <select> (same value / onChange(e) / <option> children)
 *
 * The open list is rendered into document.body (so a card's overflow cannot clip it), positioned under
 * the trigger, flipped above it when there is no room, and closed by Escape, outside click or a pick.
 * Look lives in app/globals.css (.ddn-*).
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "@/components/learn/icons";
import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string = string> { value: T; label: string; icon?: React.ReactNode; description?: string }

const GAP = 6, EDGE = 8;

function usePanel(open: boolean) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const measure = useCallback(() => {
    const t = triggerRef.current, p = panelRef.current; if (!t || !p) return;
    const r = t.getBoundingClientRect(); const vw = window.innerWidth, vh = window.innerHeight;
    const width = Math.max(r.width, p.scrollWidth > r.width ? Math.min(p.scrollWidth, 320) : r.width);
    const h = p.offsetHeight;
    const below = r.bottom + GAP + h <= vh - EDGE || r.top - GAP - h < EDGE;
    const top = below ? r.bottom + GAP : r.top - GAP - h;
    const left = Math.min(Math.max(EDGE, r.left), vw - width - EDGE);
    setPos({ top: Math.max(EDGE, top), left, width });
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    measure();
    window.addEventListener("scroll", measure, true); window.addEventListener("resize", measure);
    return () => { window.removeEventListener("scroll", measure, true); window.removeEventListener("resize", measure); };
  }, [open, measure]);
  return { triggerRef, panelRef, pos };
}

export function Dropdown<T extends string = string>({
  options, value, onChange, placeholder = "Select…", className, size = "md", block = false, disabled = false, invalid = false,
  id, name, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, onBlur,
}: {
  options: readonly DropdownOption<T>[]; value: T | ""; onChange: (v: T) => void; placeholder?: string; className?: string;
  /** sm = filter row, md = form control (admin/app), lg = website form field. */
  size?: "sm" | "md" | "lg"; block?: boolean; disabled?: boolean; invalid?: boolean; id?: string; name?: string;
  "aria-label"?: string; "aria-labelledby"?: string; "aria-describedby"?: string; onBlur?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { triggerRef, panelRef, pos } = usePanel(open);
  const selected = options.find((o) => o.value === value);
  const close = useCallback((focus = true) => { setOpen(false); if (focus) triggerRef.current?.focus(); }, [triggerRef]);

  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(panelRef.current?.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]") ?? []);
    (items().find((b) => b.getAttribute("aria-checked") === "true") ?? items()[0])?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); close(); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      const list = items(); const i = list.indexOf(document.activeElement as HTMLButtonElement);
      const next = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : e.key === "ArrowDown" ? Math.min(list.length - 1, i + 1) : Math.max(0, i - 1);
      list[next]?.focus();
    };
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return; close(false); onBlur?.(); };
    window.addEventListener("keydown", onKey); window.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onDown); };
  }, [open, close, panelRef, triggerRef, onBlur]);

  return (
    <>
      <button
        ref={triggerRef} type="button" id={id} name={name} disabled={disabled}
        aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); } }}
        className={cn("ddn", size === "sm" && "ddn-sm", size === "lg" && "ddn-lg", block && "ddn-block", invalid && "ddn-invalid", !selected && "ddn-empty", className)}
      >
        <span className="ddn-value">{selected?.icon}<span className="ddn-label">{selected?.label ?? placeholder}</span></span>
        <ChevronDown className="ddn-caret h-3.5 w-3.5" />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={panelRef} className="ddn-pop" style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, minWidth: pos?.width, visibility: pos ? "visible" : "hidden" }}>
          <div role="menu" aria-label={ariaLabel ?? placeholder} className="ddn-list">
            {options.map((o) => {
              const on = o.value === value;
              return (
                <button key={o.value} type="button" role="menuitemradio" aria-checked={on} onClick={() => { onChange(o.value); close(); }} className={cn("ddn-item", on && "ddn-item-on")}>
                  {o.icon && <span className="ddn-item-icon">{o.icon}</span>}
                  <span className="ddn-item-text"><span className="ddn-item-label">{o.label}</span>{o.description && <span className="ddn-item-desc">{o.description}</span>}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ── SelectMenu: the native <select> API, drawn by Dropdown ── */
type OptionProps = { value?: string | number; children?: React.ReactNode; disabled?: boolean };
const textOf = (node: React.ReactNode): string => React.Children.toArray(node).map((n) => (typeof n === "string" || typeof n === "number" ? String(n) : "")).join("");

export function SelectMenu({ value, onChange, children, className, size, block = true, disabled, id, invalid, onBlur, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy }: {
  value: string | number; onChange?: (e: { target: { value: string } }) => void; children: React.ReactNode; className?: string;
  size?: "sm" | "md" | "lg"; block?: boolean; disabled?: boolean; id?: string; invalid?: boolean; onBlur?: () => void; "aria-label"?: string; "aria-describedby"?: string;
}) {
  const all = React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<OptionProps>(child) || child.type !== "option" || child.props.disabled) return [];
    const label = textOf(child.props.children);
    return [{ value: String(child.props.value ?? label), label }];
  });
  const placeholder = all.find((o) => o.value === "")?.label; // <option value="">Choose…</option> becomes the placeholder
  const options: DropdownOption[] = all.filter((o) => o.value !== "");
  return <Dropdown options={options} value={String(value)} placeholder={placeholder} onChange={(v) => onChange?.({ target: { value: v } })}
    className={className} size={size} block={block} disabled={disabled} id={id} invalid={invalid} onBlur={onBlur} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} />;
}
