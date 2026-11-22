import Link from "next/link";
import { COURSES, FAQS, STATS, STEPS, WHY } from "@/lib/data";
import { Arrow, ButtonLink, Container, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icon";
import { CourseCard } from "@/components/CourseCard";
import { Testimonials } from "@/components/Testimonials";
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
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">Online spoken English course · Live classes · Mumbai</p>
              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-brand-900 sm:text-6xl">
                Speak English with confidence, at work and in life.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Live online classes with real trainers, a personal login for daily grammar practice, and a certificate at the end. Three months, ₹3,000.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup" size="lg">Start Free</ButtonLink>
                <ButtonLink href="/pricing" variant="outline" size="lg">See batches and fees</ButtonLink>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[15px] text-ink">
                {["2 live classes a week", "Student login with practice", "Certificate of Completion"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-brand-600" strokeWidth={2.5} />{t}</li>
                ))}
              </ul>
              <Link href="/level-test" className="mt-8 inline-block text-[15px] font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800">
                Not sure of your level? Take the free 3-minute test <Arrow />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative">
                <Photo name="hero" alt="A trainer leading a live spoken English class" className="aspect-square rounded-lg" sizes="(min-width: 1024px) 45vw, 100vw" priority />
                <div className="absolute -bottom-5 left-5 rounded-md border border-line bg-white px-5 py-4 shadow-lg shadow-brand-900/10 sm:left-[-1.5rem]">
                  <div className="font-display text-3xl font-bold text-brand-800"><Counter value={2500} suffix="+" /></div>
                  <div className="text-sm text-muted">learners trained</div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-line bg-brand-50 py-10">
        <Container>
          <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 text-center lg:[&:not(:last-child)]:border-r lg:border-line">
                <div className="font-display text-4xl font-bold text-brand-800"><Counter value={s.value} suffix={s.suffix} /></div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= COURSES ================= */}
      <Section>
        <SectionHeading eyebrow="Our courses" title="Programmes for every stage of your English" text="From your first sentence to leading a boardroom, choose the path that fits your goal." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.slice(0, 3).map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}><CourseCard c={c} /></Reveal>
          ))}
        </div>
        <div className="mt-10"><ButtonLink href="/courses" variant="outline">View all {COURSES.length} courses <Arrow /></ButtonLink></div>
      </Section>

      {/* ================= WHY US ================= */}
      <Section tone="soft">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <Photo name="classroom" alt="Learners practising a conversation in a bright classroom" className="aspect-[4/3] rounded-lg" />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Why learners choose us" title="Less lecture. More speaking." text="Our founder once froze in front of a full room, not for lack of knowledge, but for lack of practice. Every class we teach is built around fixing exactly that." />
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {WHY.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.06}>
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={w.icon} /></div>
                  <h3 className="font-display text-lg font-semibold text-brand-900">{w.title}</h3>
                  <p className="mt-1 text-muted">{w.text}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-9"><ButtonLink href="/about" variant="outline">About us <Arrow /></ButtonLink></div>
          </div>
        </div>
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section>
        <SectionHeading eyebrow="How it works" title="A simple routine that builds fluency" text="Learning a language is like going to the gym: regular practice wins." />
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

      {/* ================= STUDENT LOGIN ================= */}
      <Section tone="soft">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Your student login" title="Practise every day, not just in class" text="Every student gets a personal dashboard to practise grammar, follow lessons, join live classes and track progress." className="!mb-8" />
            <ul className="mb-8 space-y-4">
              {[
                ["A guided daily path", "One short lesson a day: warm-up, learn, try it, speak and finish."],
                ["Weekly checkpoints", "A friendly review each week, with stars and milestones along the way."],
                ["Streaks and progress", "See your daily streak, points and what is coming up next."],
                ["Certificate of Completion", "Finish the requirements and download your certificate."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3"><Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-brand-600" strokeWidth={2.5} /><span><b className="text-brand-900">{t}.</b> <span className="text-muted">{d}</span></span></li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" size="lg">Create a free account</ButtonLink>
              <ButtonLink href="/login" variant="outline" size="lg">Log in</ButtonLink>
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-line bg-white p-5 shadow-xl shadow-brand-900/10 sm:p-6" aria-hidden>
              <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                {[["12", "Day streak"], ["840", "Points"], ["Week 3", "Day 12"]].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-brand-50 py-3"><div className="font-display text-xl font-bold text-brand-800">{v}</div><div className="text-[11px] text-muted">{l}</div></div>
                ))}
              </div>
              <div className="rounded-lg border border-line p-4">
                <div className="mb-1 flex justify-between text-xs text-muted"><span className="font-semibold text-brand-800">Day 6 · Present Continuous</span><span>Try it</span></div>
                <div className="mb-4 flex gap-1.5">{[0,1,2,3,4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n < 2 ? "bg-brand-600" : n === 2 ? "bg-brand-400" : "bg-brand-100"}`} />)}</div>
                <p className="font-display text-lg font-bold text-brand-900">I ___ the answer.</p>
                <div className="mt-3 grid gap-2 text-sm">
                  {[["know", true], ["am knowing", false], ["knowing", false]].map(([o, r]) => (
                    <div key={String(o)} className={`flex items-center gap-3 rounded-md border px-3 py-2 ${r ? "border-brand-600 bg-brand-50 font-semibold text-brand-900" : "border-line text-muted"}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${r ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-800"}`}>{r ? "✓" : ""}</span>{o}
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-md border-l-4 border-brand-600 bg-brand-50 p-3 text-xs text-ink">&lsquo;Know&rsquo; describes a state, not an action. We do not use state verbs in the continuous form.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ================= CORPORATE BAND ================= */}
      <section className="bg-brand-900 text-white">
        <div className="grid lg:grid-cols-2">
          <Photo name="corporate" alt="A corporate team in a communication workshop" className="min-h-72 lg:min-h-[28rem]" />
          <div className="flex items-center px-5 py-16 sm:px-12 lg:px-16">
            <Reveal>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-brand-300">For companies</p>
              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Communication training built around your team</h2>
              <p className="mt-4 max-w-lg text-lg text-brand-100">Business English, email writing, meetings and negotiation, delivered at your office or online, with progress reports for managers.</p>
              <div className="mt-8"><ButtonLink href="/corporate" variant="light">Explore corporate training <Arrow /></ButtonLink></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <Section tone="soft">
        <SectionHeading eyebrow="Learner stories" title="Real people. Real progress." />
        <Testimonials />
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
