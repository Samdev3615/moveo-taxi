"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITIES, getPrice, type CityKey } from "@/lib/prices";

type Step = 1 | 2 | 3;

interface FormData {
  trip_type: "airport" | "intercity";
  direction: "to_airport" | "from_airport";
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  flight_number: string;
  terminal: string;
  passengers: number;
  vehicle_type: "sedan" | "minibus";
  name: string;
  phone: string;
  email: string;
  notes: string;
  price_estimate: number | null;
}

function BookingFormInner() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    trip_type: (searchParams.get("type") as "airport" | "intercity") || "airport",
    direction: (searchParams.get("direction") as "to_airport" | "from_airport") || "to_airport",
    from_city: searchParams.get("from") || "",
    to_city: searchParams.get("to") || "ben_gurion",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    flight_number: "",
    terminal: "",
    passengers: Number(searchParams.get("passengers")) || 1,
    vehicle_type: (searchParams.get("vehicle") as "sedan" | "minibus") || "sedan",
    name: "",
    phone: "",
    email: "",
    notes: "",
    price_estimate: null,
  });

  useEffect(() => {
    if (form.from_city && form.to_city) {
      const p = getPrice(form.from_city as CityKey, form.to_city as CityKey, form.vehicle_type);
      setForm((f) => ({ ...f, price_estimate: p }));
    }
  }, [form.from_city, form.to_city, form.vehicle_type]);

  function update(field: keyof FormData, value: string | number | null) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      router.push(`/${locale}/confirmation/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setLoading(false);
    }
  }

  const isAirport = form.trip_type === "airport";
  const cities = CITIES.filter((c) => c !== "ben_gurion");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Step indicator */}
      <div className="flex border-b border-gray-100">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "flex-1 py-3 text-center text-sm font-medium",
              s === step ? "text-[#1a3c6e] border-b-2 border-[#1a3c6e]" : "text-gray-400",
              s < step && "text-green-600"
            )}
          >
            {s < step ? <CheckCircle size={16} className="inline me-1" /> : null}
            {s === 1 ? t("tabs.airport") : s === 2 ? "✈" : t("form.name").slice(0, 6)}
          </div>
        ))}
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Step 1: Trip details */}
        {step === 1 && (
          <>
            {/* Trip type */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {(["airport", "intercity"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update("trip_type", type)}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    form.trip_type === type
                      ? "bg-[#1a3c6e] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {t(`tabs.${type}`)}
                </button>
              ))}
            </div>

            {/* Direction (airport only) */}
            {isAirport && (
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {(["to_airport", "from_airport"] as const).map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => {
                      update("direction", dir);
                      if (dir === "to_airport") update("to_city", "ben_gurion");
                      else update("from_city", "ben_gurion");
                    }}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-medium transition-colors",
                      form.direction === dir
                        ? "bg-[#f5c518] text-[#1a3c6e]"
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {dir === "to_airport" ? t("form.toAirport") : t("form.fromAirport")}
                  </button>
                ))}
              </div>
            )}

            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.from")}</label>
                <select
                  value={form.from_city}
                  onChange={(e) => update("from_city", e.target.value)}
                  disabled={isAirport && form.direction === "from_airport"}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] disabled:bg-gray-50"
                >
                  <option value="">---</option>
                  {isAirport && form.direction === "from_airport" ? (
                    <option value="ben_gurion">{t("form.cities.ben_gurion")}</option>
                  ) : (
                    cities.map((c) => (
                      <option key={c} value={c}>{t(`form.cities.${c}`)}</option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.to")}</label>
                <select
                  value={form.to_city}
                  onChange={(e) => update("to_city", e.target.value)}
                  disabled={isAirport && form.direction === "to_airport"}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] disabled:bg-gray-50"
                >
                  <option value="">---</option>
                  {isAirport && form.direction === "to_airport" ? (
                    <option value="ben_gurion">{t("form.cities.ben_gurion")}</option>
                  ) : (
                    cities.map((c) => (
                      <option key={c} value={c}>{t(`form.cities.${c}`)}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Date / Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.date")}</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("date", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.time")}</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
                />
              </div>
            </div>

            {/* Passengers / Vehicle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.passengers")}</label>
                <select
                  value={form.passengers}
                  onChange={(e) => update("passengers", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
                >
                  {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.vehicle")}</label>
                <select
                  value={form.vehicle_type}
                  onChange={(e) => update("vehicle_type", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
                >
                  <option value="sedan">{t("form.vehicles.sedan")}</option>
                  <option value="minibus">{t("form.vehicles.minibus")}</option>
                </select>
              </div>
            </div>

            {/* Price */}
            {form.price_estimate !== null && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-blue-700">{t("price.estimate")}</span>
                <span className="text-xl font-bold text-[#1a3c6e]">
                  {form.price_estimate} {t("price.currency")}
                </span>
              </div>
            )}
          </>
        )}

        {/* Step 2: Flight info (airport only) */}
        {step === 2 && isAirport && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.flightNumber")}</label>
              <input
                type="text"
                value={form.flight_number}
                onChange={(e) => update("flight_number", e.target.value)}
                placeholder="LY001"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.terminal")}</label>
              <select
                value={form.terminal}
                onChange={(e) => update("terminal", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
              >
                <option value="">---</option>
                <option value="T1">Terminal 1</option>
                <option value="T3">Terminal 3</option>
              </select>
            </div>
          </>
        )}

        {/* Step 2: Contact (intercity) or Step 3 (airport) */}
        {((step === 2 && !isAirport) || (step === 3 && isAirport)) && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.name")} *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.phone")} *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
                dir="ltr"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.email")}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                dir="ltr"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.notes")}</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] resize-none"
              />
            </div>

            {/* Summary */}
            {form.price_estimate !== null && (
              <div className="bg-[#1a3c6e] text-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">{t("price.estimate")}</span>
                  <span className="text-2xl font-bold text-[#f5c518]">
                    {form.price_estimate} ₪
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-6 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            ←
          </button>
        )}

        {((step === 1) || (step === 2 && isAirport)) ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={!form.from_city || !form.to_city || !form.date || !form.time}
            className="flex-1 bg-[#1a3c6e] text-white font-bold py-3 rounded-xl hover:bg-[#112a50] transition-colors disabled:opacity-40"
          >
            →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.phone}
            className="flex-1 bg-[#f5c518] text-[#1a3c6e] font-bold py-3 rounded-xl hover:bg-[#d4a800] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {t("form.submit")}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
