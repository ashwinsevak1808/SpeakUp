import Link from "next/link";
import { SITE, WA_LINK } from "@/lib/data";
import { Logo } from "./Navbar";
import { Container } from "./Section";
import { Year } from "./Year";

const LINKS = [["/how-it-works", "How It Works"], ["/courses", "Course"], ["/pricing", "Pricing"], ["/about", "About"], ["/faq", "FAQ"]];
const MORE = [["/level-test", "Free Level Test"], ["/free-ebook", "Free E-Book"], ["/verify", "Verify a Certificate"], ["/contact", "Contact"], ["/login", "Log in"]];
const SOCIALS = [["Instagram", SITE.instagram], ["YouTube", SITE.youtube], ["LinkedIn", SITE.linkedin]].filter(([, h]) => h);

export function Footer() {
  return (
    <footer className="bg-brand-950 pt-16 text-brand-200">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs leading-relaxed">{SITE.tagline}</p>
            {SOCIALS.length > 0 && <div className="mt-5 flex gap-4 text-sm">{SOCIALS.map(([l, h]) => <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="hover:text-white">{l}</a>)}</div>}
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">SpeakUp</h3>
            <ul className="space-y-2.5">{LINKS.map(([h, l]) => <li key={h}><Link href={h} className="transition-colors hover:text-white">{l}</Link></li>)}</ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Free tools</h3>
            <ul className="space-y-2.5">{MORE.map(([h, l]) => <li key={h}><Link href={h} className="transition-colors hover:text-white">{l}</Link></li>)}</ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Talk to us</h3>
            <ul className="space-y-3">
              <li><a href={`tel:${SITE.phoneRaw}`} className="hover:text-white">{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
              <li className="text-sm">{SITE.hours}</li>
            </ul>
            <a href={WA_LINK()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500">Chat on WhatsApp</a>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-sm sm:flex-row">
          <p>© <Year /> {SITE.legalName}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[["/privacy", "Privacy"], ["/terms", "Terms"], ["/refund-policy", "Refunds"], ["/delivery-policy", "Delivery"]].map(([h, l]) => <Link key={h} href={h} className="transition-colors hover:text-white">{l}</Link>)}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
