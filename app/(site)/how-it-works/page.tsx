import type { Metadata } from "next";
import { STEPS } from "@/lib/data";
import { PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "How It Works", description: "Live online classes, daily practice in your student login, an e-book and progress tracking: the system that builds real fluency." };

const WEEK = [
  ["Mon", "Daily speaking task"], ["Tue", "Voice-note practice"], ["Wed", "E-book lesson"], ["Thu", "Word of the day"],
  ["Fri", "Practice partner call"], ["Sat", "Class day"], ["Sun", "Speaking club"],
];
const PROGRESS = [
  { t: "Day 1: Baseline", d: "A friendly speaking check to see where you are today." },
  { t: "Monthly: Progress report", d: "Personal feedback on fluency, vocabulary, grammar and confidence." },
  { t: "Final: Assessment", d: "A final assessment and certificate that mark how far you have come." },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Fluency is a habit, so we build one." text="Four simple ingredients and one friendly routine. Here is exactly what your week looks like with us." image="how-it-works" imageAlt="A trainer guiding learners through a speaking exercise" />

      <Section>
        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.title}>
              <div className="grid items-start gap-6 rounded-lg border border-line bg-white p-7 sm:grid-cols-[auto_1fr] sm:p-8">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={s.icon} className="h-6 w-6" /></span>
                  <span className="font-display text-3xl font-bold text-brand-200">0{i + 1}</span>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-brand-900">{s.title}</h2>
                  <p className="mt-2 max-w-2xl text-lg text-muted">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="A week with us" title="Small daily steps, big results" text="Just 10 to 15 minutes a day between classes keeps English alive in your mind." />
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {WEEK.map(([d, t]) => (
            <div key={d} className={`p-5 ${d === "Sat" ? "bg-brand-700 text-white" : "bg-white"}`}>
              <div className={`text-xs font-semibold uppercase tracking-wider ${d === "Sat" ? "text-brand-200" : "text-brand-600"}`}>{d}</div>
              <div className="mt-2 font-display font-semibold">{t}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Progress tracking" title="See your growth, not just feel it" />
        <div className="grid gap-6 md:grid-cols-3">
          {PROGRESS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full border-t-2 border-brand-600 pt-5">
                <h3 className="font-display text-lg font-semibold text-brand-900">{p.t}</h3>
                <p className="mt-2 text-muted">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <CTA />
    </>
  );
}
