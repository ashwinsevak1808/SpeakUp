"use client";
/** Every website form (demo class, ebook, corporate, level test, contact), with a simple follow-up status. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Trash2, Zap } from "@/components/learn/icons";
import { EmptyState, PageTitle, Tabs, btn } from "@/components/learn/ui";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { downloadCsv, input } from "@/components/admin/bits";
import { ago, fmtDayTime, useAdmin, waLink } from "@/components/admin/data";
import { SelectMenu } from "@/components/ui/Dropdown";

type Status = "new" | "contacted" | "converted" | "closed";
type Lead = { id: number; kind: string; name: string | null; email: string | null; phone: string | null; data: Record<string, unknown>; status: Status; staff_note: string | null; created_at: string };
const STATUS: { id: Status; label: string }[] = [{ id: "new", label: "New" }, { id: "contacted", label: "Contacted" }, { id: "converted", label: "Joined" }, { id: "closed", label: "Closed" }];
const kindLabel = (k: string) => k.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default function Leads() {
  const { reload: reloadCounts } = useAdmin();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [f, setF] = useState<Status | "all">("new");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const load = useCallback(() => { supabase().from("leads").select("*").order("created_at", { ascending: false }).limit(1000).then(({ data, error }) => { if (error) setErr(error.message); setLeads((data as Lead[]) ?? []); }); }, []);
  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (leads ?? []).filter((l) => (f === "all" || l.status === f) && (!t || [l.name, l.email, l.phone, l.kind].some((x) => x?.toLowerCase().includes(t))));
  }, [leads, f, q]);
  const count = (k: Status | "all") => (leads ?? []).filter((l) => k === "all" || l.status === k).length;

  async function patch(id: number, p: Partial<Lead>) {
    setLeads((ls) => ls?.map((l) => (l.id === id ? { ...l, ...p } : l)) ?? null);
    const { error } = await supabase().from("leads").update(p).eq("id", id);
    if (error) { setErr(error.message); load(); } else reloadCounts();
  }
  async function remove(id: number) {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase().from("leads").delete().eq("id", id);
    if (error) setErr(error.message); else { setLeads((ls) => ls?.filter((l) => l.id !== id) ?? null); reloadCounts(); }
  }

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`${count("new")} new · ${count("all")} total`} title="Leads" text="People who filled a form on the website. Call or WhatsApp them, then mark how it went.">
        <button disabled={!rows.length} onClick={() => downloadCsv(`leads-${new Date().toISOString().slice(0, 10)}.csv`, [["When", "Form", "Name", "Email", "Phone", "Status", "Note", "Details"], ...rows.map((l) => [fmtDayTime(l.created_at), l.kind, l.name, l.email, l.phone, l.status, l.staff_note, JSON.stringify(l.data)])])} className={btn("secondary", "md")}>Export CSV</button>
      </PageTitle>
      {err && <p role="alert" className="nx-card mb-4 p-4 text-sm text-[var(--danger)]">{err}</p>}
      <section className="nx-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 pt-3 lg:flex-row lg:items-end lg:justify-between">
          <Tabs label="Filter leads" value={f} onChange={setF} tabs={[...STATUS.map((s) => ({ id: s.id, label: s.label, count: count(s.id) })), { id: "all" as const, label: "All", count: count("all") }]} />
          <label className="relative pb-3 lg:w-64"><span className="sr-only">Search leads</span><Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-subtle)]" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone" className={cn(input, "pl-8")} /></label>
        </div>
        {!leads ? <div className="m-5 h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" /> : rows.length === 0 ? (
          <EmptyState icon={Zap} title="No leads here" text="Website forms (book a demo, free ebook, corporate, level test) land in this list." />
        ) : (
          <ul>
            {rows.map((l) => {
              const extra = Object.entries(l.data ?? {}).filter(([, v]) => v !== "" && v !== null && v !== undefined);
              return (
                <li key={l.id} className="border-t border-[var(--border)] first:border-t-0">
                  <div className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <button onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-[var(--text-subtle)] transition-transform", open === l.id && "rotate-180")} />
                      <span className="min-w-0"><span className="ty-body ty-500 ty-ink block truncate">{l.name || l.email || l.phone || "No name"}</span><span className="ty-note ty-muted block truncate">{kindLabel(l.kind)} · {ago(l.created_at)}{l.email && l.name ? ` · ${l.email}` : ""}</span></span>
                    </button>
                    {l.phone && <a href={waLink(l.phone, `Hi ${l.name?.split(" ")[0] ?? ""}! This is SpeakUp. Thanks for getting in touch.`)} target="_blank" rel="noopener" className={btn("ghost", "sm")}>WhatsApp</a>}
                    {l.phone && <a href={`tel:${l.phone}`} className={btn("ghost", "sm", "hidden sm:inline-flex")}>Call</a>}
                    <label><span className="sr-only">Status</span><SelectMenu aria-label="Status" block={false} value={l.status} onChange={(e) => patch(l.id, { status: e.target.value as Status })} className={cn("min-w-[120px]", l.status === "new" && "!shadow-[inset_0_0_0_1.5px_var(--accent)] font-semibold text-[var(--accent-text)]")}>{STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</SelectMenu></label>
                  </div>
                  {open === l.id && (
                    <div className="grid gap-4 bg-[var(--surface-subtle)] px-5 py-4 sm:grid-cols-2">
                      <dl className="nx-facts">
                        <div><dt>Received</dt><dd>{fmtDayTime(l.created_at)}</dd></div>
                        {l.email && <div><dt>Email</dt><dd><a href={`mailto:${l.email}`} className="hover:text-[var(--accent-text)]">{l.email}</a></dd></div>}
                        {l.phone && <div><dt>Phone</dt><dd>{l.phone}</dd></div>}
                        {extra.map(([k, v]) => <div key={k}><dt className="capitalize">{k.replace(/([A-Z])/g, " $1")}</dt><dd className="max-w-[60%] text-right">{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd></div>)}
                      </dl>
                      <div>
                        <label htmlFor={`n-${l.id}`} className="ty-label ty-subtle mb-1 block">Follow-up note</label>
                        <textarea id={`n-${l.id}`} defaultValue={l.staff_note ?? ""} onBlur={(e) => e.target.value !== (l.staff_note ?? "") && patch(l.id, { staff_note: e.target.value.trim() || null })} rows={3} placeholder="Called on Monday, will join the Saturday demo." className={cn(input, "h-auto py-2")} />
                        <button onClick={() => remove(l.id)} className={btn("ghost", "sm", "mt-2")}><Trash2 className="h-3.5 w-3.5" />Delete lead</button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
