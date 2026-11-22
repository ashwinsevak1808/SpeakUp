import type { Metadata } from "next";
import { FAQS, SITE, WA_LINK } from "@/lib/data";
import { ButtonLink, PageHero, Section } from "@/components/Section";
import { FaqList } from "@/components/FaqList";
import { Reveal } from "@/components/Reveal";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "FAQ", description: "Answers to common questions about our English courses, batches, fees, certificates and corporate training." };

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="FAQ" title="Frequently asked questions." text="Search, or browse by topic. Cannot find your answer? Just ask us." />
      <Section>
        <FaqList />
        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="flex flex-col items-start justify-between gap-5 rounded-lg bg-brand-50 p-7 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-xl font-semibold text-brand-900">Still have a question?</h3>
              <p className="text-muted">We reply on WhatsApp within a few hours.</p>
            </div>
            <div className="flex gap-3">
              <ButtonLink href={WA_LINK()} external>WhatsApp</ButtonLink>
              <ButtonLink href={`tel:${SITE.phoneRaw}`} external variant="outline">Call us</ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>
      <CTA />
    </>
  );
}
