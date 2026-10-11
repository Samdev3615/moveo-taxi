import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllRoutePrices } from "@/lib/get-route-price";
import { ROUTE_PAGES } from "@/lib/route-pages";

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

// Every landing page gets a card (haifa-tel-aviv is the reverse of tel-aviv-haifa),
// plus pairs that are bookable but have no landing page yet.
const ROUTE_PAIRS = [
  ...ROUTE_PAGES.filter((r) => r.slug !== "haifa-tel-aviv").map(({ from, to, duration }) => ({ from, to, duration })),
  { from: "haifa", to: "beer_sheva", duration: "1h 45min" },
];

export default async function RoutesPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const priceMap = await getAllRoutePrices();

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
              const prices = priceMap.get(`${route.from}:${route.to}`);
              const sedanPrice = prices?.sedan ?? null;
              const minibusPrice = prices?.minibus ?? null;

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

              if (!sedanPrice && !landingPage) return null;

              const cardBody = (
                <>
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
                    <div className="text-xs text-gray-400 text-end">{route.duration}</div>
                  </div>
                  {sedanPrice && (
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
                  )}
                </>
              );

              return (
                <div
                  key={`${route.from}-${route.to}`}
                  className="bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col"
                >
                  {landingPage ? (
                    <Link href={`/${locale}/route/${landingPage.slug}`} className="flex-1 p-5 block">
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
