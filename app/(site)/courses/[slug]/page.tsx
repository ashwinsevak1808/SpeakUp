import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BATCHES, COURSES } from "@/lib/data";
import { Arrow, ButtonLink, PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { CourseCard } from "@/components/CourseCard";
import { FaqList } from "@/components/FaqList";
import { CTA } from "@/components/CTA";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COURSES.find((x) => x.slug === slug);
  return c ? { title: c.title, description: `${c.short} ${c.duration}, ${c.frequency}.` } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COURSES.find((x) => x.slug === slug);
  if (!c) notFound();
  const batches = BATCHES.filter((b) => b.slug === c.slug);
  const others = COURSES.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={c.level} crumb={c.title} title={c.title} text={`${c.tagline}. ${c.short}`} image={c.image} imageAlt={`${c.title} class in session`}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/contact?course=${encodeURIComponent(c.title)}#demo`} size="lg">Enroll now</ButtonLink>
          <ButtonLink href="/pricing" variant="outline" size="lg">See batches</ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-14">
            <Reveal>
              <h2 className="mb-6 font-display text-2xl font-bold text-brand-900">What you will achieve</h2>
              <ul className="space-y-3">
                {c.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-lg text-ink">
                    <Icon name="check" className="mt-1.5 h-5 w-5 shrink-0 text-brand-600" strokeWidth={2.5} />{o}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="mb-6 font-display text-2xl font-bold text-brand-900">Course outline</h2>
              <div className="divide-y divide-line rounded-lg border border-line">
                {c.syllabus.map((s, i) => (
                  <details key={s.title} open={i === 0} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                      <span className="font-display text-lg font-semibold text-brand-900">{s.title}</span>
                      <span className="text-2xl leading-none text-brand-600 transition-transform group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <ul className="grid gap-2 px-6 pb-6 text-muted sm:grid-cols-2">
                      {s.topics.map((t) => <li key={t} className="flex gap-2"><span className="text-brand-500" aria-hidden>&bull;</span>{t}</li>)}
                    </ul>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>

          <aside>
            <div className="sticky top-32 space-y-5">
              <div className="rounded-lg border border-line bg-white p-7 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted">Course fee</div>
                <div className="font-display text-4xl font-bold text-brand-900">{c.fee}</div>
                <dl className="my-6 space-y-3 border-y border-line py-5 text-sm">
                  {[["Duration", c.duration], ["Frequency", c.frequency], ["Level", c.level], ["Batch size", "Up to 20 learners"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><dt className="text-muted">{k}</dt><dd className="font-semibold text-brand-900">{v}</dd></div>
                  ))}
                </dl>
                <p className="mb-1 text-sm font-semibold text-brand-900">Who is it for?</p>
                <p className="mb-5 text-muted">{c.audience}</p>
                <p className="mb-2 text-sm font-semibold text-brand-900">What is included</p>
                <ul className="mb-6 space-y-2 text-sm text-muted">
                  {c.includes.map((i) => <li key={i} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.5} />{i}</li>)}
                </ul>
                <ButtonLink href={`/contact?course=${encodeURIComponent(c.title)}#demo`} className="w-full">Book a free demo</ButtonLink>
              </div>
              {batches.length > 0 && (
                <div className="rounded-lg bg-brand-50 p-6">
                  <h3 className="mb-3 font-display font-semibold text-brand-900">Upcoming batches</h3>
                  <ul className="space-y-3 text-sm">
                    {batches.map((b) => (
                      <li key={b.name} className="rounded-md bg-white p-4">
                        <div className="font-semibold text-brand-900">{b.name}</div>
                        <div className="text-muted">{b.days} · {b.time}</div>
                        <div className="mt-1 text-xs font-medium text-brand-700">Starts {b.start}{b.mode !== "Custom" && ` · ${b.seats} seats left`}</div>
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing" className="mt-4 inline-block text-sm font-semibold text-brand-700 underline underline-offset-4">Full schedule and fees <Arrow /></Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="Quick answers" title="Before you enrol" />
        <FaqList limit={4} searchable={false} />
      </Section>

      <Section>
        <SectionHeading eyebrow="Keep exploring" title="Other courses" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => <CourseCard key={o.slug} c={o} />)}
        </div>
      </Section>
      <CTA />
    </>
  );
}
