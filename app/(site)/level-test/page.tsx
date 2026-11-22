import type { Metadata } from "next";
import { PageHero, Section } from "@/components/Section";
import { LevelTest } from "@/components/LevelTest";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "Free English Level Test", description: "Take our free 3-minute English test and get your level plus a personalised course recommendation." };

export default function LevelTestPage() {
  return (
    <>
      <PageHero eyebrow="Free level test" title="How strong is your English today?" text="Answer 12 short questions and get your level instantly." />
      <Section tone="soft" className="!pt-12 sm:!pt-16"><LevelTest /></Section>
      <CTA />
    </>
  );
}
