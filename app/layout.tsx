import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Nunito } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data";

const heading = Manrope({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
const body = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const brand = Nunito({ variable: "--font-brand", weight: ["800", "900"], subsets: ["latin"], display: "swap" }); // logo wordmark only

/* EDIT: SEO + Open Graph defaults (each page can override its own title/description) */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Learn Spoken English Online`,
    template: `%s | ${SITE.name}`,
  },
  description: "Learn English with SpeakUp: daily 15-minute lessons, every grammar topic and live online classes with skilled trainers. Register for free.",
  keywords: ["spoken English classes", "English speaking course", "communication skills", "public speaking", "interview preparation", "learn English online", "English grammar course"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | Learn Spoken English Online`,
    description: SITE.tagline,
    locale: "en_IN",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "SpeakUp: learn English online" }],
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
    areaServed: "IN",
    description: "Online spoken English classes: daily lessons and live online classes.",
  };
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${brand.variable} scroll-smooth`}>
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
