import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ROUTE_PAGES, getRouteBySlug } from "@/lib/route-pages";
import { getPrice } from "@/lib/prices";
import { ShieldCheck, Clock, Car, Globe, MapPin, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "972543100044";
const BASE_URL = "https://www.moveotaxi.com";

export function generateStaticParams() {
  return ROUTE_PAGES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return {};

  const tp = await getTranslations({ locale, namespace: "routePage" });
  const tb = await getTranslations({ locale, namespace: "booking" });
  const fromName = tb(`form.cities.${route.from}`);
  const toName = tb(`form.cities.${route.to}`);
  const sedanPrice = getPrice(route.from, route.to, "sedan");

  const fixedPriceLabel: Record<string, string> = {
    fr: "prix fixe",
    en: "fixed price",
    he: "מחיר קבוע",
    ru: "фиксированная цена",
    es: "precio fijo",
  };

  const descByLocale: Record<string, string> = {
    fr: `Taxi privé ${fromName} → ${toName}${sedanPrice ? ` au prix fixe de ₪${sedanPrice}` : ""}. Aucun compteur, chauffeurs professionnels. Réservation en ligne 24h/24.`,
    en: `Private taxi ${fromName} to ${toName}${sedanPrice ? ` at fixed price ₪${sedanPrice}` : ""}. No meter, professional drivers. Book online 24/7.`,
    he: `מונית פרטית ${fromName} → ${toName}${sedanPrice ? ` במחיר קבוע ₪${sedanPrice}` : ""}. ללא מד מרחק. הזמנה אונליין 24/7.`,
    ru: `Частное такси ${fromName} → ${toName}${sedanPrice ? ` по фиксированной цене ₪${sedanPrice}` : ""}. Без счётчика. Бронирование онлайн 24/7.`,
    es: `Taxi privado ${fromName} → ${toName}${sedanPrice ? ` a precio fijo ₪${sedanPrice}` : ""}. Sin taxímetro. Reserva online 24/7.`,
  };

  const title = sedanPrice
    ? `Taxi ${fromName} → ${toName} — ₪${sedanPrice} ${fixedPriceLabel[locale] ?? "fixed price"} | Moveo Taxi`
    : tp("meta_title", { from: fromName, to: toName });

  return {
    title,
    description: descByLocale[locale] ?? tp("meta_desc", { from: fromName, to: toName }),
    alternates: {
      canonical: `${BASE_URL}/${locale}/route/${slug}`,
      languages: {
        he: `${BASE_URL}/he/route/${slug}`,
        en: `${BASE_URL}/en/route/${slug}`,
        fr: `${BASE_URL}/fr/route/${slug}`,
        ru: `${BASE_URL}/ru/route/${slug}`,
        es: `${BASE_URL}/es/route/${slug}`,
        "x-default": `${BASE_URL}/he/route/${slug}`,
      },
    },
  };
}

export default async function RouteSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const tp = await getTranslations({ locale, namespace: "routePage" });
  const tb = await getTranslations({ locale, namespace: "booking" });

  const fromName = tb(`form.cities.${route.from}`);
  const toName = tb(`form.cities.${route.to}`);

  const sedanPrice = getPrice(route.from, route.to, "sedan");
  const minibusPrice = getPrice(route.from, route.to, "minibus");

  const bookingParams = new URLSearchParams({
    type: route.to === "ben_gurion" || route.from === "ben_gurion" ? "airport" : "intercity",
    from: route.from,
    to: route.to,
    ...(route.to === "ben_gurion" ? { direction: "to_airport" } : {}),
  });

  const features = [
    { Icon: ShieldCheck, title: tp("fixed_price"),    desc: tp("fixed_price_desc") },
    { Icon: Car,         title: tp("pro_drivers"),    desc: tp("pro_drivers_desc") },
    { Icon: Clock,       title: tp("available"),      desc: tp("available_desc") },
    { Icon: Globe,       title: tp("multilingual"),   desc: tp("multilingual_desc") },
  ];

  const faqs = [
    {
      q: tp("faq_q1", { from: fromName, to: toName }),
      a: tp("faq_a1", { from: fromName, to: toName }),
    },
    {
      q: tp("faq_q2", { from: fromName, to: toName }),
      a: tp("faq_a2", { from: fromName, to: toName, duration: route.duration }),
    },
    {
      q: tp("faq_q3", { from: fromName, to: toName }),
      a: tp("faq_a3", { from: fromName, to: toName }),
    },
    {
      q: tp("faq_q4", { from: fromName, to: toName }),
      a: tp("faq_a4", { from: fromName, to: toName }),
    },
  ];

  const routesLabel: Record<string, string> = {
    fr: "Toutes les routes", en: "All routes", he: "כל המסלולים", ru: "Все маршруты", es: "Todas las rutas",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Moveo Taxi", "item": `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": routesLabel[locale] ?? "Routes", "item": `${BASE_URL}/${locale}/routes` },
      { "@type": "ListItem", "position": 3, "name": `${fromName} → ${toName}`, "item": `${BASE_URL}/${locale}/route/${slug}` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 py-3" aria-label="breadcrumb">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-gray-400 flex-wrap" dir="ltr">
            <li><Link href={`/${locale}`} className="hover:text-gray-600 transition-colors">Moveo Taxi</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/routes`} className="hover:text-gray-600 transition-colors">{routesLabel[locale] ?? "Routes"}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">{fromName} → {toName}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#16A34A] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <MapPin size={14} />
            {fromName} → {toName}
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
            {tp("hero_title", { from: fromName, to: toName })}
          </h1>
          <p className="text-gray-500 text-lg mb-8">{tp("hero_subtitle")}</p>

          {/* Price + info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {sedanPrice && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">
                  {tp("price_from")} · Sedan
                </p>
                <p className="text-3xl font-black text-[#F97316]" dir="ltr">
                  ₪{sedanPrice}
                </p>
                <p className="text-xs text-gray-400 mt-1">{tp("per_trip")}</p>
              </div>
            )}
            {minibusPrice && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">
                  {tp("price_from")} · Van
                </p>
                <p className="text-3xl font-black text-[#16A34A]" dir="ltr">
                  ₪{minibusPrice}
                </p>
                <p className="text-xs text-gray-400 mt-1">{tp("per_trip")}</p>
              </div>
            )}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-2">{tp("duration_label")}</p>
              <p className="text-xl font-bold text-gray-900">{route.duration}</p>
              <p className="text-xs text-gray-400 mt-1">
                {route.distance} {tp("km")}
              </p>
            </div>
          </div>

          <Link
            href={`/${locale}/booking?${bookingParams.toString()}`}
            className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#15803D] transition-colors shadow-lg shadow-[#16A34A]/20"
          >
            {tp("book_route")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5">
                <div className="w-10 h-10 bg-[#E8F5EE] rounded-xl flex items-center justify-center mb-3">
                  <f.Icon size={18} color="#16A34A" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {tp("faq_title")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#16A34A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">
            {tp("hero_title", { from: fromName, to: toName })}
          </h2>
          <p className="text-[#B8DFCA] mb-6">{tp("hero_subtitle")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/${locale}/booking?${bookingParams.toString()}`}
              className="bg-white text-[#16A34A] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              {tp("book_route")}
            </Link>
            <a
              href={getWhatsAppUrl(locale)}
              className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1da851] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
