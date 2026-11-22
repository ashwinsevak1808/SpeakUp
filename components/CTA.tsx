import { WA_LINK } from "@/lib/data";
import { FREE_UNTIL_LABEL } from "@/lib/access";
import { Reveal } from "./Reveal";
import { ButtonLink, Container } from "./Section";

export function CTA({ title = "Start speaking better English today", text = `Register for free. Every lesson, test and grammar topic is free until ${FREE_UNTIL_LABEL}.` }: { title?: string; text?: string }) {
  return (
    <section className="bg-brand-800 py-16 text-white sm:py-20">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
            <p className="mt-3 text-lg text-brand-100">{text}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/signup" variant="light" size="lg">Register for free</ButtonLink>
            <ButtonLink href={WA_LINK()} external variant="ghost" size="lg">Ask on WhatsApp</ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
