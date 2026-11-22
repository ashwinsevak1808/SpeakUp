import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/how-it-works", "/courses", "/pricing", "/about", "/faq", "/contact", "/level-test", "/free-ebook", "/verify"];
  return pages.map((p) => ({ url: SITE.url + p, lastModified: "2026-11-22", changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
