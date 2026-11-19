import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import PrintButton from "./PrintButton";

export const metadata: Metadata = { robots: "noindex, nofollow" };

const cityNames: Record<string, Record<string, string>> = {
  he: { tel_aviv: "תל אביב", jerusalem: "ירושלים", haifa: "חיפה", beer_sheva: "באר שבע", eilat: "אילת", netanya: "נתניה", ashdod: "אשדוד", rishon: "ראשון לציון", petah_tikva: "פתח תקווה", ben_gurion: "נמל תעופה בן גוריון", herzliya: "הרצליה", raanana: "רעננה", kfar_saba: "כפר סבא", modiin: "מודיעין", rehovot: "רחובות", nahariya: "נהריה" },
  en: { tel_aviv: "Tel Aviv", jerusalem: "Jerusalem", haifa: "Haifa", beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya", ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva", ben_gurion: "Ben Gurion Airport", herzliya: "Herzliya", raanana: "Ra'anana", kfar_saba: "Kfar Saba", modiin: "Modi'in", rehovot: "Rehovot", nahariya: "Nahariya" },
  fr: { tel_aviv: "Tel Aviv", jerusalem: "Jérusalem", haifa: "Haïfa", beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya", ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva", ben_gurion: "Aéroport Ben Gourion", herzliya: "Herzliya", raanana: "Ra'anana", kfar_saba: "Kfar Saba", modiin: "Modi'in", rehovot: "Rehovot", nahariya: "Nahariya" },
  ru: { tel_aviv: "Тель-Авив", jerusalem: "Иерусалим", haifa: "Хайфа", beer_sheva: "Беэр-Шева", eilat: "Эйлат", netanya: "Нетания", ashdod: "Ашдод", rishon: "Ришон-ле-Цион", petah_tikva: "Петах-Тиква", ben_gurion: "Аэропорт Бен-Гурион", herzliya: "Герцлия", raanana: "Раанана", kfar_saba: "Кфар-Саба", modiin: "Модиин", rehovot: "Реховот", nahariya: "Нагария" },
  es: { tel_aviv: "Tel Aviv", jerusalem: "Jerusalén", haifa: "Haifa", beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya", ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva", ben_gurion: "Aeropuerto Ben Gurión", herzliya: "Herzliya", raanana: "Ra'anana", kfar_saba: "Kfar Saba", modiin: "Modiin", rehovot: "Rehovot", nahariya: "Nahariya" },
};

const i18n: Record<string, { title: string; confirmed: string; ref: string; from: string; to: string; date: string; passengers: string; price: string; flight: string; print: string; contact: string; dir: "ltr" | "rtl" }> = {
  he: { title: "אישור הזמנה", confirmed: "ההזמנה אושרה ✓", ref: "מספר הזמנה", from: "מוצא", to: "יעד", date: "תאריך ושעה", passengers: "נוסעים", price: "מחיר", flight: "מספר טיסה", print: "הדפס / שמור PDF", contact: "ליצירת קשר: +972-54-310-0044", dir: "rtl" },
  en: { title: "Booking Confirmation", confirmed: "Booking Confirmed ✓", ref: "Booking ID", from: "From", to: "To", date: "Date & Time", passengers: "Passengers", price: "Price", flight: "Flight", print: "Print / Save as PDF", contact: "Contact: +972-54-310-0044", dir: "ltr" },
  fr: { title: "Confirmation de réservation", confirmed: "Réservation confirmée ✓", ref: "N° de réservation", from: "Départ", to: "Destination", date: "Date et heure", passengers: "Passagers", price: "Prix", flight: "Vol", print: "Imprimer / Enregistrer PDF", contact: "Contact : +972-54-310-0044", dir: "ltr" },
  ru: { title: "Подтверждение заказа", confirmed: "Заказ подтверждён ✓", ref: "Номер заказа", from: "Откуда", to: "Куда", date: "Дата и время", passengers: "Пассажиры", price: "Цена", flight: "Рейс", print: "Печать / Сохранить PDF", contact: "Контакт: +972-54-310-0044", dir: "ltr" },
  es: { title: "Confirmación de reserva", confirmed: "Reserva confirmada ✓", ref: "N° de reserva", from: "Origen", to: "Destino", date: "Fecha y hora", passengers: "Pasajeros", price: "Precio", flight: "Vuelo", print: "Imprimir / Guardar PDF", contact: "Contacto: +972-54-310-0044", dir: "ltr" },
};

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const lang = i18n[locale] ?? i18n.en;
  const cities = cityNames[locale] ?? cityNames.en;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("id, name, from_city, to_city, date, time, passengers, price_estimate, flight_number, status")
    .eq("id", id)
    .maybeSingle();

  if (!booking) notFound();

  const shortId = booking.id.slice(0, 8).toUpperCase();
  const fromCity = cities[booking.from_city] ?? booking.from_city;
  const toCity = cities[booking.to_city] ?? booking.to_city;

  const rows = [
    { label: lang.from,       value: fromCity },
    { label: lang.to,         value: toCity },
    { label: lang.date,       value: `${booking.date} — ${booking.time}` },
    { label: lang.passengers, value: String(booking.passengers ?? 1) },
    ...(booking.price_estimate ? [{ label: lang.price, value: `${booking.price_estimate} ₪` }] : []),
    ...(booking.flight_number  ? [{ label: lang.flight, value: booking.flight_number }] : []),
  ];

  return (
    <div dir={lang.dir} className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4 print:bg-white print:py-0">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none print:rounded-none print:max-w-full">

        {/* Header */}
        <div className="bg-[#1a3c6e] text-white px-8 py-6 print:py-4">
          <div className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-1">Moveo Taxi</div>
          <h1 className="text-xl font-bold">{lang.title}</h1>
        </div>

        {/* Confirmed banner */}
        <div className="bg-green-50 border-b border-green-100 px-8 py-3 flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">{lang.confirmed}</span>
        </div>

        {/* Booking ID */}
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="text-xs text-gray-400 mb-1">{lang.ref}</div>
          <div className="text-2xl font-mono font-bold text-[#1a3c6e]">#{shortId}</div>
          <div className="text-sm text-gray-500 mt-1">{booking.name}</div>
        </div>

        {/* Details table */}
        <div className="px-8 py-4">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 pr-4 text-gray-500 font-medium w-40">{row.label}</td>
                  <td className="py-3 font-semibold text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">{lang.contact}</span>
          <PrintButton label={lang.print} />
        </div>

      </div>

      {/* Print watermark */}
      <div className="hidden print:block mt-8 text-center text-xs text-gray-400">
        moveotaxi.com · +972-54-310-0044
      </div>
    </div>
  );
}
