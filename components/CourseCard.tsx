import Link from "next/link";
import type { Course } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Photo } from "./Photo";
import { Icon } from "./Icon";

export function CourseCard({ c }: { c: Course }) {
  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-brand-900/10", c.featured ? "border-brand-600" : "border-line")}>
      <div className="relative">
        <Photo name={c.image} alt={`${c.title} class in session`} className="aspect-[3/2] transition-transform duration-500 [&_img]:group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
        {c.featured && <span className="absolute left-4 top-4 rounded bg-brand-700 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-brand-900">{c.title}</h3>
        <p className="mt-1 text-sm font-medium text-brand-600">{c.tagline}</p>
        <p className="mt-3 text-muted">{c.short}</p>

        <ul className="my-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
          <li className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4 text-brand-600" />{c.duration}</li>
          <li className="flex items-center gap-1.5"><Icon name="calendar" className="h-4 w-4 text-brand-600" />{c.frequency}</li>
          <li className="flex items-center gap-1.5"><Icon name="gauge" className="h-4 w-4 text-brand-600" />{c.level}</li>
        </ul>

        <ul className="mb-6 flex-1 space-y-2 text-[15px]">
          {c.outcomes.slice(0, 3).map((o) => (
            <li key={o} className="flex gap-2.5 text-ink">
              <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.5} />
              {o}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-line pt-5">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">Fee</div>
            <div className="font-display text-xl font-bold text-brand-900">{c.fee}</div>
          </div>
          <div className="flex gap-2">
            <Link href={`/courses/${c.slug}`} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50">Details</Link>
            <Link href={`/contact?course=${encodeURIComponent(c.title)}#demo`} className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800">Enroll</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
