"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, Calendar,
  Plane, Car, Phone, CheckCircle, XCircle, Clock, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/supabase";

const CITY_NAMES: Record<string, string> = {
  tel_aviv: "Tel Aviv", jerusalem: "Jérusalem", haifa: "Haïfa",
  beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya",
  ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva",
  ben_gurion: "Ben Gurion", herzliya: "Herzliya", raanana: "Ra'anana",
  kfar_saba: "Kfar Saba", modiin: "Modi'in", rehovot: "Rehovot",
  ashkelon: "Ashkelon", nahariya: "Nahariya", acre: "Akko",
  tiberias: "Tibériade", nazareth: "Nazareth", afula: "Afula",
  kiryat_shmona: "Kiryat Shmona", dimona: "Dimona",
  bat_yam: "Bat Yam", holon: "Holon", bnei_brak: "Bnei Brak",
  lod: "Lod", ramla: "Ramla",
};

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const STATUS: Record<BookingStatus, { label: string; cls: string; dot: string }> = {
  pending:   { label: "En attente", cls: "bg-amber-50 text-amber-700 border border-amber-200",   dot: "bg-amber-400" },
  confirmed: { label: "Confirmé",   cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  completed: { label: "Terminé",    cls: "bg-blue-50 text-blue-700 border border-blue-200",       dot: "bg-blue-400" },
  cancelled: { label: "Annulé",     cls: "bg-red-50 text-red-600 border border-red-200",          dot: "bg-red-400" },
};

function parseNotes(notes?: string) {
  const suitcases  = parseInt(notes?.match(/Valises:\s*(\d+)/)?.[1] ?? "0");
  const trolleys   = parseInt(notes?.match(/Trolleys:\s*(\d+)/)?.[1] ?? "0");
  const driverRaw  = notes?.match(/Chauffeur:\s*(.+)/)?.[1] ?? null;
  const driverIsMe = driverRaw === "moi";
  const driverName = driverRaw && !driverIsMe ? driverRaw.split(" | ")[0] : null;
  const driverPhone = driverRaw && !driverIsMe ? (driverRaw.split(" | ")[1] ?? null) : null;
  return { suitcases, trolleys, driverIsMe, driverName, driverPhone };
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminCalendar() {
  const now = new Date();
  const [year, setYear]           = useState(now.getFullYear());
  const [month, setMonth]         = useState(now.getMonth());
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(todayStr());

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(id: string, status: BookingStatus) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  }

  /* ── Calendar grid ── */
  const firstDay  = new Date(year, month, 1);
  const lastDay   = new Date(year, month + 1, 0);
  let   startDow  = firstDay.getDay() - 1; // Monday = 0
  if (startDow < 0) startDow = 6;
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;

  /* ── Group bookings by date ── */
  const byDay: Record<string, Booking[]> = {};
  bookings.forEach((b) => {
    if (!byDay[b.date]) byDay[b.date] = [];
    byDay[b.date].push(b);
  });

  /* ── Month stats ── */
  const monthStr      = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthBookings = bookings.filter((b) => b.date.startsWith(monthStr));
  const monthRevenue  = monthBookings.reduce((s, b) => s + (b.price_estimate || 0), 0);
  const monthDays     = new Set(monthBookings.map((b) => b.date)).size;

  const today        = todayStr();
  const selectedList = (byDay[selectedDay] || []).sort((a, b) => a.time.localeCompare(b.time));

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }
  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDay(today);
  }

  const selectedLabel = selectedDay
    ? new Date(selectedDay + "T12:00:00").toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long",
      })
    : "";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Agenda</h1>
          <p className="text-gray-400 text-sm">
            {monthBookings.length} réservation{monthBookings.length !== 1 ? "s" : ""} · {MONTH_LABELS[month]} {year}
          </p>
        </div>
        <button
          onClick={goToday}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Aujourd'hui
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-black text-gray-900">{monthBookings.length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Réservations ce mois</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-black text-[#16A34A]">
            {monthRevenue > 0 ? `${monthRevenue} ₪` : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Revenus estimés</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-black text-gray-900">{monthDays}</div>
          <div className="text-xs text-gray-400 mt-0.5">Jours avec réservation</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:items-start">

        {/* ── Calendar ── */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <span className="font-bold text-gray-900">
              {MONTH_LABELS[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Day-name row */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-slate-50">
            {DAY_LABELS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="p-16 text-center text-gray-300 text-sm">Chargement…</div>
          ) : (
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - startDow + 1;

                /* Empty cell before/after the month */
                if (dayNum < 1 || dayNum > lastDay.getDate()) {
                  return (
                    <div key={i} className="h-[60px] md:h-[88px] bg-gray-50/60" />
                  );
                }

                const dateStr   = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayBk     = byDay[dateStr] || [];
                const isToday   = dateStr === today;
                const isSel     = dateStr === selectedDay;
                const revenue   = dayBk.reduce((s, b) => s + (b.price_estimate || 0), 0);
                const pending   = dayBk.filter((b) => b.status === "pending").length;
                const confirmed = dayBk.filter((b) => b.status === "confirmed").length;
                const completed = dayBk.filter((b) => b.status === "completed").length;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(dateStr)}
                    className={cn(
                      "h-[60px] md:h-[88px] p-1.5 md:p-2 text-left transition-all hover:bg-blue-50/40 focus:outline-none",
                      isSel && "ring-2 ring-inset ring-[#1a3c6e] bg-[#1a3c6e]/5",
                      !isSel && isToday && "bg-amber-50/60",
                    )}
                  >
                    {/* Day number */}
                    <span className={cn(
                      "inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold mb-1",
                      isToday ? "bg-[#1a3c6e] text-white" : "text-gray-600",
                    )}>
                      {dayNum}
                    </span>

                    {dayBk.length > 0 && (
                      <>
                        <div className="text-xs font-black text-[#1a3c6e] leading-tight">
                          {dayBk.length} rés.
                        </div>
                        {revenue > 0 && (
                          <div className="text-xs text-[#16A34A] font-semibold leading-tight">
                            {revenue} ₪
                          </div>
                        )}
                        {/* Status dots */}
                        <div className="flex gap-0.5 mt-1 flex-wrap">
                          {pending   > 0 && Array.from({ length: Math.min(pending, 3) }).map((_, k) => (
                            <span key={`p${k}`} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          ))}
                          {confirmed > 0 && Array.from({ length: Math.min(confirmed, 3) }).map((_, k) => (
                            <span key={`c${k}`} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          ))}
                          {completed > 0 && Array.from({ length: Math.min(completed, 3) }).map((_, k) => (
                            <span key={`d${k}`} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          ))}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-100 bg-slate-50">
            {[
              { dot: "bg-amber-400",   label: "En attente" },
              { dot: "bg-emerald-500", label: "Confirmé" },
              { dot: "bg-blue-400",    label: "Terminé" },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className={cn("w-2 h-2 rounded-full", dot)} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Side panel ── */}
        <div className="w-full md:w-[300px] md:shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Panel header */}
          <div className="px-4 py-3.5 border-b border-gray-100 bg-slate-50">
            <p className="font-bold text-gray-900 text-sm capitalize">{selectedLabel}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedList.length > 0
                ? `${selectedList.length} réservation${selectedList.length > 1 ? "s" : ""}`
                : "Aucune réservation"}
            </p>
          </div>

          {selectedList.length === 0 ? (
            <div className="p-10 text-center">
              <Calendar size={28} className="mx-auto mb-2 text-gray-200" />
              <p className="text-xs text-gray-400">Journée libre</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
              {selectedList.map((b) => {
                const { suitcases, trolleys, driverIsMe, driverName, driverPhone } = parseNotes(b.notes);
                return (
                  <div key={b.id} className="p-4 space-y-2.5">

                    {/* Time + price */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1a3c6e]">{b.time}</span>
                      {b.price_estimate ? (
                        <span className="text-sm font-black text-[#16A34A]">{b.price_estimate} ₪</span>
                      ) : null}
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                      {b.trip_type === "airport"
                        ? <Plane size={11} className="text-blue-400 shrink-0" />
                        : <Car   size={11} className="text-gray-400 shrink-0" />}
                      <span className="truncate">
                        {CITY_NAMES[b.from_city] || b.from_city} → {CITY_NAMES[b.to_city] || b.to_city}
                      </span>
                    </div>

                    {/* Client */}
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{b.name}</p>
                      <a
                        href={`tel:${b.phone}`}
                        className="flex items-center gap-1 text-xs text-[#1a3c6e] hover:underline mt-0.5"
                        dir="ltr"
                      >
                        <Phone size={10} />
                        {b.phone}
                      </a>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                      <span>{b.passengers} pass. · {b.vehicle_type === "sedan" ? "4 pl." : "6 pl."}</span>
                      {(suitcases > 0 || trolleys > 0) && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={10} />
                          {suitcases > 0 && `${suitcases} val.`}
                          {suitcases > 0 && trolleys > 0 && " + "}
                          {trolleys > 0 && `${trolleys} trol.`}
                        </span>
                      )}
                    </div>

                    {/* Chauffeur */}
                    {(driverIsMe || driverName) && (
                      <div className="text-xs">
                        {driverIsMe && (
                          <span className="px-1.5 py-0.5 rounded bg-[#1a3c6e]/10 text-[#1a3c6e] font-semibold">Moi</span>
                        )}
                        {driverName && (
                          <span className="text-gray-700 font-semibold">
                            {driverName}
                            {driverPhone && (
                              <a href={`tel:${driverPhone}`} className="ml-1.5 text-[#1a3c6e] hover:underline font-normal" dir="ltr">{driverPhone}</a>
                            )}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Status + actions */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("inline-block px-2 py-0.5 rounded-lg text-xs font-semibold", STATUS[b.status].cls)}>
                        {STATUS[b.status].label}
                      </span>
                      <div className="flex gap-1 shrink-0">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              title="Confirmer"
                              className="p-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, "cancelled")}
                              title="Annuler"
                              className="p-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(b.id, "completed")}
                            title="Marquer terminé"
                            className="p-1 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Clock size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
