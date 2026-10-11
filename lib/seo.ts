import type { Metadata } from "next";
import { locales } from "@/i18n/config";

export const BASE_URL = "https://www.moveotaxi.com";

/**
 * Canonical + hreflang for a page that exists in every locale.
 * `path` is the part after the locale, e.g. "" for home or "/about".
 */
export function localeAlternates(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${path}`])),
      "x-default": `${BASE_URL}/he${path}`,
    },
  };
}
