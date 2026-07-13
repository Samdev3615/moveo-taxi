import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8">{t("title")}</h1>
          <div className="prose text-gray-600 space-y-4">
            <p>{t("intro")}</p>
            <h2 className="text-xl font-bold text-gray-800">{t("section1_title")}</h2>
            <p>{t("section1_text")}</p>
            <h2 className="text-xl font-bold text-gray-800">{t("section2_title")}</h2>
            <p>{t("section2_text")}</p>
            <h2 className="text-xl font-bold text-gray-800">{t("section3_title")}</h2>
            <p>
              {t("section3_text")}{" "}
              <Link href={`/${locale}/contact`} className="text-[#16A34A] font-semibold hover:underline">
                {t("section3_link")}
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
