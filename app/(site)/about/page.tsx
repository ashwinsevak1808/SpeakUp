import type { Metadata } from "next";
import { WHY } from "@/lib/data";
import { FREE_UNTIL_LABEL } from "@/lib/access";
import { ButtonLink, PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "About SpeakUp", description: "SpeakUp helps people across India speak English with confidence through daily online lessons and live classes with skilled trainers." };

const VALUES = [
  { icon: "smile", t: "Kindness first", d: "Mistakes are how we learn. Nobody is judged for trying." },
  { icon: "discussion", t: "Speak, speak, speak", d: "Every lesson and every class ends with you speaking." },
  { icon: "shield", t: "Honest and simple", d: "Clear prices, no invented promises. Start free and decide later." },
  { icon: "sprout", t: "Small steps daily", d: "Fifteen minutes a day beats one long class a week." },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="English you can actually use." text="SpeakUp is an online English programme for people who understand English but freeze when they have to speak it: at interviews, in meetings, on calls and in everyday life." />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Why we exist" title="Most people do not need more theory. They need practice." className="!mb-6" />
            <div className="space-y-4 text-lg leading-relaxed text-muted">
              <p>Many of us studied English for years at school and still hesitate to speak. The problem is rarely knowledge. It is the lack of safe, regular practice and clear feedback.</p>
              <p>SpeakUp fixes that with a short lesson every day that ends in speaking, every grammar topic explained simply with the common mistakes, and live online classes where our skilled trainers help you speak and correct you kindly.</p>
              <p>We are 100% online, so you can learn from anywhere in India, on your phone or computer.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-5 sm:grid-cols-2">
              {WHY.map((w) => (
                <div key={w.title} className="rounded-lg border border-line bg-white p-6">
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={w.icon} /></div>
                  <h3 className="font-display text-lg font-semibold text-brand-900">{w.title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{w.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="What we believe" title="How we teach" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06} className="rounded-lg bg-white p-6 text-center">
              <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={v.icon} /></div>
              <h3 className="font-display text-lg font-semibold text-brand-900">{v.t}</h3>
              <p className="mt-1 text-[15px] text-muted">{v.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center"><ButtonLink href="/signup" size="lg">Register for free, until {FREE_UNTIL_LABEL}</ButtonLink></div>
      </Section>
      <CTA />
    </>
  );
}
