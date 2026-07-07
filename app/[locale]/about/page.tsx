import { getTranslations, getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";

export default async function AboutPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  const values = [
    {
      emoji: "🛡️",
      key: "reliable" as const,
      bg: "bg-[#E8F5EE]",
      color: "text-[#1B7A3C]",
    },
    {
      emoji: "⭐",
      key: "professional" as const,
      bg: "bg-[#FFF3E6]",
      color: "text-[#F5922A]",
    },
    {
      emoji: "⚡",
      key: "fast" as const,
      bg: "bg-[#E8F5EE]",
      color: "text-[#1B7A3C]",
    },
    {
      emoji: "💎",
      key: "transparent" as const,
      bg: "bg-[#FFF3E6]",
      color: "text-[#F5922A]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#1B7A3C] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🚕 Moveo Taxi
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {t("about.title")}
          </h1>
          <p className="text-gray-500 text-xl">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("about.mission_title")}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t("about.mission_text")}
              </p>
              <Link
                href={`/${locale}/booking`}
                className="inline-flex items-center gap-2 bg-[#1B7A3C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#145F2E] transition-colors"
              >
                {t("nav.book")}
                <span className="rtl:hidden">→</span>
                <span className="ltr:hidden">←</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "800+", label: t("stats.drivers"), color: "text-[#1B7A3C]" },
                { value: "25 000+", label: t("stats.clients"), color: "text-[#F5922A]" },
                { value: "50 000+", label: t("stats.trips"), color: "text-[#1B7A3C]" },
                { value: "100%", label: t("stats.safety"), color: "text-[#F5922A]" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-5 text-center">
                  <div className={`text-2xl font-black mb-1 ${stat.color}`} dir="ltr">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">{t("about.values_title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.key} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div
                  className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}
                >
                  {v.emoji}
                </div>
                <h3 className={`font-bold mb-2 ${v.color}`}>
                  {t(`about.value_${v.key}`)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(`about.value_${v.key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">{t("features.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(["reliable", "available", "fixed", "comfort"] as const).map((key) => (
              <div key={key} className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">
                  {t(`features.items.${key}.title`)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(`features.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#1B7A3C]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">{t("about.title")}</h2>
          <p className="text-[#B8DFCA] mb-6">{t("hero.subtitle")}</p>
          <Link
            href={`/${locale}/booking`}
            className="inline-block bg-white text-[#1B7A3C] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            {t("nav.book")}
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
