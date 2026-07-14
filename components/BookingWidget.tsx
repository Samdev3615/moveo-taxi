"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { MapPin, ArrowLeftRight, Calendar, Clock, Users, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITIES, getPrice, type CityKey } from "@/lib/prices";

type TripMode = "oneway" | "roundtrip";

export default function BookingWidget() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const router = useRouter();

  const [mode, setMode] = useState<TripMode>("oneway");
  const [from, setFrom] = useState<CityKey | "">("");
  const [to, setTo] = useState<CityKey | "">("ben_gurion");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("06:00");
  const [passengers, setPassengers] = useState("1-4");
  const [luggage, setLuggage] = useState("1-3");
  const [price, setPrice] = useState<number | null>(null);

  function swap() {
    setFrom(to);
    setTo(from as CityKey);
  }

  function recalc(f: CityKey | "", tDest: CityKey | "") {
    if (f && tDest) {
      const p = getPrice(f as CityKey, tDest as CityKey, "sedan");
      setPrice(p);
    }
  }

  function handleFrom(val: CityKey | "") {
    setFrom(val);
    recalc(val, to);
  }

  function handleTo(val: CityKey | "") {
    setTo(val);
    recalc(from, val);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      type: to === "ben_gurion" || from === "ben_gurion" ? "airport" : "intercity",
      from: from,
      to: to,
      date,
      time,
      passengers: passengers.split("-")[0],
    });
    router.push(`/${locale}/booking?${params.toString()}`);
  }

  const cities = CITIES;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden w-full">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 pt-5 pb-0">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t("widget_title")}</h2>

        {/* Mode tabs */}
        <div className="flex gap-1">
          {(["oneway", "roundtrip"] as TripMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all",
                mode === m
                  ? "bg-white text-[#16A34A] border-b-2 border-[#16A34A] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {m === "oneway" ? (
                <ArrowRight size={15} />
              ) : (
                <ArrowLeftRight size={15} />
              )}
              {t(`mode.${m}`)}
            </button>
          ))}
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
                className="bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 hover:border-[#16A34A] transition-colors shadow-sm"
              >
                <ArrowLeftRight size={14} className="text-gray-500" />
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
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {t("form.date")}
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {t("form.time")}
            </label>
            <div className="relative">
              <Clock size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* Passengers / Luggage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {t("form.passengers")}
            </label>
            <div className="relative">
              <Users size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
              >
                {["1-4", "5-8"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              {t("form.luggage")}
            </label>
            <div className="relative">
              <Briefcase size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={luggage}
                onChange={(e) => setLuggage(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
              >
                {["0", "1-3", "4-6", "7+"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Price estimate */}
        {price !== null && (
          <div className="bg-[#f0fdf4] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-[#16A34A] font-medium">{t("price.estimate")}</span>
            <span className="text-xl font-black text-[#F97316]">
              ₪{price}
            </span>
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
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck size={13} className="text-[#16A34A]" />
          {t("instant_confirmation")}
        </div>
      </form>
    </div>
  );
}
