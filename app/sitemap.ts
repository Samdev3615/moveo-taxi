import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { ROUTE_PAGES } from "@/lib/route-pages";
import { supabaseAdmin } from "@/lib/supabase-server";

const BASE_URL = "https://www.moveotaxi.com";

const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0, lastMod: "2026-10-11" },
  { path: "/airport", changeFrequency: "monthly" as const, priority: 0.9, lastMod: "2026-10-11" },
  { path: "/routes", changeFrequency: "monthly" as const, priority: 0.9, lastMod: "2026-10-11" },
  { path: "/taxi-eilat", changeFrequency: "monthly" as const, priority: 0.85, lastMod: "2026-07-23" },
  { path: "/booking", changeFrequency: "monthly" as const, priority: 0.8, lastMod: "2026-10-11" },
  { path: "/drivers", changeFrequency: "monthly" as const, priority: 0.7, lastMod: "2026-10-11" },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.6, lastMod: "2026-10-11" },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.6, lastMod: "2026-10-11" },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6, lastMod: "2026-10-11" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        lastModified: new Date("2026-10-11"),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      });
    }
  }

  // Blog articles published in Supabase
  const { data: posts } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, locale, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  for (const post of posts ?? []) {
    // Supabase slug = "article-slug-locale" → URL slug = "article-slug"
    const urlSlug = post.slug.replace(new RegExp(`-${post.locale}$`), "");
    entries.push({
      url: `${BASE_URL}/${post.locale}/blog/${urlSlug}`,
      lastModified: new Date(post.created_at as string),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }

  return entries;
}
