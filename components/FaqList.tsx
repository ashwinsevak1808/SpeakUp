"use client";
import { Minus, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FAQS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FaqList({ limit, searchable = true }: { limit?: number; searchable?: boolean }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(FAQS.map((f) => f.cat)))], []);
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  let list = FAQS.filter((f) => (cat === "All" || f.cat === cat) && (f.q + f.a).toLowerCase().includes(query.toLowerCase()));
  if (limit) list = list.slice(0, limit);

  return (
    <div className="mx-auto max-w-3xl">
      {searchable && (
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(null); }}
              placeholder="Search questions"
              aria-label="Search FAQ"
              className="w-full rounded-md border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => { setCat(c); setOpen(null); }} className={cn("rounded-md border px-4 py-1.5 text-sm font-medium transition-colors", cat === c ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-brand-800 hover:bg-brand-50")}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="divide-y divide-line border-y border-line" data-faq-list>
        {list.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="font-display text-lg font-semibold text-brand-900">{f.q}</span>
                {isOpen ? <Minus className="h-5 w-5 shrink-0 text-brand-600" aria-hidden /> : <Plus className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />}
              </button>
              <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]")}>
                <p className="overflow-hidden leading-relaxed text-muted">{f.a}</p>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p className="py-10 text-center text-muted">No match found. Ask us on WhatsApp and we will reply within a few hours.</p>}
      </div>
    </div>
  );
}
