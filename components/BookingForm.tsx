"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { cn } from "@/lib/utils";
import { CITIES, type CityKey } from "@/lib/prices";
import { usePriceData } from "@/lib/hooks/usePriceData";

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
  vehicle_type: "car4" | "car6";
  name: string;
  phone: string;
  email: string;
  notes: string;
  pickup_address: string;
  suitcases: number;
  trolleys: number;
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
  const [validationError, setValidationError] = useState("");
  const [luggageWarning, setLuggageWarning] = useState(false);
  const [luggageForced, setLuggageForced] = useState(false);
  const [preWarningLuggage, setPreWarningLuggage] = useState({ suitcases: 0, trolleys: 0 });

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
    vehicle_type: "car4" as "car4" | "car6",
    name: "",
    phone: "",
    email: "",
    notes: "",
    pickup_address: "",
    suitcases: 0,
    trolleys: 0,
    price_estimate: null,
  });

  const { priceData, loadingPrice, noPrice } = usePriceData(form.from_city, form.to_city);

  useEffect(() => {
    if (!priceData) { setForm((f) => ({ ...f, price_estimate: null })); return; }
    if (!form.time) { setForm((f) => ({ ...f, price_estimate: null })); return; }
    const hour = parseInt(form.time.split(":")[0]);
    const isNight = hour >= 21 || hour < 6;
    const isCar6 = form.passengers > 4 || luggageForced;
    const vehicle: "car4" | "car6" = isCar6 ? "car6" : "car4";
    const price = isCar6
      ? (isNight ? priceData.car6_night : priceData.car6_day)
      : (isNight ? priceData.car4_night : priceData.car4_day);
    setForm((f) => ({ ...f, vehicle_type: vehicle, price_estimate: price }));
  }, [priceData, form.passengers, form.time, luggageForced]);

  useEffect(() => {
    if (luggageForced && form.suitcases * 2 + form.trolleys <= 8) {
      setLuggageForced(false);
    }
  }, [form.suitcases, form.trolleys, luggageForced]);

  function update(field: keyof FormData, value: string | number | null) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleLuggageIncrement(field: "suitcases" | "trolleys") {
    const newVal = Math.min(9, (form[field] as number) + 1);
    const newSuitcases = field === "suitcases" ? newVal : form.suitcases;
    const newTrolleys = field === "trolleys" ? newVal : form.trolleys;
    setForm((f) => ({ ...f, [field]: newVal }));
    if (newSuitcases * 2 + newTrolleys > 8 && form.passengers <= 4 && !luggageForced) {
      setPreWarningLuggage({ suitcases: form.suitcases, trolleys: form.trolleys });
      setLuggageWarning(true);
    }
  }

  function handleLuggageAccept() {
    setLuggageForced(true);
    setLuggageWarning(false);
  }

  function handleLuggageCorrect() {
    setForm((f) => ({ ...f, suitcases: preWarningLuggage.suitcases, trolleys: preWarningLuggage.trolleys }));
    setLuggageWarning(false);
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
    <>
    {luggageWarning && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={22} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t("form.luggage_warning_title")}</h3>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{t("form.luggage_warning_body")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={handleLuggageAccept}
              className="w-full bg-[#F97316] text-white font-bold py-3 rounded-xl hover:bg-[#ea6a05] transition-colors"
            >
              {t("form.luggage_warning_accept")}
            </button>
            <button
              type="button"
              onClick={handleLuggageCorrect}
              className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t("form.luggage_warning_correct")}
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Step indicator */}
      <div className="flex border-b border-gray-100">
        {(isAirport ? [1, 2, 3] : [1, 2]).map((s) => (
          <div
            key={s}
            className={cn(
              "flex-1 py-3 text-center text-sm font-medium",
              s === step ? "text-[#1a3c6e] border-b-2 border-[#1a3c6e]" : "text-gray-400",
              s < step && "text-green-600"
            )}
          >
            {s < step ? <CheckCircle size={16} className="inline me-1" /> : null}
            {isAirport
              ? (s === 1 ? t("tabs.airport") : s === 2 ? t("tabs.flight") : t("tabs.contact"))
              : (s === 1 ? t("tabs.airport") : t("tabs.contact"))
            }
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
                <DatePicker
                  value={form.date}
                  onChange={(v) => update("date", v)}
                  min={new Date().toISOString().split("T")[0]}
                  appLocale={locale}
                  placeholder={t("form.date")}
                  inputClassName="border-gray-200 focus:ring-[#1a3c6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.time")}</label>
                <TimePicker
                  value={form.time}
                  onChange={(v) => update("time", v)}
                  hoursLabel={t("form.hours")}
                  minutesLabel={t("form.minutes")}
                />
              </div>
            </div>

            {/* Pickup address */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("form.pickup_address")}</label>
              <AddressAutocomplete
                value={form.pickup_address}
                onChange={(v) => update("pickup_address", v)}
                placeholder={t("form.pickup_address_placeholder")}
              />
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">{t("form.passengers")}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update("passengers", n)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      form.passengers === n
                        ? n <= 4
                          ? "bg-[#1a3c6e] text-white border-[#1a3c6e]"
                          : "bg-[#F97316] text-white border-[#F97316]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {(form.passengers <= 4 && !luggageForced)
                  ? t("form.vehicle_auto_4")
                  : t("form.vehicle_auto_6")}
              </p>
            </div>

            {/* Luggage */}
            <div className="grid grid-cols-2 gap-4">
              {(["suitcases", "trolleys"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-500 mb-2">{t(`form.${field}`)}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update(field, Math.max(0, (form[field] as number) - 1))}
                      className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >−</button>
                    <span className="flex-1 text-center text-sm font-bold text-gray-800">{form[field] as number}</span>
                    <button
                      type="button"
                      onClick={() => handleLuggageIncrement(field)}
                      className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            {loadingPrice && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-center">
                <span className="text-sm text-blue-700 animate-pulse">{t("form.calculating")}</span>
              </div>
            )}
            {!loadingPrice && form.price_estimate !== null && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xl font-bold text-[#1a3c6e]">
                  {form.price_estimate} {t("price.currency")}
                </span>
              </div>
            )}
            {!loadingPrice && noPrice && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-sm text-amber-700">{t("price.on_request")}</span>
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
                <div className="flex justify-end items-center">
                  <span className="text-2xl font-bold text-[#f5c518]">
                    {form.price_estimate} ₪
                  </span>
                </div>
              </div>
            )}
            {noPrice && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-sm text-amber-700">{t("price.on_request")}</span>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-6 space-y-3">
        {validationError && (
          <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-xl px-4 py-2">
            {validationError}
          </p>
        )}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => { setStep((s) => (s - 1) as Step); setValidationError(""); }}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              {t("form.back")}
            </button>
          )}

          {((step === 1) || (step === 2 && isAirport)) ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  if (!form.from_city) { setValidationError(t("form.error_from")); return; }
                  if (!form.to_city) { setValidationError(t("form.error_to")); return; }
                  if (!form.date) { setValidationError(t("form.error_date")); return; }
                  if (!form.time) { setValidationError(t("form.error_time")); return; }
                }
                setValidationError("");
                setStep((s) => (s + 1) as Step);
              }}
              className="flex-1 bg-[#1a3c6e] text-white font-bold py-3 rounded-xl hover:bg-[#112a50] transition-colors"
            >
              {t("form.continue")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!form.name) { setValidationError(t("form.error_name")); return; }
                if (!form.phone) { setValidationError(t("form.error_phone")); return; }
                if (!/^\+?[\d\s\-\(\)]{7,20}$/.test(form.phone)) { setValidationError(t("form.error_phone")); return; }
                setValidationError("");
                handleSubmit();
              }}
              disabled={loading}
              className="flex-1 bg-[#f5c518] text-[#1a3c6e] font-bold py-3 rounded-xl hover:bg-[#d4a800] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {t("form.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
