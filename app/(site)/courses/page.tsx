import type { Metadata } from "next";
import { MONTHS, WEEKS } from "@/lib/path-data";
import { GRAMMAR_TOPIC_COUNT } from "@/lib/grammar-map";
import { ButtonLink, PageHero, Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Course and Syllabus", description: "The SpeakUp 12-week spoken English course: 60 daily lessons, weekly checkpoints and every grammar topic, from first sentences to job interviews." };

export default function Course() {
  const lessons = WEEKS.reduce((n, w) => n + w.lessons.length, 0);
  return (
    <>
      <PageHero eyebrow="The course" title="One clear path to confident English." text={`${WEEKS.length} weeks · ${lessons} daily lessons · ${GRAMMAR_TOPIC_COUNT} grammar topics · a checkpoint every week. Each lesson takes about 15 minutes and ends with you speaking.`}>
        <div className="flex flex-col gap-3 sm:flex-row"><ButtonLink href="/signup" size="lg">Register for free</ButtonLink><ButtonLink href="/level-test" variant="outline" size="lg">Find my level</ButtonLink></div>
      </PageHero>

      <Section>
        <div className="mb-12 grid gap-4 sm:grid-cols-5">
          {[["Warm-up", "One useful phrase"], ["Learn", "A simple rule with examples"], ["Try it", "Exercises with instant feedback"], ["Speak", "Say it aloud; the app checks"], ["Finish", "Points, streak and review"]].map(([t, d], i) => (
            <div key={t} className="rounded-lg border border-line bg-white p-4"><div className="text-xs font-semibold uppercase tracking-wider text-brand-600">Step {i + 1}</div><div className="mt-1 font-display font-semibold text-brand-900">{t}</div><p className="mt-1 text-sm text-muted">{d}</p></div>
          ))}
        </div>

        <div className="space-y-14">
          {MONTHS.map((m) => (
            <section key={m.n} aria-label={m.title}>
              <h2 className="mb-6 font-display text-2xl font-bold text-brand-900 sm:text-3xl">{m.title}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {WEEKS.filter((w) => w.month === m.n).map((w) => (
                  <Reveal key={w.n} className="rounded-lg border border-line bg-white p-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Week {w.n}</p>
                    <h3 className="mt-1 font-display text-xl font-bold text-brand-900">{w.title}</h3>
                    {w.theme && <p className="mt-1 text-sm text-muted">{w.theme}</p>}
                    <ol className="mt-4 space-y-1.5">
                      {w.lessons.map((l) => <li key={l.id} className="flex gap-3 text-[15px] text-ink"><span className="w-12 shrink-0 text-sm text-muted">Day {l.day}</span><span>{l.title}</span></li>)}
                      <li className="flex gap-3 text-[15px] font-medium text-brand-700"><span className="w-12 shrink-0 text-sm text-brand-600">Test</span><span>{w.checkpoint.title}</span></li>
                    </ol>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
      <CTA />
    </>
  );
}
