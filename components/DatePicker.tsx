"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { fr, he, enUS, ru, es } from "date-fns/locale";
import type { Locale } from "date-fns";
import { Calendar } from "lucide-react";
import "react-day-picker/style.css";

const localeMap: Record<string, Locale> = {
  fr,
  he,
  en: enUS,
  ru,
  es,
};

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  required?: boolean;
  inputClassName?: string;
  appLocale: string;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  min,
  inputClassName = "",
  appLocale,
  placeholder = "Date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dateLocale = localeMap[appLocale] ?? enUS;
  const selectedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const validSelected = selectedDate && isValid(selectedDate) ? selectedDate : undefined;
  const minDate = min ? parse(min, "yyyy-MM-dd", new Date()) : undefined;
  const displayValue = validSelected
    ? format(validSelected, "PPP", { locale: dateLocale })
    : "";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleSelect(date: Date | undefined) {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Calendar
          size={14}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm text-start focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white ${
            displayValue ? "text-gray-800" : "text-gray-400"
          } ${inputClassName}`}
        >
          {displayValue || placeholder}
        </button>
      </div>

      {open && (
        <div className="absolute top-full mt-1 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 start-0 rdp-moveo">
          <DayPicker
            mode="single"
            selected={validSelected}
            onSelect={handleSelect}
            locale={dateLocale}
            dir={appLocale === "he" ? "rtl" : "ltr"}
            disabled={minDate ? [{ before: minDate }] : undefined}
          />
        </div>
      )}
    </div>
  );
}
