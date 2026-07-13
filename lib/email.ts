import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendBookingNotification(booking: {
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
}) {
  const shortId = booking.id.slice(0, 8).toUpperCase();

  await transporter.sendMail({
    from: `"Moveo Taxi" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `🚕 Nouvelle réservation #${shortId} — ${booking.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16A34A; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 22px;">🚕 Nouvelle réservation</h1>
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
