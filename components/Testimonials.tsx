"use client";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  const go = useCallback((to: number) => setI((to + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(i + 1), 7000);
    return () => clearInterval(t);
  }, [i, paused, go]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} role="region" aria-roledescription="carousel" aria-label="Learner testimonials" className="mx-auto max-w-3xl">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {TESTIMONIALS.map((t, k) => (
            <figure key={t.name} aria-hidden={k !== i} className="w-full shrink-0 px-1">
              <Quote className="mb-5 h-9 w-9 text-brand-300" aria-hidden />
              <blockquote className="font-display text-2xl font-medium leading-snug text-brand-900 sm:text-[1.7rem]">{t.text}</blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">{t.name.split(" ").map((p) => p[0]).join("")}</span>
                <span>
                  <span className="block font-semibold text-brand-900">{t.name}</span>
                  <span className="block text-sm text-muted">{t.role} · {t.course}</span>
                </span>
                <span className="rounded bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">{t.gain}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10 flex items-center gap-4">
        <button onClick={() => go(i - 1)} aria-label="Previous testimonial" className="grid h-10 w-10 place-items-center rounded-full border border-line text-brand-800 transition-colors hover:bg-brand-50"><ArrowLeft className="h-4 w-4" /></button>
        <button onClick={() => go(i + 1)} aria-label="Next testimonial" className="grid h-10 w-10 place-items-center rounded-full border border-line text-brand-800 transition-colors hover:bg-brand-50"><ArrowRight className="h-4 w-4" /></button>
        <div className="ml-2 flex gap-2">
          {TESTIMONIALS.map((_, d) => (
            <button key={d} onClick={() => go(d)} aria-label={`Go to testimonial ${d + 1}`} className={cn("h-1.5 rounded-full transition-all", d === i ? "w-8 bg-brand-700" : "w-3 bg-brand-200")} />
          ))}
        </div>
      </div>
    </div>
  );
}
