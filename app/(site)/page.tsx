import Link from "next/link";
import { COURSE_FACTS, FAQS, STEPS, WHY } from "@/lib/data";
import { FREE_UNTIL_LABEL } from "@/lib/access";
import { MONTHS, WEEKS } from "@/lib/path-data";
import { Arrow, ButtonLink, Container, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { PlanCards } from "@/components/PlanCards";
import { FaqList } from "@/components/FaqList";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-white pb-16 pt-12 sm:pt-16 lg:pb-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700"><span className="h-2 w-2 rounded-full bg-brand-600" />Free until {FREE_UNTIL_LABEL}</p>
              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-brand-900 sm:text-6xl">Learn English with SpeakUp.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Short daily lessons, all the grammar you need, and live online classes with our skilled trainers. Practise speaking every day, wherever you are.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup" size="lg">Register for free</ButtonLink>
                <ButtonLink href="/pricing" variant="outline" size="lg">See pricing</ButtonLink>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[15px] text-ink">
                {["100% online", "15 minutes a day", "Speaking checked instantly"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-brand-600" strokeWidth={2.5} />{t}</li>
                ))}
              </ul>
              <Link href="/level-test" className="mt-8 inline-block text-[15px] font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800">
                Not sure of your level? Take the free 3-minute test <Arrow />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-xl border border-line bg-white p-5 shadow-xl shadow-brand-900/10 sm:p-6" aria-hidden>
                <div className="mb-4 flex items-center justify-between text-xs text-muted"><span className="font-semibold text-brand-800">Day 4 · A, An and The</span><span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">Try it</span></div>
                <div className="mb-5 flex gap-1.5">{[0, 1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n < 2 ? "bg-brand-600" : n === 2 ? "bg-brand-400" : "bg-brand-100"}`} />)}</div>
                <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-800"><b>Rule:</b> <i>a</i> before a consonant sound, <i>an</i> before a vowel sound.</p>
                <p className="mt-4 font-display text-xl font-bold text-brand-900">I waited for ___ hour.</p>
                <div className="mt-3 grid gap-2 text-sm">
                  {[["a", false], ["an", true], ["the", false]].map(([o, r]) => (
                    <div key={String(o)} className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${r ? "border-brand-600 bg-brand-50 font-semibold text-brand-900" : "border-line text-muted"}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${r ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-800"}`}>{r ? "✓" : ""}</span>{o}
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-md border-l-4 border-brand-600 bg-brand-50 p-3 text-xs text-ink">&lsquo;Hour&rsquo; starts with a vowel sound (the h is silent), so we say <b>an hour</b>.</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= FACTS (true numbers about the course) ================= */}
      <section className="border-y border-line bg-brand-50 py-10">
        <Container>
          <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
            {COURSE_FACTS.map((s) => (
              <div key={s.label} className="px-4 text-center lg:border-line lg:[&:not(:last-child)]:border-r">
                <div className="font-display text-4xl font-bold text-brand-800">{s.value}</div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= WHY ================= */}
      <Section>
        <SectionHeading eyebrow="Why SpeakUp" title="Less lecture. More speaking." text="English improves when you use it. Every part of SpeakUp gets you speaking, and shows you exactly what to fix." />
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={w.icon} /></div>
              <h3 className="font-display text-lg font-semibold text-brand-900">{w.title}</h3>
              <p className="mt-1 text-muted">{w.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section tone="soft">
        <SectionHeading eyebrow="How it works" title="A simple routine that builds fluency" />
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-white p-7">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={s.icon} /></span>
                <span className="font-display text-3xl font-bold text-brand-200">0{i + 1}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-brand-900">{s.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ================= WHAT YOU LEARN ================= */}
      <Section>
        <SectionHeading eyebrow="The course" title="12 weeks, from first sentences to job interviews" text="One guided path for everyone. Beginners start at the basics; intermediate learners skip ahead." />
        <div className="grid gap-5 md:grid-cols-3">
          {MONTHS.map((m) => (
            <Reveal key={m.n} className="rounded-lg border border-line bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Month {m.n}</p>
              <h3 className="mt-1 font-display text-xl font-bold text-brand-900">{m.title.replace(/^Month \d+: /, "")}</h3>
              <ul className="mt-4 space-y-2">
                {WEEKS.filter((w) => w.month === m.n).map((w) => <li key={w.n} className="flex gap-2 text-[15px] text-ink"><span className="w-14 shrink-0 text-sm text-muted">Week {w.n}</span>{w.title}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><ButtonLink href="/courses" variant="outline">See the full syllabus <Arrow /></ButtonLink></div>
      </Section>

      {/* ================= PRICING ================= */}
      <Section tone="soft" id="pricing">
        <SectionHeading eyebrow="Pricing" title="Start free. Pay only for live classes." text={`Until ${FREE_UNTIL_LABEL}, every lesson and test is free. The full plan adds live classes with our trainers and your certificate.`} align="center" />
        <PlanCards />
      </Section>

      {/* ================= FAQ ================= */}
      <Section>
        <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />
        <FaqList limit={5} searchable={false} />
        <div className="mt-10 text-center"><ButtonLink href="/faq" variant="outline">All {FAQS.length} questions <Arrow /></ButtonLink></div>
      </Section>

      <CTA />
    </>
  );
}
