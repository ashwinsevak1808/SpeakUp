import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Photo } from "./Photo";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({ children, className, id, tone = "white" }: { children: ReactNode; className?: string; id?: string; tone?: "white" | "soft" | "dark" }) {
  const tones = { white: "bg-white", soft: "bg-brand-50", dark: "bg-brand-900 text-white" };
  return (
    <section id={id} className={cn("py-16 sm:py-24", tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text, align = "left", dark, className }: { eyebrow?: string; title: ReactNode; text?: string; align?: "center" | "left"; dark?: boolean; className?: string }) {
  return (
    <Reveal className={cn("mb-12 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("mb-3 text-sm font-semibold uppercase tracking-[0.12em]", dark ? "text-brand-300" : "text-brand-600")}>{eyebrow}</p>}
      <h2 className={cn("font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl", dark ? "text-white" : "text-brand-900")}>{title}</h2>
      {text && <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-brand-100" : "text-muted")}>{text}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, text, children, image, imageAlt, crumb }: { eyebrow: string; title: ReactNode; text?: string; children?: ReactNode; image?: string; imageAlt?: string; crumb?: string }) {
  return (
    <section className="border-b border-line bg-brand-50 pb-14 pt-12 sm:pb-20 sm:pt-16">
      <Container>
        <div className={cn("grid items-center gap-10", image && "lg:grid-cols-[1.1fr_0.9fr]")}>
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-muted">
              <Link href="/" className="hover:text-brand-700">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-brand-800">{crumb ?? eyebrow}</span>
            </nav>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">{eyebrow}</p>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand-900 sm:text-5xl">{title}</h1>
            {text && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{text}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {image && <Photo name={image} alt={imageAlt ?? ""} className="aspect-[4/3] rounded-lg" priority />}
        </div>
      </Container>
    </section>
  );
}

export function ButtonLink({ href, children, variant = "primary", className, external, size = "md" }: { href: string; children: ReactNode; variant?: "primary" | "outline" | "light" | "ghost"; className?: string; external?: boolean; size?: "sm" | "md" | "lg" }) {
  const v = {
    primary: "bg-brand-700 text-white hover:bg-brand-800",
    outline: "border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white",
    light: "bg-white text-brand-800 hover:bg-brand-100",
    ghost: "border border-white/40 text-white hover:bg-white/10",
  }[variant];
  const s = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-[15px]", lg: "px-8 py-3.5 text-base" }[size];
  const cls = cn("inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200", v, s, className);
  return external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}

export function Arrow() {
  return <span aria-hidden>→</span>;
}
