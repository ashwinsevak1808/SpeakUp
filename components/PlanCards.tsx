import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/data";
import { cn } from "@/lib/utils";

/** The three ways to learn with SpeakUp. Prices come from lib/learn-data.ts and lib/access.ts. */
export function PlanCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
      {PLANS.map((p) => (
        <article key={p.id} className={cn("relative flex flex-col rounded-xl border bg-white p-6 sm:p-7", p.featured ? "border-brand-700 shadow-xl shadow-brand-900/10 lg:-my-3 lg:py-10" : "border-line")}>
          {p.featured && <span className="absolute -top-3 left-6 rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Most complete</span>}
          <h3 className="font-display text-lg font-semibold text-brand-900">{p.name}</h3>
          <div className="mt-3 flex items-baseline gap-2"><span className="font-display text-4xl font-bold text-brand-900">{p.price}</span></div>
          <p className="text-sm font-medium text-brand-600">{p.per}</p>
          <p className="mt-4 text-[15px] text-muted">{p.text}</p>
          <ul className="mt-5 flex-1 space-y-2.5">
            {p.features.map((f) => <li key={f} className="flex gap-2.5 text-[15px] text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.5} />{f}</li>)}
          </ul>
          <Link href={p.href} className={cn("mt-7 block rounded-md py-3 text-center font-semibold transition-colors", p.featured ? "bg-brand-700 text-white hover:bg-brand-800" : "border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white")}>{p.cta}</Link>
        </article>
      ))}
    </div>
  );
}
