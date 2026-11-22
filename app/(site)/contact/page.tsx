import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE, WA_LINK } from "@/lib/data";
import { ButtonLink, PageHero, Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { DemoForm } from "@/components/DemoForm";

export const metadata: Metadata = { title: "Contact & Free Demo", description: "Book your free demo class, call us or message us on WhatsApp. Live online classes with optional Mumbai practice sessions." };

export default function Contact() {
  const info = [
    { icon: "pin", t: "Mumbai practice sessions", v: SITE.address, href: undefined },
    { icon: "phone", t: "Call us", v: SITE.phone, href: `tel:${SITE.phoneRaw}` },
    { icon: "mail", t: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "clock", t: "Opening hours", v: SITE.hours, href: undefined },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let us start your English journey." text="Book your free demo class or ask us anything. We reply within a few hours." />
      <Section id="demo">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <ul className="space-y-6">
              {info.map((i) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={i.icon} /></span>
                    <span>
                      <span className="block font-display font-semibold text-brand-900">{i.t}</span>
                      <span className="text-muted">{i.v}</span>
                    </span>
                  </>
                );
                return <li key={i.t}>{i.href ? <a href={i.href} className="flex gap-4 hover:opacity-80">{inner}</a> : <div className="flex gap-4">{inner}</div>}</li>;
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={WA_LINK()} external>Chat on WhatsApp</ButtonLink>
              <ButtonLink href={SITE.instagram} external variant="outline">Instagram</ButtonLink>
            </div>
            {/* EDIT: paste your Google Maps embed URL in lib/data.ts, SITE.mapEmbed */}
            <div className="mt-8 overflow-hidden rounded-lg border border-line bg-brand-50">
              {SITE.mapEmbed ? (
                <iframe src={SITE.mapEmbed} title="Our location on Google Maps" className="h-72 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <div className="grid h-72 place-items-center p-6 text-center text-muted">
                  <div>
                    <Icon name="pin" className="mx-auto mb-2 h-8 w-8 text-brand-500" />
                    <p className="font-display font-semibold text-brand-800">Google Map goes here</p>
                    <p className="text-sm">Add your embed URL in <code>lib/data.ts</code> as <code>SITE.mapEmbed</code></p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-line bg-white p-7 shadow-sm sm:p-9">
              <h2 className="font-display text-2xl font-bold text-brand-900">Book your free demo class</h2>
              <p className="mb-6 mt-1 text-muted">Tell us a little about you and we will call to confirm a time.</p>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-md bg-brand-50" />}><DemoForm /></Suspense>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
