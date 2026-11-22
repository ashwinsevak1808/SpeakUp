import Link from "next/link";
import { COURSES, SITE, WA_LINK } from "@/lib/data";
import { Logo } from "./Navbar";
import { Container } from "./Section";
import { Year } from "./Year";

const icon = "h-[18px] w-[18px] fill-current";
const SOCIALS = [
  { label: "Instagram", href: SITE.instagram, d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.2 6a1.1 1.1 0 1 1-1.1 1.1A1.1 1.1 0 0 1 17.2 6z" },
  { label: "Facebook", href: SITE.facebook, d: "M13.5 22v-8h2.7l.5-3.3h-3.2V8.6c0-.9.4-1.7 1.8-1.7h1.5V4.1S15.5 3.9 14.3 3.9c-2.6 0-4.1 1.5-4.1 4.3v2.5H7.5V14h2.7v8z" },
  { label: "YouTube", href: SITE.youtube, d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z" },
  { label: "LinkedIn", href: SITE.linkedin, d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" },
];

export function Footer() {
  return (
    <footer className="bg-brand-950 pt-16 text-brand-200">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs leading-relaxed">{SITE.tagline} Friendly, practical English training in {SITE.city}.</p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white transition-colors hover:bg-brand-600"
                >
                  <svg viewBox="0 0 24 24" className={icon}><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Courses</h3>
            <ul className="space-y-2.5">
              {COURSES.map((c) => (
                <li key={c.slug}><Link href={`/courses/${c.slug}`} className="transition-colors hover:text-white">{c.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Explore</h3>
            <ul className="space-y-2.5">
              {[["/about", "About Us"], ["/how-it-works", "How It Works"], ["/trainers", "Trainers"], ["/success-stories", "Success Stories"], ["/pricing", "Batches & Fees"], ["/level-test", "Free Level Test"], ["/free-ebook", "Free E-Book"], ["/faq", "FAQ"], ["/corporate", "Corporate"]].map(([h, l]) => (
                <li key={h}><Link href={h} className="transition-colors hover:text-white">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Say hello</h3>
            <ul className="space-y-3">
              <li>{SITE.address}</li>
              <li><a href={`tel:${SITE.phoneRaw}`} className="hover:text-white">{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
              <li className="text-sm">{SITE.hours}</li>
            </ul>
            <a href={WA_LINK()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500">
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-sm sm:flex-row">
          <p>© <Year /> {SITE.name}. All rights reserved.</p>
          <p className="text-brand-300">{SITE.city}, India</p>
        </div>
      </Container>
    </footer>
  );
}
