import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { LeadForm, CORP_FIELDS } from "@/components/LeadForm";

export const metadata: Metadata = { title: "Corporate Training", description: "Customised business English, email writing, meetings and negotiation training for your team, on-site or online." };

const MODULES = [
  { icon: "briefcase", t: "Business English", d: "Professional vocabulary, tone and etiquette." },
  { icon: "mail", t: "Email writing", d: "Clear, polite and persuasive emails that get replies." },
  { icon: "users", t: "Meetings", d: "Lead, contribute and summarise with confidence." },
  { icon: "handshake", t: "Negotiation", d: "Influence, persuade and close with the right words." },
  { icon: "presentation", t: "Presentations", d: "Crisp updates and client pitches that land." },
  { icon: "smile", t: "Soft skills", d: "Listening, feedback and cross-cultural communication." },
];
const PROCESS = [
  { t: "Discover", d: "We speak with your HR / L&D team and assess current levels." },
  { t: "Design", d: "A curriculum built on your real emails, calls and meetings." },
  { t: "Deliver", d: "Engaging on-site or online sessions with practice built in." },
  { t: "Measure", d: "Before and after assessments, plus manager reports." },
];

export default function Corporate() {
  return (
    <>
      <PageHero eyebrow="Corporate training" title="Clear communication, measurable results." text="We design communication programmes around your people and your goals, and report back on what changed." image="corporate" imageAlt="A corporate team in a communication workshop">
        <a href="#enquiry" className="inline-flex rounded-md bg-brand-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-800">Request a proposal</a>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="What we train" title="Programmes built for the workplace" />
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <Reveal key={m.t} delay={(i % 3) * 0.05}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-brand-100 text-brand-700"><Icon name={m.icon} /></div>
              <h3 className="font-display text-lg font-semibold text-brand-900">{m.t}</h3>
              <p className="mt-1 text-muted">{m.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading dark eyebrow="Our process" title="From first conversation to measurable results" />
        <ol className="grid gap-8 md:grid-cols-4">
          {PROCESS.map((p, i) => (
            <li key={p.t} className="border-t border-white/25 pt-5">
              <span className="font-display text-sm font-semibold text-brand-300">Step {i + 1}</span>
              <h3 className="mt-1 font-display text-xl font-semibold">{p.t}</h3>
              <p className="mt-2 text-brand-100">{p.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="enquiry" tone="soft">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Get a proposal" title="Tell us about your team" text="Share a few details and we will send a tailored proposal within 24 hours." />
            <ul className="-mt-4 space-y-3 text-lg text-ink">
              {["Customised curriculum and schedule", "On-site or online delivery", "Progress reports for managers", "Certificates for participants"].map((x) => (
                <li key={x} className="flex gap-3"><Icon name="check" className="mt-1.5 h-5 w-5 shrink-0 text-brand-600" strokeWidth={2.5} />{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-line bg-white p-7 shadow-sm sm:p-9">
              <LeadForm kind="corporate" fields={CORP_FIELDS} submitLabel="Request a Proposal" successText="Thank you. Our team will contact you within 24 hours with a tailored proposal." />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
