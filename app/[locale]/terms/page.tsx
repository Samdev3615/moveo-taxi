import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function TermsPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose text-gray-600 space-y-4">
            <p>
              By using Moveo Taxi&apos;s booking service, you agree to the following terms.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Booking & Cancellation</h2>
            <p>
              Bookings are confirmed upon contact from our team. You may cancel your booking
              up to 2 hours before the scheduled pickup without charge. Late cancellations
              may incur a fee.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Pricing</h2>
            <p>
              All prices shown are fixed rates in New Israeli Shekel (₪). Prices are
              confirmed at the time of booking and will not change unless your route changes.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Liability</h2>
            <p>
              Moveo Taxi is not responsible for delays caused by traffic, weather, or other
              circumstances beyond our control.
            </p>
            <h2 className="text-xl font-bold text-gray-800">Contact</h2>
            <p>
              For questions about these terms, please{" "}
              <Link href={`/${locale}/contact`} className="text-[#1B7A3C] font-semibold hover:underline">
                contact us
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
