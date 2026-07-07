import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  const t = useTranslations("booking");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1a3c6e] mb-2 text-center">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            {t("price.note")}
          </p>
          <BookingForm />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
