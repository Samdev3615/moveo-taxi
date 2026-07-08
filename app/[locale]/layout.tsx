import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { locales, rtlLocales, type Locale } from "@/i18n/config";
import "../globals.css";

const BASE_URL = "https://www.moveotaxi.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("home.title"),
      template: "%s | Moveo Taxi",
    },
    description: t("home.description"),
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
    metadataBase: new URL(BASE_URL),
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

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className="h-full scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
