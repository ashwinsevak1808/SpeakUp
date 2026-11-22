"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check, X } from "@/components/learn/icons";
import { Avatar } from "@/components/learn/Avatar";
import { Badge, btn } from "@/components/learn/ui";
import { supabase } from "@/lib/supabase/client";
import type { Item } from "@/lib/path-data";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type EnrolReq, type Student, type StudentStatus } from "./data";

export const StatusBadge = ({ status }: { status: StudentStatus }) => (
  <Badge tone={status === "enrolled" ? "accent" : "neutral"} className={status === "requested" ? "shadow-[inset_0_0_0_1px_var(--border-accent)] !bg-white !text-[var(--accent-text)]" : undefined}>{STATUS_LABEL[status]}</Badge>
);

export function Person({ p, href = true, sub }: { p: Pick<Student, "id" | "name" | "email" | "avatar">; href?: boolean; sub?: ReactNode }) {
  const body = (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={p.name} avatar={p.avatar} size={32} />
      <span className="min-w-0"><span className="ty-body ty-500 ty-ink block truncate">{p.name}</span><span className="ty-note ty-muted block truncate">{sub ?? p.email}</span></span>
    </span>
  );
  return href ? <Link href={`/admin/students/${p.id}`} className="block min-w-0 rounded-md hover:[&_.ty-ink]:text-[var(--accent-text)]">{body}</Link> : body;
}

/** Approve / decline an enrolment request (the database enrols the student in the same step). */
export function ReqActions({ req, onDone, compact }: { req: EnrolReq; onDone: () => void; compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function act(approve: boolean) {
    if (!approve && !confirm(`Decline ${req.student?.name ?? "this"}'s request?`)) return;
    setBusy(true); setErr("");
    const { data, error } = await supabase().rpc("handle_enrol_request", { p_id: req.id, p_approve: approve, p_note: null });
    setBusy(false);
    if (error || data !== "ok") setErr(error?.message ?? (data === "done" ? "Already handled." : "Could not update.")); else onDone();
  }
  if (req.status !== "pending") return <Badge tone={req.status === "approved" ? "accent" : "neutral"}>{req.status[0].toUpperCase() + req.status.slice(1)}</Badge>;
  return (
    <span className="flex flex-wrap items-center justify-end gap-2">
      {err && <span role="alert" className="ty-note text-[var(--danger)]">{err}</span>}
      <button disabled={busy} onClick={() => act(false)} className={btn("ghost", "sm")} aria-label={`Decline ${req.student?.name ?? ""}`}>{compact ? <X className="h-4 w-4" /> : "Decline"}</button>
      <button disabled={busy} onClick={() => act(true)} className={btn("primary", "sm")}><Check className="h-4 w-4" />{compact ? "Approve" : "Approve and enrol"}</button>
    </span>
  );
}

export const itemText = (i?: Item) => !i ? "" : i.t === "say" ? `Say: ${i.text}` : i.t === "order" ? i.prompt : i.q;

/** Download rows as a CSV file (opens in Excel / Google Sheets). */
export function downloadCsv(name: string, rows: (string | number | null | undefined)[][]) {
  const esc = (v: string | number | null | undefined) => { const s = v === null || v === undefined ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const blob = new Blob(["﻿" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const input = "h-9 w-full min-w-0 rounded-[var(--radius-md)] bg-white px-3 text-[13px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)] outline-none placeholder:text-[var(--text-subtle)] focus:shadow-[inset_0_0_0_1.5px_var(--accent)]";
export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => <th className={cn("ty-label ty-caps ty-subtle px-4 py-2.5 text-left font-medium", className)}>{children}</th>;
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
