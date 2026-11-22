import type { Metadata } from "next";
import { ACTIVITIES } from "@/lib/data";
import { PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Beyond the Classroom", description: "Group discussions, debates, role-plays, speaking clubs, mock interviews and outings that make English practice enjoyable." };

export default function Beyond() {
  return (
    <>
      <PageHero eyebrow="Beyond the classroom" title="Where English becomes part of real life." text="Confidence does not grow from textbooks alone. It grows when you discuss, debate, perform and explore together." />

      <Section>
        <SectionHeading eyebrow="Activities" title="Six ways we get you speaking" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 0.06}>
              <article className="h-full overflow-hidden rounded-lg border border-line bg-white">
                <Photo name={a.image} alt={`${a.title} activity`} className="aspect-[4/3]" sizes="(min-width: 1024px) 33vw, 100vw" />
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={a.icon} className="h-[18px] w-[18px]" /></span>
                    <h3 className="font-display text-lg font-semibold text-brand-900">{a.title}</h3>
                  </div>
                  <p className="text-muted">{a.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="Speaking Club" title="Every Sunday at 5 PM. Just come and talk." text="A relaxed, topic-of-the-week meet-up open to all current learners and one friend each." />
        <div className="grid gap-6 sm:grid-cols-3">
          {[["Free for learners", "No extra fee for enrolled learners."], ["A new topic weekly", "From films to finance to travel."], ["No corrections", "Just conversation. Trainers take notes quietly."]].map(([t, d]) => (
            <div key={t} className="border-t-2 border-brand-600 pt-5">
              <h3 className="font-display text-lg font-semibold text-brand-900">{t}</h3>
              <p className="mt-1 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <CTA title="Come and join in" text="Book a free demo class and experience a live activity for yourself." />
    </>
  );
}
