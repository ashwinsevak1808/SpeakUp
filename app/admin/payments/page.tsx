"use client";
/** Online payments (Razorpay): what came in, for what, and anything that needs a refund. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ShieldCheck, Zap } from "@/components/learn/icons";
import { Badge, EmptyState, PageTitle, StatCard, Tabs, btn } from "@/components/learn/ui";
import { supabase } from "@/lib/supabase/client";
import { usePaymentsEnabled } from "@/lib/pay";
import { Person, Td, Th, downloadCsv } from "@/components/admin/bits";
import { ago, fmtDayTime, useAdmin } from "@/components/admin/data";

type Pay = { id: string; user_id: string; purpose: "enrol" | "session"; amount: number; status: "created" | "paid" | "refund_needed" | "refunded" | "failed"; order_id: string | null; payment_id: string | null; note: string | null; created_at: string; paid_at: string | null; sessions: { title: string; start_at: string } | null };
type F = "paid" | "refund_needed" | "created" | "all";
const LABEL: Record<Pay["status"], string> = { created: "Not completed", paid: "Paid", refund_needed: "Refund needed", refunded: "Refunded", failed: "Failed" };

export default function Payments() {
  const { people } = useAdmin();
  const online = usePaymentsEnabled();
  const [rows, setRows] = useState<Pay[] | null>(null);
  const [f, setF] = useState<F>("paid");
  const [err, setErr] = useState("");
  const load = useCallback(() => { supabase().from("payments").select("*, sessions(title, start_at)").order("created_at", { ascending: false }).limit(2000).then(({ data, error }) => { if (error) setErr(error.message); setRows((data as Pay[]) ?? []); }); }, []);
  useEffect(() => { load(); }, [load]);

  const list = useMemo(() => (rows ?? []).filter((p) => f === "all" || p.status === f || (f === "paid" && p.status === "refunded")), [rows, f]);
  const paid = (rows ?? []).filter((p) => p.status === "paid");
  const month = new Date().toISOString().slice(0, 7);
  const total = paid.reduce((n, p) => n + p.amount, 0);
  const thisMonth = paid.filter((p) => (p.paid_at ?? "").startsWith(month)).reduce((n, p) => n + p.amount, 0);
  const count = (k: F) => (rows ?? []).filter((p) => k === "all" || p.status === k).length;

  async function markRefunded(p: Pay) {
    if (!confirm(`Mark ₹${p.amount} as refunded? Do the refund in the Razorpay dashboard first.`)) return;
    const { error } = await supabase().from("payments").update({ status: "refunded" }).eq("id", p.id);
    if (error) setErr(error.message); else load();
  }

  return (
    <div className="nx-page">
      <PageTitle eyebrow={online === false ? "Online payment is off" : online ? "Online payment is on · Razorpay" : " "} title="Payments" text="Course fees and private sessions paid online. Students who pay are enrolled or booked automatically.">
        <button disabled={!list.length} onClick={() => downloadCsv(`payments-${new Date().toISOString().slice(0, 10)}.csv`, [["Date", "Student", "Email", "For", "Amount (₹)", "Status", "Razorpay payment", "Razorpay order"], ...list.map((p) => { const s = people.find((x) => x.id === p.user_id); return [fmtDayTime(p.paid_at ?? p.created_at), s?.name, s?.email, p.purpose === "enrol" ? "Course" : p.sessions?.title ?? "Private session", p.amount, LABEL[p.status], p.payment_id, p.order_id]; })])} className={btn("secondary", "md")}>Export CSV</button>
      </PageTitle>
      {err && <p role="alert" className="nx-card mb-4 p-4 text-sm text-[var(--danger)]">{err}</p>}
      {online === false && (
        <section className="nx-glass mb-6 p-5">
          <div className="ty-subject ty-ink">Switch on online payment</div>
          <ol className="ty-body ty-secondary mt-2 list-decimal space-y-1 pl-5">
            <li>In Razorpay, copy your Key Id and Key Secret (Settings, API Keys) and create a webhook to <span className="ty-mono">/api/pay/webhook</span>.</li>
            <li>Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET to the website settings (.env.local and your host).</li>
            <li>Run <span className="ty-mono">npm run db:payments</span> once. Until then students use Request enrolment and you approve them.</li>
          </ol>
        </section>
      )}

      <section aria-label="Totals" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Received this month" icon={Zap} value={`₹${thisMonth.toLocaleString("en-IN")}`} note={`${paid.filter((p) => (p.paid_at ?? "").startsWith(month)).length} payments`} />
        <StatCard label="Received in total" icon={ShieldCheck} value={`₹${total.toLocaleString("en-IN")}`} note={`${paid.length} payments`} />
        <StatCard label="Refunds to handle" icon={Check} value={count("refund_needed")} note="Paid for a slot someone else took first" />
      </section>

      <section className="nx-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 pt-3">
          <Tabs label="Filter payments" value={f} onChange={setF} tabs={[{ id: "paid", label: "Paid", count: count("paid") + count("refunded" as F) }, { id: "refund_needed", label: "Refund needed", count: count("refund_needed") }, { id: "created", label: "Not completed", count: count("created") }, { id: "all", label: "All", count: count("all") }]} />
        </div>
        {!rows ? <div className="m-5 h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" /> : list.length === 0 ? (
          <EmptyState icon={Zap} title="No payments here" text={f === "created" ? "Payments students started but did not finish show here." : "Online payments appear here as soon as they succeed."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead className="bg-[var(--surface-subtle)]"><tr><Th>Student</Th><Th>For</Th><Th>Amount</Th><Th>Status</Th><Th>When</Th><Th className="text-right">Razorpay</Th></tr></thead>
              <tbody>
                {list.map((p) => {
                  const s = people.find((x) => x.id === p.user_id);
                  return (
                    <tr key={p.id} className="border-t border-[var(--border)]">
                      <Td className="max-w-[240px]">{s ? <Person p={s} /> : "Deleted account"}</Td>
                      <Td className="text-[var(--text-secondary)]">{p.purpose === "enrol" ? "Course fee" : p.sessions?.title ?? "Private session"}{p.note && <div className="ty-note ty-muted">{p.note}</div>}</Td>
                      <Td className="ty-mono text-[var(--text-primary)]">₹{p.amount.toLocaleString("en-IN")}</Td>
                      <Td><Badge tone={p.status === "paid" ? "accent" : p.status === "refund_needed" ? "danger" : "neutral"}>{LABEL[p.status]}</Badge></Td>
                      <Td className="whitespace-nowrap text-[var(--text-muted)]"><span title={fmtDayTime(p.paid_at ?? p.created_at)}>{ago(p.paid_at ?? p.created_at)}</span></Td>
                      <Td className="text-right">{p.status === "refund_needed" ? <button onClick={() => markRefunded(p)} className={btn("secondary", "sm")}>Mark refunded</button> : <span className="ty-mono ty-note ty-subtle">{p.payment_id ?? "–"}</span>}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
