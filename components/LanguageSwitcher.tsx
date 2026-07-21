"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, localeLabels, localeFlagCodes, type Locale } from "@/i18n/config";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${localeLabels[locale]}`}
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:border-[#16A34A] hover:text-[#16A34A] transition-colors"
      >
        <img
          src={`/images/flags/${localeFlagCodes[locale]}.png`}
          width={20}
          height={15}
          alt={localeLabels[locale]}
          className="rounded-sm"
        />
        <span className="hidden sm:inline">{localeLabels[locale]}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 end-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[150px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-start",
                l === locale && "bg-green-50 text-[#16A34A] font-medium"
              )}
            >
              <img
                src={`https://flagcdn.com/w20/${localeFlagCodes[l]}.png`}
                width={20}
                height={15}
                alt={localeLabels[l]}
                className="rounded-sm"
              />
              <span>{localeLabels[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
