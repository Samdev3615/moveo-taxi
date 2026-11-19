"use client";

import { getWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  locale: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}

function trackWA(source: string, locale: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "whatsapp_click", { source, locale });
  }
}

export default function WhatsAppLinkTracked({ locale, source, className, children }: Props) {
  return (
    <a
      href={getWhatsAppUrl(locale)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWA(source, locale)}
      className={className}
    >
      {children}
    </a>
  );
}
