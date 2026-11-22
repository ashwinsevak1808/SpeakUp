import type { MetadataRoute } from "next";
import { COURSES, SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/courses", "/how-it-works", "/beyond-the-classroom", "/trainers", "/success-stories", "/pricing", "/free-ebook", "/faq", "/corporate", "/contact", "/level-test", ...COURSES.map((c) => `/courses/${c.slug}`)];
  return pages.map((p) => ({ url: SITE.url + p, lastModified: "2026-11-18", changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
