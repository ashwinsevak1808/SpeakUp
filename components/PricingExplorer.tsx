"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BATCHES } from "@/lib/data";
import { cn } from "@/lib/utils";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function PricingExplorer() {
  const courses = useMemo(() => ["All", ...Array.from(new Set(BATCHES.map((b) => b.course)))], []);
  const [filter, setFilter] = useState("All");
  const [student, setStudent] = useState(false);
  const list = BATCHES.filter((b) => filter === "All" || b.course === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={cn("rounded-md border px-4 py-1.5 text-sm font-medium transition-colors", filter === c ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-brand-800 hover:bg-brand-50")}>
              {c}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-brand-900">
          <input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} className="h-4 w-4 accent-brand-700" />
          Show student price (10% off)
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="hidden grid-cols-[1.6fr_1.2fr_1fr_0.8fr_0.9fr_8rem] gap-4 bg-brand-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white md:grid">
          <span>Course and batch</span><span>Schedule</span><span>Duration</span><span>Starts</span><span>Fee</span><span className="w-32" />
        </div>
        <ul className="divide-y divide-line">
          {list.map((b) => {
            const fee = b.fee ? (student ? Math.round(b.fee * 0.9) : b.fee) : null;
            const low = b.mode !== "Custom" && b.seats <= 4;
            return (
              <li key={b.course + b.name} className="grid items-center gap-x-4 gap-y-2 px-6 py-5 md:grid-cols-[1.6fr_1.2fr_1fr_0.8fr_0.9fr_8rem]">
                <div>
                  <div className="font-display font-semibold text-brand-900">{b.course}</div>
                  <div className="text-sm text-muted">{b.name}{b.mode !== "Custom" && <span className={cn("ml-2 font-medium", low ? "text-brand-700" : "text-muted")}>{low ? `Only ${b.seats} seats left` : `${b.seats} seats left`}</span>}</div>
                </div>
                <div className="text-sm"><div className="font-medium text-ink">{b.days}</div><div className="text-muted">{b.time}</div></div>
                <div className="text-sm text-ink"><span className="mr-2 text-muted md:hidden">Duration:</span>{b.duration}</div>
                <div className="text-sm text-ink"><span className="mr-2 text-muted md:hidden">Starts:</span>{b.start}</div>
                <div className="font-display text-lg font-bold text-brand-900">
                  {fee !== null ? <>{student && b.fee && <span className="mr-2 text-sm font-normal text-muted line-through">{inr(b.fee)}</span>}{inr(fee)}</> : "On request"}
                </div>
                <Link href={b.mode === "Custom" ? "/corporate" : `/contact?course=${encodeURIComponent(b.course)}#demo`} className="w-fit rounded-md bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-800 md:w-32 whitespace-nowrap">
                  {b.mode === "Custom" ? "Enquire" : "Reserve seat"}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-4 text-sm text-muted">Fees and dates are indicative placeholders. Confirm exact details with us before enrolling.</p>
    </div>
  );
}
