import type { ReactNode } from "react";
import Link from "next/link";
import { SITE } from "@/lib/data";
import { PageHero, Section } from "./Section";

/** Shared layout for the policy pages: hero, "last updated", readable text, contact block. */
export function LegalPage({ eyebrow, title, intro, updated, children }: { eyebrow: string; title: string; intro: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />
      <Section>
        <article className="mx-auto max-w-3xl text-[16.5px] leading-relaxed text-ink [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-900 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-brand-900 [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:text-brand-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <p className="!mt-0 text-sm text-muted">Last updated: {updated}</p>
          {children}
          <h2>Contact us</h2>
          <p>{SITE.legalName}{SITE.address ? `, ${SITE.address}` : ""}</p>
          <ul>
            <li>Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>Phone / WhatsApp: <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a></li>
          </ul>
          <p className="text-sm text-muted">See also: <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms &amp; Conditions</Link> · <Link href="/refund-policy">Refund &amp; Cancellation</Link> · <Link href="/delivery-policy">Delivery Policy</Link></p>
        </article>
      </Section>
    </>
  );
}
