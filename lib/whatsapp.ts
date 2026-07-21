const WHATSAPP_NUMBER = "972543100044";

const MESSAGES: Record<string, string> = {
  fr: `Bonjour, je souhaite réserver un taxi 🚕

🚗 Trajet : ___ → ___
📅 Date : ___
🕐 Heure : ___
👥 Nombre de passagers : ___
🧳 Nombre de valises : ___
✈️ Numéro de vol (si aéroport) : ___`,

  en: `Hello, I would like to book a taxi 🚕

🚗 Route: ___ → ___
📅 Date: ___
🕐 Time: ___
👥 Number of passengers: ___
🧳 Number of suitcases: ___
✈️ Flight number (if airport): ___`,

  he: `שלום, אני מעוניין/ת להזמין מונית 🚕

🚗 מסלול: ___ → ___
📅 תאריך: ___
🕐 שעה: ___
👥 מספר נוסעים: ___
🧳 מספר מזוודות: ___
✈️ מספר טיסה (אם רלוונטי): ___`,

  ru: `Здравствуйте, я хочу заказать такси 🚕

🚗 Маршрут: ___ → ___
📅 Дата: ___
🕐 Время: ___
👥 Количество пассажиров: ___
🧳 Количество чемоданов: ___
✈️ Номер рейса (если аэропорт): ___`,

  es: `Hola, me gustaría reservar un taxi 🚕

🚗 Trayecto: ___ → ___
📅 Fecha: ___
🕐 Hora: ___
👥 Número de pasajeros: ___
🧳 Número de maletas: ___
✈️ Número de vuelo (si aeropuerto): ___`,
};

export function getWhatsAppUrl(locale: string): string {
  const message = MESSAGES[locale] ?? MESSAGES.en;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
