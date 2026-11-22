import type { Metadata } from "next";
import { STATS, TEAM } from "@/lib/data";
import { Arrow, ButtonLink, PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "About Us", description: "Our story, mission and the small, dedicated team helping people speak English with confidence." };

const VALUES = [
  { icon: "smile", t: "Kindness first", d: "Mistakes are how we learn. Our classrooms are judgement-free." },
  { icon: "discussion", t: "Speak, speak, speak", d: "You will talk more in one class with us than in a month of lectures." },
  { icon: "shield", t: "Honest guidance", d: "We tell you which course fits you, even when it is the cheaper one." },
  { icon: "sprout", t: "Steady progress", d: "Small wins every week add up to a big transformation." },
];
const TIMELINE = [
  { y: "2018", t: "The first class", d: "Priya begins with six learners in a rented room." }, // EDIT
  { y: "2020", t: "Practice and tracking", d: "Daily activities, an e-book and progress reports are introduced." },
  { y: "2022", t: "Corporate programmes", d: "We begin training teams at local companies." },
  { y: "2024", t: "2,000 learners", d: "Clubs, events and a growing alumni community." },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Helping people find their voice in English." text="We are a small team with one belief: anyone can speak English clearly and confidently, with the right practice and encouragement." image="about-team" imageAlt="The Your English team in front of the centre" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Our story" title="It started with a frozen moment on stage." />
            <div className="-mt-4 space-y-4 text-lg leading-relaxed text-muted">
              {/* EDIT: replace with your real founding story */}
              <p>Years ago, our founder stood in front of a full room, knowing exactly what to say, and could not say it. Not for lack of knowledge, but because nobody had given her a safe place to practise.</p>
              <p>So she began teaching: first one learner, then a batch, then a whole community. The rule was simple: less lecture, more talking, steady encouragement.</p>
              <p>Today our team of five (two trainers, a digital lead, an operations lead and our founder) helps students, job seekers, homemakers and professionals turn hesitation into confidence.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-lg bg-brand-800 p-8 text-white sm:p-10">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-300">Our mission</h3>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug">To help every learner speak English clearly and confidently, so that language never stands between them and their goals.</p>
              <div className="my-8 h-px bg-white/15" />
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-300">Our vision</h3>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug">A city where nobody holds back an idea, an interview or a conversation because of English.</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="Our values" title="What makes us different" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="h-full rounded-lg border border-line bg-white p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={v.icon} /></div>
                <h3 className="font-display text-lg font-semibold text-brand-900">{v.t}</h3>
                <p className="mt-2 text-muted">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid grid-cols-2 gap-y-10 text-center lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl font-bold"><Counter value={s.value} suffix={s.suffix} /></div>
              <div className="mt-2 text-brand-200">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Our journey" title="From one room to a community" />
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
          {TIMELINE.map((t) => (
            <li key={t.y} className="bg-white p-7">
              <div className="font-display text-3xl font-bold text-brand-600">{t.y}</div>
              <div className="mt-3 font-display text-lg font-semibold text-brand-900">{t.t}</div>
              <p className="mt-1 text-[15px] text-muted">{t.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="The team" title="Five people, one purpose" text="Small enough to know every learner by name." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name}>
              <Photo name={m.photo} alt={`Portrait of ${m.name}`} className="aspect-[4/5] rounded-lg" sizes="(min-width: 1024px) 25vw, 50vw" />
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-10"><ButtonLink href="/trainers" variant="outline">Meet our trainers <Arrow /></ButtonLink></div>
      </Section>
      <CTA />
    </>
  );
}
