import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const BASE = "https://www.moveotaxi.com";
  return {
    title: t("routes.title"),
    description: t("routes.description"),
    alternates: {
      canonical: `${BASE}/${locale}/routes`,
      languages: {
        he: `${BASE}/he/routes`,
        en: `${BASE}/en/routes`,
        fr: `${BASE}/fr/routes`,
        ru: `${BASE}/ru/routes`,
        es: `${BASE}/es/routes`,
        "x-default": `${BASE}/he/routes`,
      },
    },
  };
}
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPrice, type CityKey } from "@/lib/prices";
import { ROUTE_PAGES } from "@/lib/route-pages";

const ROUTE_PAIRS: { from: CityKey; to: CityKey; duration: string }[] = [
  { from: "tel_aviv", to: "jerusalem", duration: "1h 10min" },
  { from: "tel_aviv", to: "haifa", duration: "1h 00min" },
  { from: "tel_aviv", to: "ben_gurion", duration: "30 min" },
  { from: "tel_aviv", to: "beer_sheva", duration: "1h 10min" },
  { from: "tel_aviv", to: "eilat", duration: "3h 30min" },
  { from: "tel_aviv", to: "netanya", duration: "35 min" },
  { from: "jerusalem", to: "ben_gurion", duration: "45 min" },
  { from: "jerusalem", to: "haifa", duration: "1h 30min" },
  { from: "jerusalem", to: "beer_sheva", duration: "1h 05min" },
  { from: "jerusalem", to: "eilat", duration: "3h 10min" },
  { from: "haifa", to: "ben_gurion", duration: "1h 15min" },
  { from: "haifa", to: "beer_sheva", duration: "1h 45min" },
  { from: "haifa", to: "netanya", duration: "30 min" },
  { from: "beer_sheva", to: "ben_gurion", duration: "35 min" },
  { from: "beer_sheva", to: "eilat", duration: "2h 10min" },
  { from: "netanya", to: "ben_gurion", duration: "30 min" },
];

export default async function RoutesPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#1B7A3C] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {t("nav.routes")}
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">{t("routes.title")}</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t("routes.subtitle")}</p>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ROUTE_PAIRS.map((route) => {
              const sedanPrice = getPrice(route.from, route.to, "sedan");
              const minibusPrice = getPrice(route.from, route.to, "minibus");
              if (!sedanPrice) return null;

              const bookingParams = new URLSearchParams({
                type: route.to === "ben_gurion" || route.from === "ben_gurion" ? "airport" : "intercity",
                from: route.from,
                to: route.to,
              });

              const landingPage = ROUTE_PAGES.find(
                (r) =>
                  (r.from === route.from && r.to === route.to) ||
                  (r.from === route.to && r.to === route.from)
              );

              const cardBody = (
                <>
                  {/* Route header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#1B7A3C] flex-shrink-0" />
                        {t(`booking.form.cities.${route.from}`)}
                      </div>
                      <div className="w-px h-3 bg-gray-200 ms-[3px]" />
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-[#F5922A] flex-shrink-0" />
                        {t(`booking.form.cities.${route.to}`)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-end">
                      {route.duration}
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{t("booking.form.vehicles.sedan")}</span>
                      <span className="font-black text-[#F5922A]" dir="ltr">₪{sedanPrice}</span>
                    </div>
                    {minibusPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{t("booking.form.vehicles.minibus")}</span>
                        <span className="font-black text-[#1B7A3C]" dir="ltr">₪{minibusPrice}</span>
                      </div>
                    )}
                  </div>
                </>
              );

              return (
                <div
                  key={`${route.from}-${route.to}`}
                  className="bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col"
                >
                  {landingPage ? (
                    <Link
                      href={`/${locale}/route/${landingPage.slug}`}
                      className="flex-1 p-5 block"
                    >
                      {cardBody}
                    </Link>
                  ) : (
                    <div className="flex-1 p-5">{cardBody}</div>
                  )}

                  <div className="px-5 pb-5">
                    <Link
                      href={`/${locale}/booking?${bookingParams.toString()}`}
                      className="block bg-[#1B7A3C] text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-[#145F2E] transition-colors"
                    >
                      {t("routes.book")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-[#E8F5EE]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#1B7A3C] text-sm font-medium">
            ✓ {t("trust.prices_desc")} &nbsp;·&nbsp; ✓ {t("trust.drivers_desc")} &nbsp;·&nbsp; ✓ {t("trust.support_desc")}
          </p>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
