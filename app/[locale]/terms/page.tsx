import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8">{t("title")}</h1>
          <div className="prose text-gray-600 space-y-6">
            <p>{t("intro")}</p>

            <h2 className="text-xl font-bold text-gray-800">{t("booking_title")}</h2>
            <p>{t("booking_text")}</p>

            <h2 className="text-xl font-bold text-gray-800">{t("pricing_title")}</h2>
            <p>{t("pricing_text")}</p>

            <h2 className="text-xl font-bold text-gray-800">{t("payment_title")}</h2>
            <p>{t("payment_text")}</p>

            <h2 className="text-xl font-bold text-gray-800">{t("liability_title")}</h2>
            <p>{t("liability_text")}</p>

            <h2 className="text-xl font-bold text-gray-800">{t("contact_title")}</h2>
            <p>
              {t("contact_text")}{" "}
              <Link href={`/${locale}/contact`} className="text-[#16A34A] font-semibold hover:underline">
                {t("contact_link")}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
