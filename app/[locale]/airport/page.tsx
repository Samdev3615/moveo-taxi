import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("airport.title"),
    description: t("airport.description"),
    alternates: { canonical: `https://www.moveotaxi.com/${locale}/airport` },
  };
}
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BookingWidget from "@/components/BookingWidget";
import { Wifi, Clock, Building, Smartphone, CheckCircle, Car, MapPin, Plane, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "972543100044";
const PHONE = "+972-54-310-0044";

const AIRPORT_ROUTES = [
  { city: "tel_aviv", duration: "30 min", price: 140 },
  { city: "jerusalem", duration: "45 min", price: 180 },
  { city: "haifa", duration: "1h 15min", price: 200 },
  { city: "beer_sheva", duration: "35 min", price: 250 },
  { city: "netanya", duration: "30 min", price: 160 },
  { city: "ashdod", duration: "25 min", price: 170 },
  { city: "eilat", duration: "3h 30min", price: 730 },
  { city: "rishon", duration: "20 min", price: 120 },
];

export default async function AirportPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#1B7A3C] text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Ben Gurion Airport (TLV)
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {t("airport.title")}
              </h1>
              <p className="text-gray-500 text-lg mb-8">{t("airport.subtitle")}</p>

              <div className="space-y-4 mb-8">
                {[
                  { Icon: Wifi,     text: t("airport.flightMonitoring") },
                  { Icon: Clock,    text: t("airport.waitingTime") },
                  { Icon: Building, text: t("airport.terminals") },
                  { Icon: Clock,    text: "24/7" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
                      <item.Icon size={18} color="#1B7A3C" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl(locale)}
                  className="inline-flex items-center gap-2 bg-[#1B7A3C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#145F2E] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("contact.whatsapp")}
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 border-2 border-[#1B7A3C] text-[#1B7A3C] px-6 py-3 rounded-xl font-semibold hover:bg-[#E8F5EE] transition-colors"
                >
                  <Phone size={16} /> {PHONE}
                </a>
              </div>
            </div>

            <div>
              <BookingWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Price Grid */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("routes.title")} — Ben Gurion
            </h2>
            <p className="text-gray-500">{t("routes.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {AIRPORT_ROUTES.map((route) => (
              <Link
                key={route.city}
                href={`/${locale}/booking?type=airport&from=${route.city}&to=ben_gurion&direction=to_airport`}
                className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 bg-[#E8F5EE] rounded-xl flex items-center justify-center">
                    <MapPin size={16} color="#1B7A3C" />
                  </div>
                  <span className="bg-[#FFF3E6] text-[#F5922A] text-xs font-bold px-2.5 py-1 rounded-full">
                    <Plane size={12} />
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-0.5">
                  {t(`booking.form.cities.${route.city}`)}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  {t("booking.form.cities.ben_gurion")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{route.duration}</span>
                  <span className="text-lg font-black text-[#F5922A]">₪{route.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("features.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", Icon: Smartphone,   title: t("features.items.reliable.title"),  desc: t("features.items.reliable.description") },
              { step: "2", Icon: CheckCircle,  title: t("features.items.available.title"), desc: t("features.items.available.description") },
              { step: "3", Icon: Car,          title: t("features.items.fixed.title"),     desc: t("features.items.fixed.description") },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#E8F5EE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.Icon size={22} color="#1B7A3C" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#1B7A3C]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">{t("airport.title")}</h2>
          <p className="text-[#B8DFCA] mb-6">{t("airport.subtitle")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/${locale}/booking?type=airport`}
              className="bg-white text-[#1B7A3C] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              {t("nav.book")}
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
