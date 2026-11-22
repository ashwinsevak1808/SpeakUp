import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "@/lib/data";
import { Arrow, PageHero, Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CourseCard } from "@/components/CourseCard";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Courses", description: "Basic and Advanced Communication, Interview Mastery, Public Speaking and Corporate Training. Find the English course that fits your goal." };

export default function Courses() {
  return (
    <>
      <PageHero eyebrow="Courses" title="Find the course that fits your goal." text="From your very first English sentence to leading a boardroom, there is a path for you.">
        <Link href="/level-test" className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800">Not sure? Take the free level test <Arrow /></Link>
      </PageHero>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c, i) => <Reveal key={c.slug} delay={(i % 3) * 0.06}><CourseCard c={c} /></Reveal>)}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow="Compare" title="Which one is right for me?" />
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="bg-brand-800 text-white">
                {["Course", "Level", "Duration", "Frequency", "Fee"].map((h) => <th key={h} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COURSES.map((c) => (
                <tr key={c.slug} className="transition-colors hover:bg-brand-50">
                  <td className="px-6 py-4"><Link href={`/courses/${c.slug}`} className="font-display font-semibold text-brand-900 hover:text-brand-600">{c.title}</Link></td>
                  <td className="px-6 py-4 text-sm text-muted">{c.level}</td>
                  <td className="px-6 py-4 text-sm text-muted">{c.duration}</td>
                  <td className="px-6 py-4 text-sm text-muted">{c.frequency}</td>
                  <td className="px-6 py-4 font-display font-bold text-brand-900">{c.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <CTA />
    </>
  );
}
