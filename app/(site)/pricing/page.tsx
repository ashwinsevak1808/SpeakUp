import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { ALWAYS_FREE_WEEKS, FREE_UNTIL_LABEL, WEEK_PRICE } from "@/lib/access";
import { PLAN } from "@/lib/learn-data";
import { PageHero, Section, SectionHeading } from "@/components/Section";
import { PlanCards } from "@/components/PlanCards";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Pricing", description: `SpeakUp is free until ${FREE_UNTIL_LABEL}. The full plan with live online classes and a certificate is ₹${PLAN.price.toLocaleString("en-IN")} for ${PLAN.months} months.` };

const yes = <Check className="mx-auto h-5 w-5 text-brand-600" strokeWidth={2.5} aria-label="Included" />;
const no = <Minus className="mx-auto h-5 w-5 text-brand-300" aria-label="Not included" />;
const ROWS: [string, React.ReactNode, React.ReactNode][] = [
  ["Daily lessons and weekly tests", <span key="a" className="text-sm">All, until {FREE_UNTIL_LABEL}</span>, yes],
  ["All 44 grammar topics", <span key="b" className="text-sm">Until {FREE_UNTIL_LABEL}</span>, yes],
  ["Speaking practice with instant checks", yes, yes],
  ["Progress, streaks and review list", yes, yes],
  ["Live online classes with trainers", no, yes],
  ["Certificate of Completion", no, yes],
];

export default function Pricing() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple, honest pricing." text={`Register for free and learn everything until ${FREE_UNTIL_LABEL}. Pay only when you want live classes with our trainers and your certificate.`} />
      <Section>
        <PlanCards />
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="Compare" title="Free or full plan?" align="center" />
        <div className="mx-auto max-w-3xl overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[480px] text-left">
            <thead><tr className="border-b border-line bg-brand-50 text-sm"><th className="px-5 py-4 font-semibold text-brand-900"> </th><th className="px-5 py-4 text-center font-semibold text-brand-900">Free</th><th className="px-5 py-4 text-center font-semibold text-brand-900">Full plan · ₹{PLAN.price.toLocaleString("en-IN")}</th></tr></thead>
            <tbody className="divide-y divide-line">
              {ROWS.map(([t, a, b]) => <tr key={t}><td className="px-5 py-4 text-ink">{t}</td><td className="px-5 py-4 text-center text-muted">{a}</td><td className="px-5 py-4 text-center">{b}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: "calendar", t: `After ${FREE_UNTIL_LABEL}`, d: `Weeks 1 to ${ALWAYS_FREE_WEEKS} stay free for everyone. Unlock any other week for ₹${WEEK_PRICE.toLocaleString("en-IN")}, or get everything with the full plan.` },
            { icon: "shield", t: "Secure payment", d: "Pay online through Razorpay with UPI, debit or credit card, net banking or wallets. Access unlocks the moment the payment succeeds." },
            { icon: "award", t: "Certificate", d: "Finish all 12 weeks and their checkpoints on the full plan to get your Certificate of Completion, with an ID employers can verify." },
          ].map((x) => (
            <div key={x.t}><div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={x.icon} /></div><h3 className="font-display text-lg font-semibold text-brand-900">{x.t}</h3><p className="mt-1 text-muted">{x.d}</p></div>
          ))}
        </div>
      </Section>
      <CTA />
    </>
  );
}
