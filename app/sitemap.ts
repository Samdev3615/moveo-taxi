import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { ROUTE_PAGES } from "@/lib/route-pages";

const BASE_URL = "https://www.moveotaxi.com";

const pages = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/airport", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/routes", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/taxi-eilat", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/booking", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/drivers", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }

    for (const route of ROUTE_PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}/route/${route.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      });
    }
  }

  return entries;
}
