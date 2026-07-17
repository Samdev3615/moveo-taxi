import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const cityNames: Record<string, Record<string, string>> = {
  he: { tel_aviv: "תל אביב", jerusalem: "ירושלים", haifa: "חיפה", beer_sheva: "באר שבע", eilat: "אילת", netanya: "נתניה", ashdod: "אשדוד", rishon: "ראשון לציון", petah_tikva: "פתח תקווה", ben_gurion: "נמל תעופה בן גוריון" },
  en: { tel_aviv: "Tel Aviv", jerusalem: "Jerusalem", haifa: "Haifa", beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya", ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva", ben_gurion: "Ben Gurion Airport" },
  fr: { tel_aviv: "Tel Aviv", jerusalem: "Jérusalem", haifa: "Haïfa", beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya", ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva", ben_gurion: "Aéroport Ben Gourion" },
  ru: { tel_aviv: "Тель-Авив", jerusalem: "Иерусалим", haifa: "Хайфа", beer_sheva: "Беэр-Шева", eilat: "Эйлат", netanya: "Нетания", ashdod: "Ашдод", rishon: "Ришон-ле-Цион", petah_tikva: "Петах-Тиква", ben_gurion: "Аэропорт Бен-Гурион" },
  es: { tel_aviv: "Tel Aviv", jerusalem: "Jerusalén", haifa: "Haifa", beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya", ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva", ben_gurion: "Aeropuerto Ben Gurión" },
};

const confirmationTemplates: Record<string, {
  subject: (id: string) => string;
  title: string;
  subtitle: string;
  labels: { from: string; to: string; date: string; passengers: string; price: string; phone: string; id: string; contact: string };
  isRtl: boolean;
}> = {
  he: {
    subject: (id) => `אישור הזמנה #${id} — Moveo Taxi`,
    title: "הזמנתך התקבלה!",
    subtitle: "תודה על פנייתך. אנו ניצור איתך קשר בקרוב לאישור הנסיעה.",
    labels: { from: "מוצא", to: "יעד", date: "תאריך", passengers: "נוסעים", price: "מחיר משוער", phone: "טלפון", id: "מספר הזמנה", contact: "ליצירת קשר: " },
    isRtl: true,
  },
  en: {
    subject: (id) => `Booking Confirmation #${id} — Moveo Taxi`,
    title: "Your booking is confirmed!",
    subtitle: "Thank you for booking with us. We will contact you shortly to confirm your trip.",
    labels: { from: "From", to: "To", date: "Date", passengers: "Passengers", price: "Estimated price", phone: "Phone", id: "Booking ID", contact: "Contact us: " },
    isRtl: false,
  },
  fr: {
    subject: (id) => `Confirmation de réservation #${id} — Moveo Taxi`,
    title: "Votre réservation est reçue !",
    subtitle: "Merci pour votre réservation. Nous vous contacterons rapidement pour confirmer votre trajet.",
    labels: { from: "Départ", to: "Destination", date: "Date", passengers: "Passagers", price: "Prix estimé", phone: "Téléphone", id: "N° de réservation", contact: "Nous contacter : " },
    isRtl: false,
  },
  ru: {
    subject: (id) => `Подтверждение бронирования #${id} — Moveo Taxi`,
    title: "Ваш заказ получен!",
    subtitle: "Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения поездки.",
    labels: { from: "Откуда", to: "Куда", date: "Дата", passengers: "Пассажиры", price: "Примерная цена", phone: "Телефон", id: "Номер заказа", contact: "Связаться с нами: " },
    isRtl: false,
  },
  es: {
    subject: (id) => `Confirmación de reserva #${id} — Moveo Taxi`,
    title: "¡Tu reserva ha sido recibida!",
    subtitle: "Gracias por reservar con nosotros. Nos pondremos en contacto con usted pronto para confirmar su viaje.",
    labels: { from: "Origen", to: "Destino", date: "Fecha", passengers: "Pasajeros", price: "Precio estimado", phone: "Teléfono", id: "N° de reserva", contact: "Contáctenos: " },
    isRtl: false,
  },
};

type BookingData = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  trip_type: string;
  passengers?: number;
  vehicle_type?: string;
  price_estimate?: number | null;
  flight_number?: string | null;
  locale?: string;
};

export async function sendBookingNotification(booking: BookingData) {
  const shortId = booking.id.slice(0, 8).toUpperCase();

  await transporter.sendMail({
    from: `"Moveo Taxi" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `Nouvelle réservation #${shortId} — ${booking.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16A34A; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 22px;">Nouvelle réservation</h1>
          <p style="margin: 5px 0 0; opacity: 0.85;">ID : #${shortId}</p>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Client</td><td style="padding: 8px 0; font-weight: bold;">${booking.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Téléphone</td><td style="padding: 8px 0;"><a href="tel:${booking.phone}" style="color: #16A34A;">${booking.phone}</a></td></tr>
            ${booking.email ? `<tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;">${booking.email}</td></tr>` : ""}
            <tr><td colspan="2" style="padding: 12px 0;"><hr style="border: none; border-top: 1px solid #e5e7eb;"></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Trajet</td><td style="padding: 8px 0; font-weight: bold;">${booking.from_city} → ${booking.to_city}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0;">${booking.date} à ${booking.time}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Type</td><td style="padding: 8px 0;">${booking.trip_type === "airport" ? "Aéroport" : "Inter-ville"}</td></tr>
            ${booking.flight_number ? `<tr><td style="padding: 8px 0; color: #6b7280;">Vol</td><td style="padding: 8px 0;">${booking.flight_number}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #6b7280;">Passagers</td><td style="padding: 8px 0;">${booking.passengers || 1}</td></tr>
            ${booking.price_estimate ? `<tr><td style="padding: 8px 0; color: #6b7280;">Prix estimé</td><td style="padding: 8px 0; font-weight: bold; color: #16A34A;">${booking.price_estimate}₪</td></tr>` : ""}
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://moveotaxi.com/admin" style="background: #16A34A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Voir dans le panel admin</a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendClientConfirmation(booking: BookingData) {
  if (!booking.email) return;

  const locale = booking.locale && confirmationTemplates[booking.locale] ? booking.locale : "en";
  const tpl = confirmationTemplates[locale];
  const cities = cityNames[locale] || cityNames.en;
  const shortId = booking.id.slice(0, 8).toUpperCase();

  const fromCity = cities[booking.from_city] || booking.from_city;
  const toCity = cities[booking.to_city] || booking.to_city;
  const dir = tpl.isRtl ? "rtl" : "ltr";

  await transporter.sendMail({
    from: `"Moveo Taxi" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: tpl.subject(shortId),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: ${dir};">
        <div style="background: #1a3c6e; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0 0 8px; font-size: 24px;">${tpl.title}</h1>
          <p style="margin: 0; opacity: 0.85; font-size: 15px;">${tpl.subtitle}</p>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;">
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">${tpl.labels.id}</div>
            <div style="font-size: 22px; font-weight: bold; font-family: monospace; color: #1a3c6e;">#${shortId}</div>
          </div>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; padding: 16px; display: block;">
            <tr><td style="padding: 8px 16px; color: #6b7280; width: 160px;">${tpl.labels.from}</td><td style="padding: 8px 16px; font-weight: bold;">${fromCity}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px 16px; color: #6b7280;">${tpl.labels.to}</td><td style="padding: 8px 16px; font-weight: bold;">${toCity}</td></tr>
            <tr><td style="padding: 8px 16px; color: #6b7280;">${tpl.labels.date}</td><td style="padding: 8px 16px;">${booking.date} — ${booking.time}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px 16px; color: #6b7280;">${tpl.labels.passengers}</td><td style="padding: 8px 16px;">${booking.passengers || 1}</td></tr>
            ${booking.price_estimate ? `<tr><td style="padding: 8px 16px; color: #6b7280;">${tpl.labels.price}</td><td style="padding: 8px 16px; font-weight: bold; color: #16A34A; font-size: 18px;">${booking.price_estimate}₪</td></tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #e8f5ee; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #15803d; font-size: 14px;">${tpl.labels.contact}<strong>+972-54-310-0044</strong></p>
          </div>
        </div>
      </div>
    `,
  });
}
