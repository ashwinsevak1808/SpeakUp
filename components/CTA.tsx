import { SITE, WA_LINK } from "@/lib/data";
import { Reveal } from "./Reveal";
import { ButtonLink, Container } from "./Section";

export function CTA({ title = "Book your free demo class", text = "Meet your trainer, try a live activity and see if we are the right fit. No pressure, no cost." }: { title?: string; text?: string }) {
  return (
    <section className="bg-brand-800 py-16 text-white sm:py-20">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
            <p className="mt-3 text-lg text-brand-100">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact#demo" variant="light" size="lg">Book a Free Demo</ButtonLink>
            <ButtonLink href={WA_LINK()} external variant="ghost" size="lg">WhatsApp Us</ButtonLink>
          </div>
        </Reveal>
        <p className="mt-6 text-sm text-brand-200">Prefer to talk? Call <a href={`tel:${SITE.phoneRaw}`} className="font-semibold text-white underline underline-offset-4">{SITE.phone}</a></p>
      </Container>
    </section>
  );
}
