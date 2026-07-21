"use client";

import { Clock } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  inputClassName?: string;
  hoursLabel?: string;
  minutesLabel?: string;
}

export default function TimePicker({
  value,
  onChange,
  inputClassName = "",
  hoursLabel = "Hours",
  minutesLabel = "Minutes",
}: TimePickerProps) {
  const hours = value ? value.split(":")[0] : "06";
  const minutes = value ? (value.split(":")[1] ?? "00") : "00";

  return (
    <div className={`flex gap-2 ${inputClassName}`}>
      <div className="relative flex-1">
        <Clock
          size={14}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <select
          value={hours}
          aria-label={hoursLabel}
          onChange={(e) => onChange(`${e.target.value}:${minutes}`)}
          className="w-full ps-9 pe-2 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}:00
            </option>
          ))}
        </select>
      </div>
      <select
        value={minutes}
        aria-label={minutesLabel}
        onChange={(e) => onChange(`${hours}:${e.target.value}`)}
        className="w-20 px-2 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white text-center"
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            :{m}
          </option>
        ))}
      </select>
    </div>
  );
}
