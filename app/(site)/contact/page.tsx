import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE, WA_LINK } from "@/lib/data";
import { ButtonLink, PageHero, Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { DemoForm } from "@/components/DemoForm";

export const metadata: Metadata = { title: "Contact", description: "Questions about SpeakUp? Call, email or message us on WhatsApp. We are 100% online." };

export default function Contact() {
  const info = [
    { icon: "phone", t: "Call us", v: SITE.phone, href: `tel:${SITE.phoneRaw}` },
    { icon: "mail", t: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "clock", t: "How we teach", v: "100% online. Lessons in your account, live classes on Google Meet.", href: undefined },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Questions? We are happy to help." text="Ask us anything about the course, the live classes or payment. We usually reply within a few hours." />
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
              <ButtonLink href="/signup" variant="outline">Register for free</ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-line bg-white p-7 shadow-sm sm:p-9">
              <h2 className="font-display text-2xl font-bold text-brand-900">Send us a message</h2>
              <p className="mb-6 mt-1 text-muted">Leave your details and we will call or message you back.</p>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-md bg-brand-50" />}><DemoForm /></Suspense>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
