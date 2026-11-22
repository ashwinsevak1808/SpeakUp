import type { Metadata } from "next";
import { OFFERS } from "@/lib/data";
import { PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { PricingExplorer } from "@/components/PricingExplorer";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Batches & Fees", description: "Clear fees and flexible batch timings for every English course. Student discounts and instalments available." };

export default function Pricing() {
  return (
    <>
      <PageHero eyebrow="Batches and fees" title="Clear fees. Flexible batches." text="Choose an online cohort that suits your schedule. Seats are limited to keep live classes personal. Live in Mumbai? Add in-person practice sessions." />
      <Section tone="soft"><PricingExplorer /></Section>
      <Section>
        <SectionHeading eyebrow="Offers" title="Ways we make it easier" />
        <div className="grid gap-6 md:grid-cols-3">
          {OFFERS.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.06}>
              <div className="h-full rounded-lg border border-line p-7">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={o.icon} /></div>
                <h3 className="font-display text-lg font-semibold text-brand-900">{o.title}</h3>
                <p className="mt-1 text-muted">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <CTA title="Seats fill up quickly" text="Reserve yours with a free demo class. You only pay if you love it." />
    </>
  );
}
