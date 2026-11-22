import type { Metadata } from "next";
import { STEPS } from "@/lib/data";
import { ButtonLink, PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "How It Works", description: "Register free, do one 15-minute lesson a day, join live online classes with our trainers, and earn your certificate." };

const INSIDE = [
  { icon: "chart", t: "Your dashboard", d: "Today's lesson, your streak, points and what is coming next, all in one place." },
  { icon: "pen", t: "Grammar guide", d: "Every grammar topic in the course, with where it is taught and what you have learned." },
  { icon: "clipboard", t: "Review list", d: "Exercises you got wrong come back for quick practice until you get them right." },
  { icon: "mic", t: "Speaking checks", d: "Say your answers aloud. The app checks them, and never records or stores your voice." },
  { icon: "users", t: "Live classes", d: "See the class timetable and join on Google Meet with one tap (full plan)." },
  { icon: "award", t: "Certificate", d: "Finish all 12 weeks on the full plan and get a certificate employers can verify." },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Fluency is a habit, so we build one." text="Four simple steps, all online. Here is exactly how learning with SpeakUp works.">
        <ButtonLink href="/signup" size="lg">Register for free</ButtonLink>
      </PageHero>

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
        <SectionHeading eyebrow="Inside your account" title="Everything you need to keep going" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INSIDE.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.04} className="rounded-lg bg-white p-6">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={x.icon} /></div>
              <h3 className="font-display text-lg font-semibold text-brand-900">{x.t}</h3>
              <p className="mt-1 text-[15px] text-muted">{x.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <CTA />
    </>
  );
}
