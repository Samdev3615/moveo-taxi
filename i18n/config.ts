export const locales = ["he", "en", "fr", "ru", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

export const localeLabels: Record<Locale, string> = {
  he: "עברית",
  en: "English",
  fr: "Français",
  ru: "Русский",
  es: "Español",
};

export const localeFlags: Record<Locale, string> = {
  he: "🇮🇱",
  en: "🇬🇧",
  fr: "🇫🇷",
  ru: "🇷🇺",
  es: "🇪🇸",
};

export const rtlLocales: Locale[] = ["he"];
