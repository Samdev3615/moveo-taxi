import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Calendar, ChevronRight } from "lucide-react";

const BASE_URL = "https://www.moveotaxi.com";

const CTA_LABELS: Record<string, { book: string; whatsapp: string; breadcrumbBlog: string; breadcrumbHome: string; publishedOn: string }> = {
  fr: { book: "Réserver un taxi", whatsapp: "Contacter sur WhatsApp", breadcrumbBlog: "Blog", breadcrumbHome: "Accueil", publishedOn: "Publié le" },
  en: { book: "Book a taxi", whatsapp: "Contact on WhatsApp", breadcrumbBlog: "Blog", breadcrumbHome: "Home", publishedOn: "Published on" },
  he: { book: "הזמן מונית", whatsapp: "צור קשר בוואטסאפ", breadcrumbBlog: "בלוג", breadcrumbHome: "דף הבית", publishedOn: "פורסם ב" },
  ru: { book: "Заказать такси", whatsapp: "Связаться в WhatsApp", breadcrumbBlog: "Блог", breadcrumbHome: "Главная", publishedOn: "Опубликовано" },
  es: { book: "Reservar un taxi", whatsapp: "Contactar por WhatsApp", breadcrumbBlog: "Blog", breadcrumbHome: "Inicio", publishedOn: "Publicado el" },
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dbSlug = `${slug}-${locale}`;

  const { data: post } = await supabaseAdmin
    .from("blog_posts")
    .select("title, excerpt, slug")
    .eq("slug", dbSlug)
    .eq("locale", locale)
    .eq("status", "published")
    .single();

  if (!post) return {};

  return {
    title: `${post.title} — Moveo Taxi`,
    description: post.excerpt ?? undefined,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        he: `${BASE_URL}/he/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`,
        fr: `${BASE_URL}/fr/blog/${slug}`,
        ru: `${BASE_URL}/ru/blog/${slug}`,
        es: `${BASE_URL}/es/blog/${slug}`,
        "x-default": `${BASE_URL}/he/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      siteName: "Moveo Taxi",
      type: "article",
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const labels = CTA_LABELS[locale];
  if (!labels) notFound();

  // The stored slug = URL slug + "-" + locale (e.g., "prix-taxi-israel-fr")
  const dbSlug = `${slug}-${locale}`;

  const { data: post } = await supabaseAdmin
    .from("blog_posts")
    .select("title, excerpt, content, created_at, slug")
    .eq("slug", dbSlug)
    .eq("locale", locale)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const isRtl = locale === "he";
  const date = new Date(post.created_at).toLocaleDateString(
    locale === "he" ? "he-IL" : locale === "ru" ? "ru-RU" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="flex flex-col min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">{labels.breadcrumbHome}</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/blog`} className="hover:text-gray-700 transition-colors">{labels.breadcrumbBlog}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="py-12 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Calendar size={12} />
            <span>{labels.publishedOn} {date}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100">
              {post.excerpt}
            </p>
          )}

          {/* Article content (HTML from AI writer) */}
          <div
            className="prose prose-gray max-w-none
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3
              [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1
              [&_li]:text-gray-600 [&_li]:leading-relaxed
              [&_strong]:text-gray-800 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* CTA */}
      <section className="py-14 bg-[#16A34A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Moveo Taxi</h2>
          <p className="text-[#B8DFCA] mb-6 text-sm">moveotaxi.com · +972-54-310-0044</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex items-center gap-2 bg-white text-[#16A34A] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              {labels.book}
              <ArrowRight size={16} />
            </Link>
            <a
              href={getWhatsAppUrl(locale)}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1da851] transition-colors"
            >
              {labels.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
