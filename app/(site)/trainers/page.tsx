import type { Metadata } from "next";
import { TEAM, TRAINERS } from "@/lib/data";
import { Arrow, ButtonLink, PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Meet the Trainers", description: "Experienced, friendly trainers who make learning English feel natural." };

export default function Trainers() {
  return (
    <>
      <PageHero eyebrow="Meet the trainers" title="Teachers who believe in you." text="Our trainers are coaches first: patient, practical and genuinely invested in your progress." />

      <Section>
        <div className="space-y-20">
          {TRAINERS.map((t, i) => (
            <Reveal key={t.name}>
              <div className={`grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] ${i % 2 ? "lg:[&>*:first-child]:order-2 lg:grid-cols-[1.2fr_0.8fr]" : ""}`}>
                <Photo name={t.photo} alt={`Portrait of ${t.name}, ${t.role}`} className="mx-auto aspect-[4/5] w-full max-w-sm rounded-lg" sizes="(min-width: 1024px) 30vw, 90vw" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">{t.role}</p>
                  <h2 className="mt-2 font-display text-4xl font-bold text-brand-900">{t.name}</h2>
                  <p className="mt-1 text-muted">{t.exp} of experience · {t.specialty}</p>
                  <p className="mt-5 text-lg leading-relaxed text-ink">{t.bio}</p>
                  <blockquote className="my-6 border-l-2 border-brand-600 pl-5 font-display text-lg font-medium text-brand-800">&ldquo;{t.quote}&rdquo;</blockquote>
                  <ul className="flex flex-wrap gap-2">
                    {t.skills.map((s) => <li key={s} className="rounded bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-800">{s}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="The team" title="The people behind the classes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name}>
              <Photo name={m.photo} alt={`Portrait of ${m.name}`} className="aspect-[4/5] rounded-lg" sizes="(min-width: 1024px) 25vw, 50vw" />
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-10"><ButtonLink href="/contact#demo">Meet us at a free demo <Arrow /></ButtonLink></div>
      </Section>
      <CTA />
    </>
  );
}
