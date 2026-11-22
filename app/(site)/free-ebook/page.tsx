import type { Metadata } from "next";
import { PageHero, Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icon";
import { LeadForm, EBOOK_FIELDS } from "@/components/LeadForm";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Free E-Book", description: "Download a free sample chapter of our spoken English e-book: useful phrases, common mistakes and a 7-day speaking challenge." };

const INSIDE = [
  { icon: "discussion", t: "10 power phrases", d: "Sound confident in meetings, interviews and everyday chats." },
  { icon: "clipboard", t: "Common mistakes", d: "The 15 errors almost everyone makes, with quick fixes." },
  { icon: "calendar", t: "A 7-day challenge", d: "A tiny daily speaking task to build the habit." },
  { icon: "headphones", t: "Pronunciation tips", d: "Simple rules to be understood clearly, anywhere." },
];

export default function Ebook() {
  return (
    <>
      <PageHero eyebrow="Free e-book" title="Read a sample chapter. See how we teach." text="Our e-book is the backbone of every course. Download a free sample chapter and judge for yourself." />
      <Section>
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <Reveal>
            <Photo name="ebook-cover" alt="Cover of the Your English spoken English e-book" className="mx-auto mb-12 aspect-[3/4] w-56 rounded-md shadow-xl shadow-brand-900/20 sm:w-64" sizes="260px" />
            <h2 className="mb-6 font-display text-2xl font-bold text-brand-900">What is inside</h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {INSIDE.map((i) => (
                <li key={i.t}>
                  <div className="mb-2 grid h-10 w-10 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={i.icon} /></div>
                  <h3 className="font-display font-semibold text-brand-900">{i.t}</h3>
                  <p className="mt-1 text-sm text-muted">{i.d}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-line bg-white p-7 shadow-sm sm:p-9 lg:sticky lg:top-32">
              <h2 className="font-display text-2xl font-bold text-brand-900">Send me the sample chapter</h2>
              <p className="mb-6 mt-1 text-muted">Free and instant. No strings attached.</p>
              {/* EDIT: put your PDF at /public/sample-chapter.pdf */}
              <LeadForm kind="ebook" fields={EBOOK_FIELDS} submitLabel="Download Free Chapter" downloadHref="/sample-chapter.pdf" successText="Your sample chapter is downloading now. Message us on WhatsApp if you have any questions." />
            </div>
          </Reveal>
        </div>
      </Section>
      <CTA />
    </>
  );
}
