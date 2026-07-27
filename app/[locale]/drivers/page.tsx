import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { ShieldCheck, BadgeCheck, MapPin, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("drivers.title"),
    description: t("drivers.description"),
    alternates: { canonical: `https://www.moveotaxi.com/${locale}/drivers` },
  };
}

const TRUST_PILLARS = [
  { icon: ShieldCheck, key: "military"  as const, bg: "bg-[#E8F5EE]", color: "text-[#1B7A3C]", iconColor: "#1B7A3C" },
  { icon: BadgeCheck,  key: "licensed"  as const, bg: "bg-[#FFF3E6]", color: "text-[#F5922A]", iconColor: "#F5922A" },
  { icon: MapPin,      key: "expert"    as const, bg: "bg-[#E8F5EE]", color: "text-[#1B7A3C]", iconColor: "#1B7A3C" },
  { icon: Clock,       key: "available" as const, bg: "bg-[#FFF3E6]", color: "text-[#F5922A]", iconColor: "#F5922A" },
];

const STANDARDS = ["standard1", "standard2", "standard3", "standard4", "standard5"] as const;

export default async function DriversPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B7A3C] to-[#145F2E] py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Moveo Taxi
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            {t("driversPage.title")}
          </h1>
          <p className="text-[#B8DFCA] text-xl mb-8">{t("driversPage.subtitle")}</p>
          <a
            href={`/${locale}/booking`}
            className="inline-flex items-center gap-2 bg-[#F5922A] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#e07d1a] transition-colors shadow-xl"
          >
            {t("driversPage.book_cta")}
          </a>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">{t("driversPage.trust_title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_PILLARS.map((p) => (
              <div key={p.key} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className={`w-14 h-14 ${p.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <p.icon size={24} color={p.iconColor} />
                </div>
                <h3 className={`font-bold mb-2 ${p.color}`}>
                  {t(`driversPage.trust_${p.key}`)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(`driversPage.trust_${p.key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality standards */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">{t("driversPage.standards_title")}</h2>
          </div>
          <div className="space-y-3">
            {STANDARDS.map((key) => (
              <div key={key} className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm">
                <CheckCircle2 size={22} color="#1B7A3C" className="flex-shrink-0" />
                <p className="text-gray-700 font-medium">{t(`driversPage.${key}`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-4">{t("driversPage.book_subtitle")}</p>
            <a
              href={getWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#1da851] transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("driversPage.book_button")}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
