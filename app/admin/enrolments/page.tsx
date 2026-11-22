"use client";
/** Enrolment requests from the Enrol button: approve once paid, decline, or look back at history. */
import { useState } from "react";
import { ShieldCheck } from "@/components/learn/icons";
import { EmptyState, PageTitle, Tabs } from "@/components/learn/ui";
import { Person, ReqActions, Td, Th } from "@/components/admin/bits";
import { ago, fmtDayTime, useAdmin, waLink, type EnrolReq } from "@/components/admin/data";

type F = EnrolReq["status"] | "all";

export default function Enrolments() {
  const { requests, people, loaded, reload } = useAdmin();
  const [f, setF] = useState<F>("pending");
  const rows = requests.filter((r) => f === "all" || r.status === f);
  const count = (k: F) => requests.filter((r) => k === "all" || r.status === k).length;
  const total = requests.filter((r) => r.status === "approved").reduce((n, r) => n + (r.amount ?? 0), 0);

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`${count("pending")} waiting · ₹${total.toLocaleString("en-IN")} approved so far`} title="Enrolments" text="Students ask to enrol from the app. Collect the payment (UPI or bank transfer), then approve: their account unlocks immediately." />
      <section className="nx-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 pt-3">
          <Tabs label="Filter requests" value={f} onChange={setF} tabs={[{ id: "pending", label: "Waiting", count: count("pending") }, { id: "approved", label: "Approved", count: count("approved") }, { id: "declined", label: "Declined", count: count("declined") }, { id: "cancelled", label: "Cancelled", count: count("cancelled") }, { id: "all", label: "All", count: count("all") }]} />
        </div>
        {!loaded ? <div className="m-5 h-32 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" /> : rows.length === 0 ? (
          <EmptyState icon={ShieldCheck} title={f === "pending" ? "No requests waiting" : "Nothing here"} text="When a student presses Enrol in the app, their request appears here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead className="bg-[var(--surface-subtle)]"><tr><Th>Student</Th><Th>Plan</Th><Th>Amount</Th><Th>Note</Th><Th>Requested</Th><Th className="text-right">Action</Th></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const p = people.find((x) => x.id === r.user_id);
                  return (
                    <tr key={r.id} className="border-t border-[var(--border)]">
                      <Td className="max-w-[260px]">{p ? <Person p={p} sub={p.phone ? <a href={waLink(p.phone)} target="_blank" rel="noopener" className="hover:text-[var(--accent-text)]">{p.phone} · WhatsApp</a> : p.email} /> : r.student?.name}</Td>
                      <Td className="text-[var(--text-secondary)]">{r.plan}</Td>
                      <Td className="ty-mono text-[var(--text-primary)]">₹{(r.amount ?? 0).toLocaleString("en-IN")}</Td>
                      <Td className="max-w-[220px] text-[var(--text-secondary)]">{r.student_note ?? <span className="text-[var(--text-subtle)]">–</span>}{r.staff_note && <div className="ty-note ty-muted">Staff: {r.staff_note}</div>}</Td>
                      <Td className="whitespace-nowrap text-[var(--text-muted)]" ><span title={fmtDayTime(r.created_at)}>{ago(r.created_at)}</span>{r.handled_at && <div className="ty-label ty-subtle">handled {ago(r.handled_at)}</div>}</Td>
                      <Td className="text-right"><ReqActions req={r} onDone={reload} /></Td>
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
