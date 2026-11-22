"use client";
/**
 * Student/trainer UI primitives, ported from the Neemo company workspace design system
 * (components/ui/Button, Badge, glass/GlassIcon, glass/GlowStatCard, glass/GlowCharts, EmptyState, Tabs).
 * Look lives in app/globals.css (.btn-*, .nx-*, .ty-*); tokens are the --accent / --border / --text-* vars.
 */
import Link from "next/link";
import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { IconType } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- page head (nx-pagehead) ---------- */
export function PageTitle({ title, text, eyebrow, children }: { title: string; text?: string; eyebrow?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-6 nx-pagehead__row">
      <div className="min-w-0">
        {eyebrow && <p className="nx-pagehead__eyebrow">{eyebrow}</p>}
        <h1 className="nx-pagehead__title">{title}</h1>
        {text && <p className="nx-pagehead__desc">{text}</p>}
      </div>
      {children && <div className="nx-pagehead__actions">{children}</div>}
    </header>
  );
}

/* ---------- surfaces ---------- */
export function Card({ children, className, as: Tag = "div", ...rest }: { children: ReactNode; className?: string; as?: "div" | "section"; "aria-label"?: string }) {
  return <Tag {...rest} className={cn("nx-card p-5", className)}>{children}</Tag>;
}
/** Card with a title row and an optional action on the right. */
export function Panel({ title, desc, action, children, className, bodyClass, ...rest }: { title: ReactNode; desc?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string; "aria-label"?: string }) {
  return (
    <section {...rest} className={cn("nx-card", className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0"><h2 className="ty-head ty-ink">{title}</h2>{desc && <p className="ty-note ty-muted mt-0.5">{desc}</p>}</div>
        {action}
      </div>
      <div className={cn("p-5 pt-4", bodyClass)}>{children}</div>
    </section>
  );
}
export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn("ty-label ty-caps ty-subtle", className)}>{children}</div>;

/* ---------- buttons ---------- */
type BtnVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";
export const btn = (variant: BtnVariant = "primary", size: BtnSize = "md", className?: string) => cn("btn-base", `btn-${variant}`, `btn-${size}`, className);
export function Button({ variant = "primary", size = "md", className, icon: I, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize; icon?: IconType }) {
  return <button {...rest} className={btn(variant, size, className)}>{I && <I className="h-4 w-4" />}{children}</button>;
}
export function LinkButton({ href, variant = "primary", size = "md", className, icon: I, children, external }: { href: string; variant?: BtnVariant; size?: BtnSize; className?: string; icon?: IconType; children: ReactNode; external?: boolean }) {
  const cls = btn(variant, size, className);
  const inner = <>{I && <I className="h-4 w-4" />}{children}</>;
  return external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

/* ---------- badge: the chip that carries a state ---------- */
export type Tone = "accent" | "neutral" | "success" | "warning" | "danger" | "info";
const TONE: Record<Tone, string> = {
  accent: "bg-[var(--accent-subtle)] text-[var(--accent-text)]",
  neutral: "bg-[var(--surface-sunken)] text-[var(--text-muted)]",
  success: "bg-[var(--success-subtle)] text-[var(--success)]",
  warning: "bg-[var(--warning-subtle)] text-[var(--warning)]",
  danger: "bg-[var(--danger-subtle)] text-[var(--danger)]",
  info: "bg-[var(--info-subtle)] text-[var(--info)]",
};
export const Badge = ({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) => (
  <span className={cn("ty-label ty-600 inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-full px-2.5", TONE[tone], className)}>{children}</span>
);

/* ---------- glass icon orb (with the orbiting accent comet) ---------- */
const ORB = { sm: "size-9", md: "size-11", lg: "size-14" } as const;
const ORB_ICON = { sm: "h-4 w-4", md: "h-[19px] w-[19px]", lg: "h-6 w-6" } as const;
export function GlassIcon({ icon: I, size = "md", tone = "glass" }: { icon: IconType; size?: keyof typeof ORB; tone?: "glass" | "accent" }) {
  return (
    <span aria-hidden className={cn("relative grid shrink-0 place-items-center rounded-full p-px [filter:drop-shadow(0_6px_10px_color-mix(in_srgb,var(--accent)_14%,transparent))]", ORB[size])}>
      <span className="absolute inset-0 rounded-full bg-[var(--border)]" />
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,var(--accent-soft)_310deg,var(--accent)_350deg,transparent_360deg)] motion-safe:animate-[nx-spin_5s_linear_infinite] group-hover/spot:[animation-duration:1.8s]" />
      </span>
      <span className={cn(
        "relative grid size-full place-items-center rounded-full transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,.9),inset_0_-3px_6px_rgba(17,17,31,.07)]",
        tone === "accent"
          ? "bg-[radial-gradient(circle_at_32%_26%,var(--accent-soft)_0%,var(--accent)_60%,var(--accent-active)_100%)] text-white"
          : "bg-[radial-gradient(circle_at_32%_26%,#fff_0%,#fff_38%,var(--surface-sunken)_100%)] text-[var(--text-secondary)] group-hover/spot:text-[var(--accent)]"
      )}>
        <span className="pointer-events-none absolute left-[18%] top-[10%] h-[34%] w-[52%] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.85),transparent)] opacity-80" />
        <I className={cn("relative", ORB_ICON[size])} />
      </span>
    </span>
  );
}

/* ---------- glow charts ---------- */
const GLOW = "[filter:drop-shadow(0_4px_10px_color-mix(in_srgb,var(--accent)_28%,transparent))]";
export function Meter({ pct, className, tone = "accent" }: { pct: number; className?: string; tone?: "accent" | "success" }) {
  const still = useReducedMotion();
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div className={cn("h-2 w-full rounded-full bg-[var(--surface-sunken)]", className)} role="progressbar" aria-valuenow={Math.round(w)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div className={cn("h-full rounded-full", tone === "success" ? "bg-[var(--success)]" : cn("bg-[var(--accent)]", GLOW))} initial={{ width: still ? `${w}%` : "0%" }} animate={{ width: `${w}%` }} transition={{ duration: 1.1, ease: EASE }} />
    </div>
  );
}
/** Old name kept for the pages that already use it. */
export const Bar = ({ value, className, tone }: { value: number; className?: string; tone?: "dark" | "ok" }) => <Meter pct={value} className={className} tone={tone === "ok" ? "success" : "accent"} />;

export function Spark({ values, className }: { values: number[]; className?: string }) {
  const still = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => ({ x: (i / Math.max(1, values.length - 1)) * 100, y: 34 - ((v - min) / (max - min || 1)) * 28 }));
  const line = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <div className={cn("relative h-10 w-full", className)} aria-hidden>
      <motion.div className="size-full" initial={{ clipPath: still ? "inset(-20% 0% -20% 0)" : "inset(-20% 100% -20% 0)" }} animate={{ clipPath: "inset(-20% 0% -20% 0)" }} transition={{ duration: 1.1, ease: EASE }}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="block size-full overflow-visible">
          <defs><linearGradient id={`a-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
          <path d={`${line} L 100 40 L 0 40 Z`} fill={`url(#a-${id})`} />
          <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={GLOW} />
        </svg>
      </motion.div>
      <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent)] bg-white shadow-[0_0_0_4px_var(--accent-ring)]" style={{ left: `${last.x}%`, top: `${(last.y / 40) * 100}%` }} />
    </div>
  );
}

/* ---------- KPI card (GlowStatCard) ---------- */
export function StatCard({ label, hint, icon, value, of, delta, trend, meter, note, href }: {
  label: string; hint?: string; icon: IconType; value: ReactNode; of?: string;
  delta?: { label: string; good: boolean }; trend?: number[]; meter?: { pct: number; label: string }; note?: ReactNode; href?: string;
}) {
  const hasMark = !!(trend?.length || meter);
  const onMove = (e: React.MouseEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`); };
  const body = (
    <div onMouseMove={onMove} className={cn("nx-card group/spot relative flex h-full min-h-[136px] min-w-0 flex-col overflow-hidden p-4 sm:min-h-[164px] sm:p-5", hasMark && "bg-[radial-gradient(90%_70%_at_100%_0%,color-mix(in_srgb,var(--accent-subtle)_80%,transparent)_0%,transparent_60%),var(--surface)]", href && "transition-shadow hover:shadow-[0_0_0_1px_var(--border-strong),0_2px_6px_rgba(17,17,31,.06)]")}>
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 bg-[radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_srgb,var(--accent)_8%,transparent),transparent_70%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <p className="ty-body ty-500 ty-ink truncate" title={hint}>{label}</p>
        <GlassIcon icon={icon} size="sm" />
      </div>
      <p className="relative mt-1 flex items-baseline gap-1"><span className="ty-figure ty-ink">{value}</span>{of && <span className="ty-note ty-subtle">/ {of}</span>}</p>
      <div className="relative mt-auto pt-4">
        {!hasMark ? (
          <div className="flex min-h-10 items-end"><p className="ty-note ty-muted flex gap-1.5"><span aria-hidden className="mt-[6px] size-1.5 shrink-0 rounded-full bg-[var(--border-strong)]" /><span>{note}</span></p></div>
        ) : (
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-4">
            {delta ? <span className={cn("ty-label mb-0.5 inline-flex items-center whitespace-nowrap rounded-full px-1.5 py-0.5", delta.good ? "bg-[var(--success-subtle)] text-[var(--success)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{delta.label}</span> : <span />}
            {meter ? (
              <div className="flex h-10 flex-col justify-end gap-1.5"><p className="ty-label ty-mono ty-subtle text-right">{meter.label}</p><Meter pct={meter.pct} /></div>
            ) : <Spark values={trend ?? []} />}
          </div>
        )}
      </div>
    </div>
  );
  return href ? <Link href={href} className="block h-full rounded-[var(--radius-lg)]">{body}</Link> : body;
}

/* ---------- tabs with counts ---------- */
export function Tabs<T extends string>({ tabs, value, onChange, className, label }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; className?: string; label: string }) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex gap-5 overflow-x-auto", className)}>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)} className={cn("relative flex shrink-0 items-center gap-1.5 pb-2.5 pt-1 text-[13px] font-medium transition-colors", on ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]")}>
            {t.label}
            {t.count !== undefined && <span className={cn("ty-label ty-mono rounded-full px-1.5", on ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{t.count}</span>}
            {on && <motion.span layoutId={`tab-${label}`} className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--accent)]" />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- empty state ---------- */
export function EmptyState({ icon: I, title, text, action, compact }: { icon: IconType; title: string; text?: string; action?: ReactNode; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center text-center", compact ? "px-6 py-8" : "px-6 py-14")}>
      <span className="grid size-10 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)]"><I className="h-5 w-5" /></span>
      <p className="ty-subject ty-ink mt-3">{title}</p>
      {text && <p className="ty-body ty-muted mt-1 max-w-sm">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Circular progress with content in the middle. */
export function Ring({ value, size = 132, stroke = 12, children, track = "var(--surface-sunken)", color = "var(--accent)" }: { value: number; size?: number; stroke?: number; children?: ReactNode; track?: string; color?: string }) {
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, Math.max(0, value)) / 100)} className={GLOW} style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

/** Stat kept for older call sites. */
export function Stat({ icon, label, value, sub }: { icon?: ReactNode; label: string; value: ReactNode; sub?: string }) {
  return (
    <Card>
      <div className="flex items-center justify-between"><span className="ty-body ty-500 ty-ink">{label}</span>{icon && <span className="ty-subtle">{icon}</span>}</div>
      <div className="ty-figure ty-ink mt-2">{value}</div>
      {sub && <div className="ty-note ty-muted mt-2">{sub}</div>}
    </Card>
  );
}
