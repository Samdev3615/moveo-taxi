"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { MapPin, Users, ArrowRight, ShieldCheck } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";
import { cn } from "@/lib/utils";
import { CITIES, type CityKey } from "@/lib/prices";
import { usePriceData } from "@/lib/hooks/usePriceData";

export default function BookingWidget() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const router = useRouter();

  const [from, setFrom] = useState<CityKey | "">("");
  const [to, setTo] = useState<CityKey | "">("ben_gurion");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("06:00");
  const [passengers, setPassengers] = useState(1);
  const { priceData, loadingPrice, noPrice } = usePriceData(from, to);

  const hour = time ? parseInt(time.split(":")[0]) : 10;
  const isNight = hour >= 21 || hour < 6;
  const isCar6 = passengers > 4;
  const price = priceData
    ? (isCar6 ? (isNight ? priceData.car6_night : priceData.car6_day)
               : (isNight ? priceData.car4_night : priceData.car4_day))
    : null;

  function swap() {
    setFrom(to);
    setTo(from as CityKey);
  }

  function handleFrom(val: CityKey | "") { setFrom(val); }
  function handleTo(val: CityKey | "") { setTo(val); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isAirport = to === "ben_gurion" || from === "ben_gurion";
    const direction = isAirport ? (to === "ben_gurion" ? "to_airport" : "from_airport") : undefined;
    const params = new URLSearchParams({
      type: isAirport ? "airport" : "intercity",
      from: from,
      to: to,
      date,
      time,
      passengers: String(passengers),
      ...(direction ? { direction } : {}),
    });
    router.push(`/${locale}/booking?${params.toString()}`);
  }

  const cities = CITIES;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 pt-5 pb-0">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t("widget_title")}</h2>

        <div className="flex items-center gap-2 pb-3">
          <ArrowRight size={15} className="text-[#16A34A]" />
          <span className="text-sm font-semibold text-[#16A34A]">{t("mode.oneway")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {/* From / To */}
        <div className="relative">
          <div className="space-y-2">
            {/* From */}
            <div className="relative">
              <div className="absolute start-3 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full border-2 border-[#16A34A] bg-white" />
              </div>
              <select
                value={from}
                required
                aria-label={t("form.from")}
                onChange={(e) => handleFrom(e.target.value as CityKey)}
                className="w-full ps-9 pe-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] text-gray-800"
              >
                <option value="">{t("form.from")}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{t(`form.cities.${c}`)}</option>
                ))}
              </select>
            </div>

            {/* Swap button */}
            <div className="flex justify-center -my-1 relative z-10">
              <button
                type="button"
                onClick={swap}
                aria-label={t("form.swap")}
                className="bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 hover:border-[#16A34A] transition-colors shadow-sm"
              >
                <ArrowRight size={14} className="text-gray-600 rotate-90" />
              </button>
            </div>

            {/* To */}
            <div className="relative">
              <div className="absolute start-3 top-1/2 -translate-y-1/2">
                <MapPin size={14} className="text-[#F97316]" />
              </div>
              <select
                value={to}
                required
                aria-label={t("form.to")}
                onChange={(e) => handleTo(e.target.value as CityKey)}
                className="w-full ps-9 pe-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] text-gray-800"
              >
                <option value="">{t("form.to")}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{t(`form.cities.${c}`)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date / Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              {t("form.date")}
            </label>
            <DatePicker
              value={date}
              onChange={setDate}
              min={new Date().toISOString().split("T")[0]}
              appLocale={locale}
              placeholder={t("form.date")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              {t("form.time")}
            </label>
            <TimePicker
              value={time}
              onChange={setTime}
              hoursLabel={t("form.hours")}
              minutesLabel={t("form.minutes")}
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            {t("form.passengers")}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPassengers(n)}
                aria-label={`${n} ${t("form.passengers")}`}
                aria-pressed={passengers === n}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                  passengers === n
                    ? n <= 4
                      ? "bg-[#16A34A] text-white border-[#16A34A]"
                      : "bg-[#F97316] text-white border-[#F97316]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-1.5">
            {passengers <= 4
              ? t("form.vehicle_auto_4")
              : t("form.vehicle_auto_6")}
          </p>
        </div>

        {/* Price */}
        {loadingPrice && (
          <div className="bg-[#f0fdf4] rounded-xl px-4 py-3 flex items-center justify-center">
            <span className="text-sm text-[#16A34A] animate-pulse">{t("form.calculating")}</span>
          </div>
        )}
        {!loadingPrice && price !== null && (
          <div className="bg-[#f0fdf4] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-xl font-black text-[#F97316]">₪{price}</span>
          </div>
        )}
        {!loadingPrice && noPrice && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <span className="text-sm text-amber-700">{t("price.on_request")}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#16A34A] text-white font-bold py-4 rounded-xl hover:bg-[#15803D] transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-[#16A34A]/20"
        >
          {t("widget_cta")}
          <ArrowRight size={18} />
        </button>

        {/* Confirmation badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
          <ShieldCheck size={13} className="text-[#16A34A]" />
          {t("instant_confirmation")}
        </div>
      </form>
    </div>
  );
}
