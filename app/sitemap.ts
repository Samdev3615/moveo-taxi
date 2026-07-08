import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const BASE_URL = "https://www.moveotaxi.com";

const pages = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/airport", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/routes", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/booking", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date("2026-07-07"),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
