import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { ROUTE_PAGES } from "@/lib/route-pages";

const BASE_URL = "https://www.moveotaxi.com";

const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0, lastMod: "2026-07-23" },
  { path: "/airport", changeFrequency: "monthly" as const, priority: 0.9, lastMod: "2026-07-07" },
  { path: "/routes", changeFrequency: "monthly" as const, priority: 0.9, lastMod: "2026-07-23" },
  { path: "/taxi-eilat", changeFrequency: "monthly" as const, priority: 0.85, lastMod: "2026-07-23" },
  { path: "/booking", changeFrequency: "monthly" as const, priority: 0.8, lastMod: "2026-07-01" },
  { path: "/drivers", changeFrequency: "monthly" as const, priority: 0.7, lastMod: "2026-07-01" },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.6, lastMod: "2026-07-23" },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6, lastMod: "2026-07-01" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(page.lastMod),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }

    for (const route of ROUTE_PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}/route/${route.slug}`,
        lastModified: new Date("2026-07-23"),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      });
    }
  }

  return entries;
}
