import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabaseAdmin } from "@/lib/supabase-server";
import { ArrowRight, Calendar } from "lucide-react";

const BASE_URL = "https://www.moveotaxi.com";

const LOCALE_LABELS: Record<string, { label: string; flag: string; blogTitle: string; blogSubtitle: string; readMore: string; noPosts: string }> = {
  fr: { label: "Français", flag: "🇫🇷", blogTitle: "Blog Moveo Taxi", blogSubtitle: "Guides, conseils et informations sur le taxi en Israël", readMore: "Lire l'article", noPosts: "Aucun article publié pour le moment." },
  en: { label: "English",  flag: "🇬🇧", blogTitle: "Moveo Taxi Blog", blogSubtitle: "Guides, tips and information about taxi in Israel", readMore: "Read article", noPosts: "No articles published yet." },
  he: { label: "עברית",    flag: "🇮🇱", blogTitle: "בלוג מובאו טקסי", blogSubtitle: "מדריכים, טיפים ומידע על שירותי מונית בישראל", readMore: "קרא את המאמר", noPosts: "אין מאמרים שפורסמו עדיין." },
  ru: { label: "Русский",  flag: "🇷🇺", blogTitle: "Блог Moveo Taxi", blogSubtitle: "Руководства, советы и информация о такси в Израиле", readMore: "Читать статью", noPosts: "Пока нет опубликованных статей." },
  es: { label: "Español",  flag: "🇪🇸", blogTitle: "Blog Moveo Taxi", blogSubtitle: "Guías, consejos e información sobre taxis en Israel", readMore: "Leer artículo", noPosts: "No hay artículos publicados aún." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const labels = LOCALE_LABELS[locale];
  if (!labels) return {};

  return {
    title: `${labels.blogTitle} — Moveo Taxi`,
    description: labels.blogSubtitle,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        he: `${BASE_URL}/he/blog`,
        en: `${BASE_URL}/en/blog`,
        fr: `${BASE_URL}/fr/blog`,
        ru: `${BASE_URL}/ru/blog`,
        es: `${BASE_URL}/es/blog`,
        "x-default": `${BASE_URL}/he/blog`,
      },
    },
  };
}

export const revalidate = 3600;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const labels = LOCALE_LABELS[locale];
  if (!labels) notFound();

  const { data: posts } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, locale, title, excerpt, created_at")
    .eq("locale", locale)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const isRtl = locale === "he";

  return (
    <div className="flex flex-col min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#16A34A] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {labels.flag} Blog
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
            {labels.blogTitle}
          </h1>
          <p className="text-gray-500 text-lg">{labels.blogSubtitle}</p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 bg-white flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!posts || posts.length === 0 ? (
            <p className="text-gray-400 text-center py-20">{labels.noPosts}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                // URL slug = stored slug without the "-{locale}" suffix
                const urlSlug = post.slug.replace(new RegExp(`-${locale}$`), "");
                const date = new Date(post.created_at).toLocaleDateString(
                  locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                );
                return (
                  <Link
                    key={post.slug}
                    href={`/${locale}/blog/${urlSlug}`}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <Calendar size={12} />
                        {date}
                      </div>
                      <h2 className="font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-[#16A34A] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A]">
                        {labels.readMore}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
