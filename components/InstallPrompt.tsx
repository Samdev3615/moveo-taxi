"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const t = useTranslations("install");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-dismissed")) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true);

    if (isInStandalone) return;

    if (isIOS) {
      setTimeout(() => setShowIOS(true), 3000);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowAndroid(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem("pwa-dismissed", "1");
    setShowAndroid(false);
    setShowIOS(false);
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") localStorage.setItem("pwa-dismissed", "1");
    setShowAndroid(false);
    setDeferredPrompt(null);
  }

  if (dismissed || (!showAndroid && !showIOS)) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3 max-w-sm mx-auto">
        <Image
          src="/icons/icon-192.png"
          alt="Moveo Taxi"
          width={52}
          height={52}
          className="rounded-xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{t("title")}</p>
          {showAndroid && <p className="text-xs text-gray-500 leading-tight">{t("subtitle")}</p>}
          {showIOS && <p className="text-xs text-gray-500 leading-tight">{t("ios_hint")}</p>}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {showAndroid && (
            <button
              onClick={install}
              className="bg-[#16A34A] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#15803D] transition-colors"
            >
              {t("install")}
            </button>
          )}
          <button
            onClick={dismiss}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
          >
            {t("later")}
          </button>
        </div>
      </div>
    </div>
  );
}
