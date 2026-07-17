"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Download, CheckCircle, XCircle, Clock, Plane, Car, Phone } from "lucide-react";
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
  kiryat_shmona: "Kiryat Shmona", dimona: "Dimona", bat_yam: "Bat Yam",
  holon: "Holon", bnei_brak: "Bnei Brak", lod: "Lod", ramla: "Ramla",
};

const STATUS: Record<BookingStatus, { label: string; cls: string }> = {
  pending:   { label: "En attente", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmé",   cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  completed: { label: "Terminé",    cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  cancelled: { label: "Annulé",     cls: "bg-red-50 text-red-600 border border-red-200" },
};

const FILTERS = [
  { key: "all",       label: "Toutes" },
  { key: "pending",   label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "completed", label: "Terminées" },
] as const;

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/bookings" : `/api/bookings?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function updateStatus(id: string, status: BookingStatus) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetch_();
  }

  function exportCSV() {
    const headers = ["#", "Date", "Heure", "De", "Vers", "Type", "Client", "Téléphone", "Passagers", "Véhicule", "Prix", "Statut"];
    const rows = bookings.map((b) => [
      b.id.slice(0, 8),
      b.date, b.time,
      b.from_city, b.to_city,
      b.trip_type,
      b.name, b.phone,
      b.passengers,
      b.vehicle_type,
      b.price_estimate || "",
      STATUS[b.status].label,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  const countFor = (s: BookingStatus | "all") =>
    s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Réservations</h1>
          <p className="text-gray-400 text-sm">{bookings.length} réservation{bookings.length !== 1 ? "s" : ""} au total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetch_}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3c6e] text-white rounded-xl text-sm font-medium hover:bg-[#112a50] transition-colors shadow-sm"
          >
            <Download size={13} />
            CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as BookingStatus | "all")}
            className={cn(
              "bg-white rounded-2xl p-4 text-left shadow-sm border-2 transition-all hover:shadow-md",
              filter === key ? "border-[#1a3c6e] shadow-md" : "border-transparent"
            )}
          >
            <div className={cn(
              "text-2xl font-black",
              filter === key ? "text-[#1a3c6e]" : "text-gray-700"
            )}>
              {countFor(key as BookingStatus | "all")}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-300">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
            <p className="text-sm">Chargement…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-gray-300">
            <Car size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucune réservation</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Trajet</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{b.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-800">{b.date}</div>
                      <div className="text-gray-400 text-xs">{b.time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                        {b.trip_type === "airport" ? (
                          <Plane size={13} className="text-blue-400 shrink-0" />
                        ) : (
                          <Car size={13} className="text-gray-400 shrink-0" />
                        )}
                        <span>{CITY_NAMES[b.from_city] || b.from_city}</span>
                        <span className="text-gray-300">→</span>
                        <span>{CITY_NAMES[b.to_city] || b.to_city}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 ml-5">
                        {b.passengers} passager{b.passengers > 1 ? "s" : ""} · {b.vehicle_type === "sedan" ? "4 places" : "6 places"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{b.name}</div>
                      <a
                        href={`tel:${b.phone}`}
                        className="flex items-center gap-1 text-xs text-[#1a3c6e] hover:underline mt-0.5"
                        dir="ltr"
                      >
                        <Phone size={11} />
                        {b.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">
                      {b.price_estimate ? `${b.price_estimate} ₪` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-block px-2.5 py-1 rounded-lg text-xs font-semibold", STATUS[b.status].cls)}>
                        {STATUS[b.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              title="Confirmer"
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, "cancelled")}
                              title="Annuler"
                              className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(b.id, "completed")}
                            title="Marquer terminé"
                            className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Clock size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
