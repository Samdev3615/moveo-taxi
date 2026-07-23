import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPrice } from "@/lib/prices";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { locales } from "@/i18n/config";
import { ROUTE_PAGES } from "@/lib/route-pages";
import { ArrowRight, Clock, ShieldCheck, Car, MapPin } from "lucide-react";

const BASE_URL = "https://www.moveotaxi.com";

const CONTENT = {
  fr: {
    metaTitle: "Taxi Eilat pas cher — Prix fixe depuis Tel Aviv ₪1120 | Moveo Taxi",
    metaDesc: "Taxi privé vers Eilat à prix fixe. Tel Aviv ₪1120, Jérusalem ₪1000, Beer Sheva ₪810. Aucun compteur. Réservation en ligne 24h/24.",
    badge: "Eilat — Mer Rouge",
    h1: "Taxi vers Eilat — Prix fixe garanti",
    subtitle: "Transfert privé porte-à-porte depuis Tel Aviv, Jérusalem ou Beer Sheva. Prix affiché, aucune mauvaise surprise.",
    routesTitle: "Nos tarifs vers Eilat",
    sedan: "Sedan",
    van: "Van 6-8 places",
    book: "Réserver",
    moreInfo: "+",
    whyTitle: "Pourquoi un taxi privé pour Eilat ?",
    whyItems: [
      { key: "shield", title: "Prix fixe, zéro compteur", desc: "Le prix affiché est le prix payé. Pas de surprise à l'arrivée." },
      { key: "car",    title: "Porte-à-porte",            desc: "On vient vous chercher. Pas de bus, pas de correspondance." },
      { key: "clock",  title: "Disponible 24h/24",        desc: "Départ à l'aube, retour de nuit — on s'adapte à votre planning." },
      { key: "map",    title: "Confort absolu",            desc: "Climatisation, sièges larges, espace bagages. Idéal pour les familles." },
    ],
    faqTitle: "Questions fréquentes — Taxi Eilat",
    faqs: [
      {
        q: "Combien coûte un taxi de Tel Aviv à Eilat ?",
        a: "₪1120 en sedan, prix fixe garanti. Pas de compteur, pas de surprise. Le trajet dure environ 3h30 via l'autoroute 90.",
      },
      {
        q: "Un taxi privé est-il moins cher que le bus vers Eilat ?",
        a: "En famille ou entre amis, un taxi Moveo Taxi revient souvent moins cher que plusieurs billets de bus — avec le confort porte-à-porte en plus. Beer Sheva est la ville la plus proche (₪810).",
      },
      {
        q: "Combien de temps dure le trajet Tel Aviv → Eilat ?",
        a: "3h30 environ via la route 90, sans arrêts. Depuis Jérusalem, comptez 3h10. Depuis Beer Sheva, environ 2h10.",
      },
      {
        q: "Peut-on transporter du matériel de plongée ou de surf ?",
        a: "Oui, nos véhicules sont spacieux. Pour des groupes avec beaucoup de bagages, nous proposons un van 6-8 places.",
      },
      {
        q: "Peut-on réserver un aller-retour Eilat ?",
        a: "Oui — réservez l'aller en ligne et contactez-nous via WhatsApp pour organiser le retour selon vos dates.",
      },
    ],
    ctaTitle: "Prêt pour Eilat ?",
    ctaSubtitle: "Réservez votre taxi privé en 2 minutes. Prix fixe, confirmation immédiate.",
    bookNow: "Réserver maintenant",
    whatsapp: "Contacter par WhatsApp",
    breadcrumbRoutes: "Toutes les routes",
  },
  en: {
    metaTitle: "Taxi to Eilat Israel — Fixed Price from Tel Aviv ₪1120 | Moveo Taxi",
    metaDesc: "Private taxi to Eilat at fixed price. Tel Aviv ₪1120, Jerusalem ₪1000, Beer Sheva ₪810. No meter. Book online 24/7.",
    badge: "Eilat — Red Sea",
    h1: "Private Taxi to Eilat — Fixed Price",
    subtitle: "Door-to-door private transfer from Tel Aviv, Jerusalem or Beer Sheva. Fixed rate, no surprises.",
    routesTitle: "Fares to Eilat",
    sedan: "Sedan",
    van: "Van 6-8 seats",
    book: "Book",
    moreInfo: "+",
    whyTitle: "Why choose a private taxi to Eilat?",
    whyItems: [
      { key: "shield", title: "Fixed price, no meter",   desc: "The price you see is the price you pay. No surprises on arrival." },
      { key: "car",    title: "Door-to-door service",    desc: "We pick you up wherever you are. No buses, no connections." },
      { key: "clock",  title: "Available 24/7",          desc: "Early departure, late return — we adapt to your schedule." },
      { key: "map",    title: "Complete comfort",        desc: "Air conditioning, spacious seats, luggage space. Perfect for families." },
    ],
    faqTitle: "FAQ — Taxi to Eilat",
    faqs: [
      {
        q: "How much does a taxi from Tel Aviv to Eilat cost?",
        a: "₪1120 by sedan, guaranteed fixed price. No meter. The drive takes approximately 3h30 via Highway 90.",
      },
      {
        q: "Is a private taxi cheaper than the bus to Eilat?",
        a: "For families or groups, a Moveo Taxi often costs less than multiple bus tickets — plus door-to-door comfort. Beer Sheva is the closest city (₪810).",
      },
      {
        q: "How long is the drive from Tel Aviv to Eilat?",
        a: "Approximately 3h30 via Route 90, non-stop. From Jerusalem around 3h10. From Beer Sheva, about 2h10.",
      },
      {
        q: "Can we bring diving or surfing equipment?",
        a: "Yes, our vehicles are spacious. For groups with large luggage, we offer a 6-8 seat van.",
      },
      {
        q: "Can we book a round trip to Eilat?",
        a: "Yes — book the outbound trip online and contact us via WhatsApp to arrange the return trip.",
      },
    ],
    ctaTitle: "Ready for Eilat?",
    ctaSubtitle: "Book your private taxi in 2 minutes. Fixed price, immediate confirmation.",
    bookNow: "Book now",
    whatsapp: "Contact via WhatsApp",
    breadcrumbRoutes: "All routes",
  },
  he: {
    metaTitle: "מונית לאילת — מחיר קבוע מתל אביב ₪1120 | מובאו טקסי",
    metaDesc: "מונית פרטית לאילת במחיר קבוע. מתל אביב ₪1120, מירושלים ₪1000, מבאר שבע ₪810. ללא מד מרחק. הזמנה אונליין.",
    badge: "אילת — ים סוף",
    h1: "מונית לאילת — מחיר קבוע מובטח",
    subtitle: "הסעה פרטית מדלת לדלת מתל אביב, ירושלים או באר שבע. מחיר קבוע, ללא הפתעות.",
    routesTitle: "מחירי הנסיעה לאילת",
    sedan: "סדאן",
    van: "ואן 6-8 מושבים",
    book: "הזמנה",
    moreInfo: "+",
    whyTitle: "למה לבחור מונית פרטית לאילת?",
    whyItems: [
      { key: "shield", title: "מחיר קבוע, ללא מד מרחק", desc: "המחיר שאתה רואה הוא המחיר שאתה משלם. ללא הפתעות." },
      { key: "car",    title: "מדלת לדלת",               desc: "אנחנו מגיעים אליך. ללא אוטובוסים, ללא החלפות." },
      { key: "clock",  title: "זמין 24/7",                desc: "יציאה עם שחר, חזרה בלילה — אנחנו מתאימים ללוח הזמנים שלך." },
      { key: "map",    title: "נוחות מלאה",              desc: "מיזוג אוויר, מושבים מרווחים, מקום למטען. מושלם למשפחות." },
    ],
    faqTitle: "שאלות נפוצות — מונית לאילת",
    faqs: [
      {
        q: "כמה עולה מונית מתל אביב לאילת?",
        a: "₪1120 בסדאן, מחיר קבוע מובטח. ללא מד מרחק. הנסיעה אורכת כ-3.5 שעות דרך כביש 90.",
      },
      {
        q: "כמה זמן נסיעה מתל אביב לאילת?",
        a: "כ-3.5 שעות דרך כביש 90, ללא עצירות. מירושלים כ-3.1 שעות. מבאר שבע כ-2.1 שעות.",
      },
      {
        q: "האם ניתן להביא ציוד צלילה?",
        a: "כן, כלי הרכב שלנו מרווחים. לקבוצות עם מטען רב, אנחנו מציעים ון עם 6-8 מושבים.",
      },
      {
        q: "האם ניתן להזמין הלוך-חזור לאילת?",
        a: "כן — הזמן את נסיעת ההלוך אונליין וצור קשר בוואטסאפ לתכנון הנסיעה חזרה.",
      },
    ],
    ctaTitle: "מוכן לאילת?",
    ctaSubtitle: "הזמן מונית פרטית תוך 2 דקות. מחיר קבוע, אישור מיידי.",
    bookNow: "הזמנה עכשיו",
    whatsapp: "צרו קשר בוואטסאפ",
    breadcrumbRoutes: "כל המסלולים",
  },
  ru: {
    metaTitle: "Такси в Эйлат — Фиксированная цена из Тель-Авива ₪1120 | Moveo Taxi",
    metaDesc: "Частное такси в Эйлат по фиксированной цене. Из Тель-Авива ₪1120, Иерусалима ₪1000, Беэр-Шевы ₪810. Без счётчика. Бронирование онлайн.",
    badge: "Эйлат — Красное море",
    h1: "Такси в Эйлат — Фиксированная цена",
    subtitle: "Частный трансфер от двери до двери из Тель-Авива, Иерусалима или Беэр-Шевы. Фиксированный тариф, без сюрпризов.",
    routesTitle: "Тарифы в Эйлат",
    sedan: "Седан",
    van: "Минивэн 6-8 мест",
    book: "Забронировать",
    moreInfo: "+",
    whyTitle: "Почему частное такси в Эйлат?",
    whyItems: [
      { key: "shield", title: "Фиксированная цена, без счётчика", desc: "Цена, которую вы видите — это цена, которую вы платите." },
      { key: "car",    title: "От двери до двери",                desc: "Мы забираем вас там, где вы есть. Без автобусов и пересадок." },
      { key: "clock",  title: "Доступно 24/7",                   desc: "Ранний выезд, поздний возврат — мы адаптируемся к вашему расписанию." },
      { key: "map",    title: "Полный комфорт",                  desc: "Кондиционер, просторные сиденья, место для багажа. Идеально для семей." },
    ],
    faqTitle: "Частые вопросы — Такси в Эйлат",
    faqs: [
      {
        q: "Сколько стоит такси из Тель-Авива в Эйлат?",
        a: "₪1120 на седане, гарантированная фиксированная цена. Без счётчика. Поездка занимает около 3ч30м по шоссе 90.",
      },
      {
        q: "Сколько длится поездка из Тель-Авива в Эйлат?",
        a: "Около 3ч30м по шоссе 90, без остановок. Из Иерусалима — около 3ч10м. Из Беэр-Шевы — около 2ч10м.",
      },
      {
        q: "Можно ли везти оборудование для дайвинга?",
        a: "Да, наши автомобили вместительные. Для больших групп с багажом — минивэн на 6-8 мест.",
      },
      {
        q: "Можно ли заказать поездку туда и обратно?",
        a: "Да — забронируйте поездку онлайн и напишите нам в WhatsApp для организации обратного трансфера.",
      },
    ],
    ctaTitle: "Готовы в Эйлат?",
    ctaSubtitle: "Забронируйте частное такси за 2 минуты. Фиксированная цена, мгновенное подтверждение.",
    bookNow: "Забронировать",
    whatsapp: "Написать в WhatsApp",
    breadcrumbRoutes: "Все маршруты",
  },
  es: {
    metaTitle: "Taxi a Eilat Israel — Precio fijo desde Tel Aviv ₪1120 | Moveo Taxi",
    metaDesc: "Taxi privado a Eilat a precio fijo. Tel Aviv ₪1120, Jerusalén ₪1000, Beer Sheva ₪810. Sin taxímetro. Reserva online 24/7.",
    badge: "Eilat — Mar Rojo",
    h1: "Taxi Privado a Eilat — Precio Fijo",
    subtitle: "Traslado privado de puerta a puerta desde Tel Aviv, Jerusalén o Beer Sheva. Precio fijo, sin sorpresas.",
    routesTitle: "Tarifas a Eilat",
    sedan: "Sedán",
    van: "Furgoneta 6-8 plazas",
    book: "Reservar",
    moreInfo: "+",
    whyTitle: "¿Por qué elegir un taxi privado a Eilat?",
    whyItems: [
      { key: "shield", title: "Precio fijo, sin taxímetro", desc: "El precio que ves es el que pagas. Sin sorpresas al llegar." },
      { key: "car",    title: "Servicio puerta a puerta",   desc: "Te recogemos donde estés. Sin autobuses ni transbordos." },
      { key: "clock",  title: "Disponible 24/7",            desc: "Salida temprana, regreso nocturno — nos adaptamos a tu horario." },
      { key: "map",    title: "Máxima comodidad",           desc: "Aire acondicionado, asientos amplios, espacio para equipaje." },
    ],
    faqTitle: "Preguntas frecuentes — Taxi a Eilat",
    faqs: [
      {
        q: "¿Cuánto cuesta un taxi de Tel Aviv a Eilat?",
        a: "₪1120 en sedán, precio fijo garantizado. Sin taxímetro. El viaje dura aproximadamente 3h30 por la carretera 90.",
      },
      {
        q: "¿Cuánto dura el viaje de Tel Aviv a Eilat?",
        a: "Aproximadamente 3h30 por la autopista 90, sin paradas. Desde Jerusalén unas 3h10. Desde Beer Sheva, unas 2h10.",
      },
      {
        q: "¿Podemos llevar equipos de buceo o surf?",
        a: "Sí, nuestros vehículos son espaciosos. Para grupos con mucho equipaje, ofrecemos una furgoneta de 6-8 plazas.",
      },
      {
        q: "¿Se puede reservar un viaje de ida y vuelta a Eilat?",
        a: "Sí — reserva el viaje de ida online y contáctanos por WhatsApp para organizar el regreso.",
      },
    ],
    ctaTitle: "¿Listo para Eilat?",
    ctaSubtitle: "Reserva tu taxi privado en 2 minutos. Precio fijo, confirmación inmediata.",
    bookNow: "Reservar ahora",
    whatsapp: "Contactar por WhatsApp",
    breadcrumbRoutes: "Todas las rutas",
  },
};

const EILAT_ROUTES = [
  { from: "tel_aviv" as const,   to: "eilat" as const, duration: "3h 30min" },
  { from: "jerusalem" as const,  to: "eilat" as const, duration: "3h 10min" },
  { from: "beer_sheva" as const, to: "eilat" as const, duration: "2h 10min" },
];

const WHY_ICONS = {
  shield: ShieldCheck,
  car:    Car,
  clock:  Clock,
  map:    MapPin,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: `${BASE_URL}/${locale}/taxi-eilat`,
      languages: {
        he: `${BASE_URL}/he/taxi-eilat`,
        en: `${BASE_URL}/en/taxi-eilat`,
        fr: `${BASE_URL}/fr/taxi-eilat`,
        ru: `${BASE_URL}/ru/taxi-eilat`,
        es: `${BASE_URL}/es/taxi-eilat`,
        "x-default": `${BASE_URL}/he/taxi-eilat`,
      },
    },
  };
}

export default async function EilatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;
  const tb = await getTranslations({ locale, namespace: "booking" });
  const cityName = (key: string) => tb(`form.cities.${key}`);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Moveo Taxi",       "item": `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": c.breadcrumbRoutes, "item": `${BASE_URL}/${locale}/routes` },
      { "@type": "ListItem", "position": 3, "name": cityName("eilat"),  "item": `${BASE_URL}/${locale}/taxi-eilat` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 py-3" aria-label="breadcrumb">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-gray-400 flex-wrap" dir="ltr">
            <li><Link href={`/${locale}`} className="hover:text-gray-600 transition-colors">Moveo Taxi</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${locale}/routes`} className="hover:text-gray-600 transition-colors">{c.breadcrumbRoutes}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">{cityName("eilat")}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#16A34A] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <MapPin size={14} />
            {c.badge}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
            {c.h1}
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl">{c.subtitle}</p>
          <Link
            href={`/${locale}/booking?type=intercity&from=tel_aviv&to=eilat`}
            className="inline-flex items-center gap-2 bg-[#16A34A] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#15803D] transition-colors shadow-lg shadow-[#16A34A]/20"
          >
            {c.bookNow}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Route cards */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{c.routesTitle}</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {EILAT_ROUTES.map((route) => {
              const sedanPrice = getPrice(route.from, route.to, "sedan");
              const minibusPrice = getPrice(route.from, route.to, "minibus");
              if (!sedanPrice) return null;

              const landingPage = ROUTE_PAGES.find(
                (r) =>
                  (r.from === route.from && r.to === route.to) ||
                  (r.from === route.to && r.to === route.from)
              );

              const bookingParams = new URLSearchParams({
                type: "intercity",
                from: route.from,
                to: "eilat",
              });

              return (
                <div
                  key={route.from}
                  className="bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  {landingPage ? (
                    <Link href={`/${locale}/route/${landingPage.slug}`} className="flex-1 p-5 block">
                      <RouteCardBody
                        fromName={cityName(route.from)}
                        duration={route.duration}
                        sedanPrice={sedanPrice}
                        minibusPrice={minibusPrice}
                        sedan={c.sedan}
                        van={c.van}
                      />
                    </Link>
                  ) : (
                    <div className="flex-1 p-5">
                      <RouteCardBody
                        fromName={cityName(route.from)}
                        duration={route.duration}
                        sedanPrice={sedanPrice}
                        minibusPrice={minibusPrice}
                        sedan={c.sedan}
                        van={c.van}
                      />
                    </div>
                  )}
                  <div className="px-5 pb-5">
                    <Link
                      href={`/${locale}/booking?${bookingParams.toString()}`}
                      className="block bg-[#16A34A] text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-[#15803D] transition-colors"
                    >
                      {c.book}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{c.whyTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.whyItems.map((item, i) => {
              const Icon = WHY_ICONS[item.key as keyof typeof WHY_ICONS];
              return (
                <div key={i} className="bg-white rounded-2xl p-5">
                  <div className="w-10 h-10 bg-[#E8F5EE] rounded-xl flex items-center justify-center mb-3">
                    <Icon size={18} color="#16A34A" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{c.faqTitle}</h2>
          <div className="space-y-4">
            {c.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#16A34A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">{c.ctaTitle}</h2>
          <p className="text-[#B8DFCA] mb-6">{c.ctaSubtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/${locale}/booking?type=intercity&from=tel_aviv&to=eilat`}
              className="bg-white text-[#16A34A] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              {c.bookNow}
            </Link>
            <a
              href={getWhatsAppUrl(locale)}
              className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1da851] transition-colors"
            >
              {c.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function RouteCardBody({
  fromName, duration, sedanPrice, minibusPrice, sedan, van,
}: {
  fromName: string;
  duration: string;
  sedanPrice: number;
  minibusPrice: number | null;
  sedan: string;
  van: string;
}) {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0" />
        <span className="text-sm font-semibold text-gray-700">{fromName}</span>
        <ArrowRight size={12} className="text-gray-400 mx-0.5" />
        <span className="text-sm font-semibold text-gray-700">Eilat</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Clock size={12} />
        {duration}
      </div>
      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{sedan}</span>
          <span className="font-black text-[#F97316]" dir="ltr">₪{sedanPrice}</span>
        </div>
        {minibusPrice && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{van}</span>
            <span className="font-black text-[#16A34A]" dir="ltr">₪{minibusPrice}</span>
          </div>
        )}
      </div>
    </>
  );
}
