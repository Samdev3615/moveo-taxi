import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { locales, rtlLocales, type Locale } from "@/i18n/config";
import { Heebo } from "next/font/google";
import "../globals.css";

const BASE_URL = "https://www.moveotaxi.com";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-heebo",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const ogLocaleMap: Record<string, string> = {
    he: "he_IL",
    fr: "fr_FR",
    en: "en_US",
    ru: "ru_RU",
    es: "es_ES",
  };

  return {
    title: {
      default: t("home.title"),
      template: "%s | Moveo Taxi",
    },
    description: t("home.description"),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        he: `${BASE_URL}/he`,
        en: `${BASE_URL}/en`,
        fr: `${BASE_URL}/fr`,
        ru: `${BASE_URL}/ru`,
        es: `${BASE_URL}/es`,
        "x-default": `${BASE_URL}/he`,
      },
    },
    openGraph: {
      title: t("home.title"),
      description: t("home.description"),
      url: `${BASE_URL}/${locale}`,
      siteName: "Moveo Taxi",
      type: "website",
      locale: ogLocaleMap[locale] ?? "he_IL",
      images: [
        {
          url: `${BASE_URL}/images/moveo-taxi-chauffeur-aeroport-israel.png`,
          width: 1440,
          height: 960,
          alt: "Moveo Taxi — Ben Gurion Airport Transfer Israel",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.title"),
      description: t("home.description"),
      images: [`${BASE_URL}/images/moveo-taxi-chauffeur-aeroport-israel.png`],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = rtlLocales.includes(locale as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "name": "Moveo Taxi",
    "url": "https://www.moveotaxi.com",
    "logo": "https://www.moveotaxi.com/images/moveo-taxi-logo.png",
    "image": [
      "https://www.moveotaxi.com/images/moveo-taxi-ben-gurion-airport-transfer.png",
      "https://www.moveotaxi.com/images/moveo-taxi-chauffeur-aeroport-israel.png",
      "https://www.moveotaxi.com/images/moveo-taxi-van-6-places-aeroport-israel.png"
    ],
    "telephone": "+972543100044",
    "description": "MOVEO TAXI מציעה שירותי הסעות ומוניות מקצועיים בכל רחבי ישראל, במחירים תחרותיים ושקופים. אנו מתמחים בנסיעות לנתב״ג ומנתב״ג, נסיעות בין־עירוניות, הסעות פרטיות והסעות לקבוצות. כל הנהגים שלנו מנוסים, מוסמכים, אדיבים ומקפידים על נהיגה בטוחה, עמידה בזמנים ורכב נקי ונוח. אצלנו השירות הוא מעל הכול: מענה מהיר, יחס אישי, זמינות גבוהה וליווי ברור מרגע ההזמנה ועד ההגעה ליעד. השירות ניתן בחמש שפות: עברית, צרפתית, אנגלית, רוסית וספרדית. MOVEO TAXI – מחיר הוגן, נהגים מקצועיים ושירות מצוין בכל נסיעה.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "הרב אליעזרי 3",
      "addressLocality": "Jerusalem",
      "postalCode": "9646103",
      "addressCountry": "IL"
    },
    "areaServed": [
      { "@type": "City", "name": "Tel Aviv" },
      { "@type": "City", "name": "Jerusalem" },
      { "@type": "City", "name": "Netanya" },
      { "@type": "City", "name": "Haifa" },
      { "@type": "City", "name": "Ashdod" },
      { "@type": "City", "name": "Rehovot" },
      { "@type": "City", "name": "Petah Tikva" },
      { "@type": "Airport", "name": "Ben Gurion International Airport", "iataCode": "TLV" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "₪₪",
    "availableLanguage": ["Hebrew", "French", "English", "Russian", "Spanish"]
  };

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`h-full scroll-smooth ${heebo.variable}`}
    >
      <body className={`min-h-full flex flex-col antialiased ${heebo.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
