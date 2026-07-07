import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function PrivacyPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose text-gray-600 space-y-4">
            <p>
              Moveo Taxi respects your privacy. This policy explains how we collect and use
              personal information when you use our taxi booking service.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Information We Collect</h2>
            <p>
              We collect your name, phone number, email (optional), and trip details when
              you make a booking. This information is used solely to confirm and fulfill
              your reservation.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Data Storage</h2>
            <p>
              Your booking information is stored securely and is only accessible to our
              team. We do not sell or share your data with third parties.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Contact</h2>
            <p>
              For any privacy-related questions, please contact us via{" "}
              <Link href={`/${locale}/contact`} className="text-[#1B7A3C] font-semibold hover:underline">
                our contact page
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
