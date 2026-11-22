import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data";

const heading = Manrope({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
const body = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });

/* EDIT: SEO + Open Graph defaults (each page can override its own title/description) */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Spoken English & Communication Training in ${SITE.city}`,
    template: `%s | ${SITE.name}`,
  },
  description: `Learn spoken English, build confidence and master communication skills with live online classes and a personal practice login. A 3-month course from ₹3,000, with Mumbai in-person sessions available.`,
  keywords: ["spoken English classes", "English speaking course", "communication skills", "public speaking", "interview preparation", "corporate English training", SITE.city],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: "Spoken English, confidence and communication training with real practice, friendly trainers and visible progress.",
    locale: "en_IN",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#124a31" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: { "@type": "PostalAddress", streetAddress: SITE.address, addressLocality: SITE.city, addressCountry: "IN" },
  };
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="sr-only z-[70] rounded-lg bg-brand-800 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
