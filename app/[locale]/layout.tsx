import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { locales, rtlLocales, type Locale } from "@/i18n/config";
import { Heebo } from "next/font/google";
import InstallPrompt from "@/components/InstallPrompt";
import "../globals.css";

const GA_ID = "G-FZTXM5V6G5";

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
      template: "%s",
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

  const jsonLdBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": "https://www.moveotaxi.com/#business",
    "name": "Moveo Taxi",
    "alternateName": ["מובאו טקסי", "Moveo Taxi Israel", "מובאו טקסי ישראל"],
    "url": "https://www.moveotaxi.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.moveotaxi.com/images/moveo-taxi-logo.png"
    },
    "image": [
      "https://www.moveotaxi.com/images/moveo-taxi-ben-gurion-airport-transfer.png",
      "https://www.moveotaxi.com/images/moveo-taxi-chauffeur-aeroport-israel.png",
      "https://www.moveotaxi.com/images/moveo-taxi-van-6-places-aeroport-israel.png"
    ],
    "telephone": "+972543100044",
    "description": "Moveo Taxi is a private taxi and airport transfer service based in Israel. We offer fixed-price rides between Ben Gurion Airport (TLV) and all Israeli cities — Tel Aviv, Jerusalem, Netanya, Haifa, Ashdod and more. Professional drivers, 24/7 availability, service in 5 languages.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "הרב אליעזרי 3",
      "addressLocality": "Jerusalem",
      "postalCode": "9646103",
      "addressCountry": "IL"
    },
    "areaServed": [
      { "@type": "Country", "name": "Israel" },
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
    "availableLanguage": ["Hebrew", "French", "English", "Russian", "Spanish"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+972543100044",
      "contactType": "customer service",
      "areaServed": "IL",
      "availableLanguage": ["Hebrew", "French", "English", "Russian", "Spanish"]
    },
    "sameAs": [
      "https://www.moveotaxi.com"
    ]
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.moveotaxi.com/#website",
    "url": "https://www.moveotaxi.com",
    "name": "Moveo Taxi",
    "description": "Private taxi service in Israel — Ben Gurion Airport transfers and intercity trips with fixed prices",
    "inLanguage": ["he", "en", "fr", "ru", "es"],
    "publisher": {
      "@id": "https://www.moveotaxi.com/#business"
    }
  };

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`h-full scroll-smooth ${heebo.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#16A34A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moveo Taxi" />
        {/* Google Analytics GA4 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col antialiased ${heebo.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
          <InstallPrompt />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
