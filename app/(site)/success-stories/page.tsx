import type { Metadata } from "next";
import { STATS, TESTIMONIALS } from "@/lib/data";
import { PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { Counter } from "@/components/Counter";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Success Stories", description: "Hear from learners who went from nervous to confident: interviews cracked, promotions earned, new friendships made." };

export default function Stories() {
  return (
    <>
      <PageHero eyebrow="Success stories" title="From hesitant to confident." text="Every story here began with a nervous hello. This is where our learners are now." />

      <Section tone="soft"><Testimonials /></Section>

      <Section>
        <SectionHeading eyebrow="More stories" title="Wins, big and small" text="Placeholder stories: replace them with your real learners' words (with their permission)." />
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.05} className="break-inside-avoid">
              <figure className="rounded-lg border border-line bg-white p-7">
                <blockquote className="text-lg leading-relaxed text-ink">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">{t.name.split(" ").map((p) => p[0]).join("")}</span>
                  <span>
                    <span className="block font-semibold text-brand-900">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
                <p className="mt-4 inline-block rounded bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">{t.gain}</p>
              </figure>
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
      <CTA title="Your story could be next" />
    </>
  );
}
