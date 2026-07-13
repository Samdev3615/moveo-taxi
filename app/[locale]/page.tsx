import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("home.title"), description: t("home.description") };
}
import { Users, Car, Globe, Clock, ShieldCheck, Tag, Lock, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import Image from "next/image";

const POPULAR_ROUTES = [
  {
    from: "jerusalem",
    to: "ben_gurion",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jerusalem_Dome_of_the_rock_BW_14.JPG/320px-Jerusalem_Dome_of_the_rock_BW_14.JPG",
    duration: "45 min",
    price: 180,
    type: "airport",
  },
  {
    from: "tel_aviv",
    to: "ben_gurion",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Azrieli_Towers_Tel_Aviv.jpg/320px-Azrieli_Towers_Tel_Aviv.jpg",
    duration: "30 min",
    price: 140,
    type: "airport",
  },
  {
    from: "haifa",
    to: "ben_gurion",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bahai_Garden_Haifa.jpg/320px-Bahai_Garden_Haifa.jpg",
    duration: "1h 15min",
    price: 200,
    type: "airport",
  },
  {
    from: "beer_sheva",
    to: "ben_gurion",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Negev_Bedouin.jpg/320px-Negev_Bedouin.jpg",
    duration: "1h",
    price: 250,
    type: "airport",
  },
];

type TFunc = (key: string) => string;

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] bg-gray-950 overflow-hidden">

        {/* Image en fond plein — aucune colonne, aucun collage */}
        <Image
          src="/images/hero-taxi-transfert-aeroport-israel.png"
          alt="Moveo Taxi — Transferts aéroport Ben Gurion Israël"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Dégradé sombre côté texte — naturel, pas de voile blanc */}
        <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-black/75 via-black/40 to-black/10" />
        {/* Léger fondu vers le bas */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] flex items-center">
          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-10 xl:gap-16 w-full py-16">

            {/* Texte — blanc sur fond sombre */}
            <div className="flex flex-col gap-7">

              <div className="inline-flex items-center gap-2.5 border border-white/25 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse flex-shrink-0" />
                {t("hero.badge")}
              </div>

              <h1 className="font-black tracking-tight leading-[0.90]">
                <span className="block text-[52px] sm:text-[62px] xl:text-[76px] text-white">
                  {t("hero.titleLine1")}
                </span>
                <span className="block text-[52px] sm:text-[62px] xl:text-[76px] text-[#16A34A]">
                  {t("hero.titleGreen")}
                </span>
                <span className="block text-[44px] sm:text-[52px] xl:text-[64px] text-[#F97316] mt-2">
                  {t("hero.titleOrange")}
                </span>
              </h1>

              <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-[400px]">
                {t("hero.subtitle")}
              </p>

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
                <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-[24px] bg-gradient-to-r from-[#16A34A] to-[#F97316] z-10" />
                <div className="rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden bg-white">
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
                    <div className="text-xs text-gray-400 leading-tight">{t(item.descKey)}</div>
                  </div>
                </div>
              );
            })}
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
              <div className="grid grid-cols-2 gap-4">
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
                      <div className="text-sm text-gray-500 font-medium mt-0.5">
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function RouteCard({
  route,
  t,
  locale,
}: {
  route: { from: string; to: string; image: string; duration: string; price: number; type: string };
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
      <div className="h-32 relative overflow-hidden bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]">
        <Image
          src={route.image}
          alt={t(`booking.form.cities.${route.from}`)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
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
        <p className="text-xs text-gray-400">{t(`booking.form.cities.${route.to}`)}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Car size={12} />
            {route.duration}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-black text-[#F97316]">₪{route.price}</span>
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
