import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: { canonical: `https://www.moveotaxi.com/${locale}/contact` },
  };
}
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Phone, Mail, Clock } from "lucide-react";

const PHONE = "+972-54-310-0044";
const WHATSAPP_NUMBER = "972543100044";

export default async function ContactPage() {
  const t = await getTranslations();

  const channels = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      bg: "bg-[#25D366]",
      label: t("contact.whatsapp"),
      value: "WhatsApp",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      external: true,
    },
    {
      icon: <Phone size={24} color="white" />,
      bg: "bg-[#1B7A3C]",
      label: t("contact.call"),
      value: PHONE,
      href: `tel:${PHONE}`,
      external: false,
    },
    {
      icon: <Mail size={24} color="white" />,
      bg: "bg-[#F5922A]",
      label: t("contact.email"),
      value: "support@moveotaxi.com",
      href: "mailto:support@moveotaxi.com",
      external: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#1B7A3C] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            24/7
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-gray-500 text-xl">{t("contact.hoursValue")}</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5">
            {channels.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-5 bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`w-16 h-16 ${ch.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">{ch.label}</p>
                  <p className="text-xl font-black text-gray-900 truncate">{ch.value}</p>
                </div>
                <div className="text-gray-300 group-hover:text-[#1B7A3C] transition-colors">
                  <span className="text-2xl rtl:hidden">→</span>
                  <span className="text-2xl ltr:hidden">←</span>
                </div>
              </a>
            ))}
          </div>

          {/* Hours */}
          <div className="mt-10 bg-gray-50 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3"><Clock size={28} color="#1B7A3C" /></div>
            <h3 className="font-bold text-gray-900 mb-2">{t("contact.hours")}</h3>
            <p className="text-2xl font-black text-[#1B7A3C]">{t("contact.hoursValue")}</p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
