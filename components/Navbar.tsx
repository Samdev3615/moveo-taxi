"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

const PHONE = "+972-54-310-0044";
const WHATSAPP_NUMBER = "972543100044";

export default function Navbar() {
  const t = useTranslations("nav");
  const tTrust = useTranslations("trust");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/airport`, label: t("airport") },
    { href: `/${locale}/booking?type=intercity`, label: t("intercity") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0 flex items-center h-full py-2">
            <Logo size="xl" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  i === 0
                    ? "px-3 py-2 text-sm font-semibold text-[#16A34A] border-b-2 border-[#16A34A]"
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#16A34A] transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#16A34A] transition-colors"
            >
              <div className="bg-[#f0fdf4] p-1.5 rounded-full">
                <Phone size={14} className="text-[#16A34A]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-gray-400 font-normal">{tTrust("support")}</div>
                <div className="font-semibold text-[#16A34A] text-sm">{PHONE}</div>
              </div>
            </a>

            <LanguageSwitcher />

            <Link
              href={`/${locale}/login`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#16A34A] hover:text-[#16A34A] transition-colors"
            >
              {t("login")}
            </Link>

            <Link
              href={`/${locale}/booking`}
              className="px-4 py-2 bg-[#16A34A] text-white rounded-lg text-sm font-semibold hover:bg-[#15803D] transition-colors"
            >
              {t("book")}
            </Link>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#16A34A]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2">
              <Link
                href={`/${locale}/booking`}
                className="flex-1 text-center bg-[#16A34A] text-white py-2.5 rounded-xl text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {t("book")}
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="flex-1 text-center bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-semibold"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
