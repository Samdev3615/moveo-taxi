import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("home.title"), description: t("home.description") };
}
import { Users, Car, Globe, Clock, ShieldCheck, Tag, Lock, Headphones, Award, TrendingDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const POPULAR_ROUTE_DEFS = [
  {
    from: "jerusalem",
    to: "ben_gurion",
    image: "/images/route-jerusalem.jpg",
    duration: "45 min",
    type: "airport",
  },
  {
    from: "tel_aviv",
    to: "ben_gurion",
    image: "/images/route-tel-aviv.jpg",
    duration: "30 min",
    type: "airport",
  },
  {
    from: "haifa",
    to: "ben_gurion",
    image: "/images/route-haifa.jpg",
    duration: "1h 15min",
    type: "airport",
  },
  {
    from: "beer_sheva",
    to: "ben_gurion",
    image: "/images/route-beer-sheva.jpg",
    duration: "1h",
    type: "airport",
  },
];

type TFunc = (key: string) => string;

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations();
  const tDB = await getTranslations("driversBadge");
  const tPB = await getTranslations("priceBadge");
  const tHIW = await getTranslations("howItWorks");
  const tFAQ = await getTranslations("faq");
  const steps = tHIW.raw("steps") as Array<{ num: string; title: string; desc: string }>;
  const faqItems = tFAQ.raw("items") as Array<{ q: string; a: string }>;

  // Chargement des vrais prix depuis la base
  const { data: priceRows } = await supabase
    .from("route_prices")
    .select("from_city, to_city, car4_day")
    .in("from_city", POPULAR_ROUTE_DEFS.map((r) => r.from))
    .eq("to_city", "ben_gurion");

  const priceMap = Object.fromEntries(
    (priceRows ?? []).map((r) => [`${r.from_city}→${r.to_city}`, r.car4_day as number])
  );

  const POPULAR_ROUTES = POPULAR_ROUTE_DEFS.map((r) => ({
    ...r,
    price: priceMap[`${r.from}→${r.to}`] ?? null,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] bg-gray-950 overflow-hidden">

        {/* Image en fond plein — version RTL (hébreu) ou LTR selon la locale */}
        <Image
          src={locale === "he"
            ? "/images/hero-taxi-transfert-aeroport-israel.png"
            : "/images/hero-taxi-ltr.png"}
          alt="Moveo Taxi — Transferts aéroport Ben Gurion Israël"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />

        {/* Dégradé sombre côté texte — naturel, pas de voile blanc */}
        <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-black/75 via-black/40 to-black/10" />
        {/* Léger fondu vers le bas */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] flex items-center">
          <div className="grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-16 w-full py-16">

            {/* Texte — blanc sur fond sombre */}
            <div className="flex flex-col gap-7">

              <div className="inline-flex items-center gap-2.5 border border-white/25 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse flex-shrink-0" />
                {t("hero.badge")}
              </div>

              <h1 className="font-black tracking-tight leading-[0.90]">
                <span className="block text-[36px] sm:text-[52px] xl:text-[76px] text-white">
                  {t("hero.titleLine1")}
                </span>
                <span className="block text-[36px] sm:text-[52px] xl:text-[76px] text-[#16A34A]">
                  {t("hero.titleGreen")}
                </span>
                <span className="block text-[24px] sm:text-[34px] xl:text-[46px] text-[#F97316] mt-2">
                  {t("hero.titleOrange")}
                </span>
              </h1>

<div className="flex divide-x divide-white/20 rtl:divide-x-reverse">
                {[
                  { value: "800+", labelKey: "stats.drivers"   },
                  { value: "24/7", labelKey: "stats.available" },
                  { value: "5",    labelKey: "stats.languages" },
                ].map((stat, i) => (
                  <div key={stat.labelKey} className={i === 0 ? "pe-6" : "px-6"}>
                    <div className="text-2xl xl:text-3xl font-black text-white leading-none" dir="ltr">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/50 font-medium mt-1 leading-tight">
                      {t(stat.labelKey)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget — carte blanche qui ressort sur le fond sombre */}
            <div className="flex items-center">
              <div className="relative w-full max-w-[420px] mx-auto lg:mx-0">
                <div className="rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] bg-white">
                  <BookingWidget />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: ShieldCheck, labelKey: "trust.drivers", descKey: "trust.drivers_desc", color: "text-[#16A34A]", bg: "bg-[#16A34A]/8", border: "border-[#16A34A]/15" },
              { icon: Tag,         labelKey: "trust.prices",  descKey: "trust.prices_desc",  color: "text-[#F97316]", bg: "bg-[#F97316]/8", border: "border-[#F97316]/15" },
              { icon: Lock,        labelKey: "trust.payment", descKey: "trust.payment_desc", color: "text-[#16A34A]", bg: "bg-[#16A34A]/8", border: "border-[#16A34A]/15" },
              { icon: Headphones,  labelKey: "trust.support", descKey: "trust.support_desc", color: "text-[#F97316]", bg: "bg-[#F97316]/8", border: "border-[#F97316]/15" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.labelKey} className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.bg} ${item.border}`}>
                    <Icon size={19} className={item.color} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${item.color}`}>{t(item.labelKey)}</div>
                    <div className="text-xs text-gray-600 leading-tight">{t(item.descKey)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BANDEAUX GARANTIE ──────────────────────────────────── */}
      <section className="bg-gray-950 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 text-center sm:text-start divide-y sm:divide-y-0 sm:divide-x divide-white/10">

            {/* Badge chauffeurs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 py-5 sm:py-0 sm:pe-12 lg:pe-20">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center">
                <Award size={22} className="text-[#16A34A]" />
              </div>
              <div>
                <p className="text-white font-bold text-base sm:text-lg leading-tight">{tDB("title")}</p>
                <p className="text-gray-600 text-sm mt-0.5">{tDB("desc")}</p>
              </div>
            </div>

            {/* Badge prix */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 py-5 sm:py-0 sm:ps-12 lg:ps-20">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center">
                <TrendingDown size={22} className="text-[#F97316]" />
              </div>
              <div>
                <p className="text-white font-bold text-base sm:text-lg leading-tight">{tPB("title")}</p>
                <p className="text-gray-600 text-sm mt-0.5">{tPB("desc")}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            {tHIW("title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <HowItWorksStep key={i} step={step} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROUTES + STATS ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_240px] gap-12 xl:gap-16 items-start">

            {/* Routes */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t("routes.title")}</h2>
                <Link
                  href={`/${locale}/routes`}
                  className="text-[#16A34A] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  {t("routes.viewAll")}
                  <span className="rtl:hidden">→</span>
                  <span className="ltr:hidden">←</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POPULAR_ROUTES.map((route, i) => (
                  <RouteCard key={i} route={route} t={t} locale={locale} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-7 lg:pt-16">
              {[
                { icon: Users,  value: "800+", labelKey: "stats.drivers",      color: "text-[#16A34A]", bg: "bg-[#16A34A]/8" },
                { icon: Globe,  value: "5",    labelKey: "stats.languages",    color: "text-[#F97316]", bg: "bg-[#F97316]/8" },
                { icon: Clock,  value: "24/7", labelKey: "stats.available",    color: "text-[#16A34A]", bg: "bg-[#16A34A]/8" },
                { icon: Tag,    value: "0",    labelKey: "stats.noHiddenFees", color: "text-[#F97316]", bg: "bg-[#F97316]/8" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.labelKey} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                      <Icon size={22} className={stat.color} />
                    </div>
                    <div>
                      <div className={`text-[22px] font-black ${stat.color} leading-none`} dir="ltr">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium mt-0.5">
                        {t(stat.labelKey)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            {tFAQ("title")}
          </h2>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function HowItWorksStep({
  step,
  isLast,
}: {
  step: { num: string; title: string; desc: string };
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center text-center gap-4">
      {/* Connector line between steps (hidden on last) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-6 start-[calc(50%+28px)] end-0 h-[2px] bg-gradient-to-r from-[#16A34A]/40 to-[#F97316]/20 rtl:bg-gradient-to-l" />
      )}
      {/* Step number bubble */}
      <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center shadow-md flex-shrink-0">
        <span className="text-white font-black text-lg leading-none">{step.num}</span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-base mb-1">{step.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-gray-200 rounded-2xl bg-white overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none font-semibold text-gray-900 text-sm hover:bg-gray-50 transition-colors">
        <span>{q}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 group-open:text-[#16A34A] group-open:border-[#16A34A]/30 group-open:bg-[#16A34A]/5 transition-colors">
          <svg className="w-3 h-3 transition-transform group-open:rotate-180" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </summary>
      <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
        {a}
      </div>
    </details>
  );
}

function RouteCard({
  route,
  t,
  locale,
}: {
  route: { from: string; to: string; image: string; duration: string; price: number | null; type: string };
  t: TFunc;
  locale: string;
}) {
  const params = new URLSearchParams({
    type: route.type,
    from: route.from,
    to: route.to,
    direction: "to_airport",
  });

  return (
    <Link
      href={`/${locale}/booking?${params.toString()}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <div className="h-52 relative overflow-hidden bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]">
        <Image
          src={route.image}
          alt={t(`booking.form.cities.${route.from}`)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 start-2">
          <span className="bg-[#16A34A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {t(`booking.form.cities.${route.from}`).slice(0, 12)}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">
          {t(`booking.form.cities.${route.from}`)}
        </h3>
        <p className="text-xs text-gray-600">{t(`booking.form.cities.${route.to}`)}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Car size={12} />
            {route.duration}
          </div>
          <div className="flex items-center gap-1">
            {route.price !== null
              ? <span className="text-lg font-black text-[#F97316]">₪{route.price}</span>
              : <span className="text-xs text-gray-600 italic">{t("booking.price.quote")}</span>
            }
            <div className="bg-[#16A34A] rounded-full p-1 group-hover:bg-[#15803D] transition-colors">
              <span className="text-white text-xs font-bold px-0.5 rtl:hidden">→</span>
              <span className="text-white text-xs font-bold px-0.5 ltr:hidden">←</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
