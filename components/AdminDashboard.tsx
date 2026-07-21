"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Download, CheckCircle, XCircle, Clock, Plane, Car, Phone, Briefcase, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import AdminBookingModal from "@/components/AdminBookingModal";
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

const LANG_FLAGS: Record<string, string> = { fr: "🇫🇷", he: "🇮🇱", en: "🇬🇧", ru: "🇷🇺", es: "🇪🇸", ar: "🇸🇦" };

const STATUS: Record<BookingStatus, { label: string; cls: string }> = {
  pending:   { label: "En attente", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmé",   cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  completed: { label: "Terminé",    cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  cancelled: { label: "Annulé",     cls: "bg-red-50 text-red-600 border border-red-200" },
};

const SOURCE_LABELS: Record<string, { label: string; cls: string }> = {
  whatsapp:       { label: "WhatsApp",       cls: "bg-green-50 text-green-700 border-green-200" },
  telephone:      { label: "Téléphone",      cls: "bg-blue-50 text-blue-700 border-blue-200" },
  site:           { label: "Site web",       cls: "bg-purple-50 text-purple-700 border-purple-200" },
  email:          { label: "Email",          cls: "bg-sky-50 text-sky-700 border-sky-200" },
  recommandation: { label: "Recommandation", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  autre:          { label: "Autre",          cls: "bg-gray-50 text-gray-600 border-gray-200" },
};

function parseNotes(notes?: string) {
  const suitcases = parseInt(notes?.match(/Valises:\s*(\d+)/)?.[1] ?? "0");
  const trolleys  = parseInt(notes?.match(/Trolleys:\s*(\d+)/)?.[1] ?? "0");
  const address   = notes?.match(/Adresse:\s*(.+)/)?.[1] ?? null;
  const source    = notes?.match(/Source:\s*(\S+)/)?.[1] ?? null;
  const lang      = notes?.match(/Langue:\s*(\S+)/)?.[1] ?? null;
  const driverRaw = notes?.match(/Chauffeur:\s*(.+)/)?.[1] ?? null;
  const driverIsMe = driverRaw === "moi";
  const driverName = driverRaw && !driverIsMe ? driverRaw.split(" | ")[0] : null;
  const driverPhone = driverRaw && !driverIsMe ? (driverRaw.split(" | ")[1] ?? null) : null;
  return { suitcases, trolleys, address, source, lang, driverIsMe, driverName, driverPhone };
}

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
  const [fetchError, setFetchError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    const url = filter === "all" ? "/api/bookings" : `/api/bookings?status=${filter}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setFetchError(true);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function deleteBooking(id: string) {
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert("Erreur : " + (d.error || "inconnue"));
      return;
    }
    setConfirmDelete(null);
    fetch_();
  }

  async function updateStatus(id: string, status: BookingStatus) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      alert("Erreur lors de la mise à jour du statut");
      return;
    }
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
    <>
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 className="hidden md:block text-xl font-black text-gray-900 tracking-tight">Réservations</h1>
          <p className="text-gray-400 text-sm">{bookings.length} réservation{bookings.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetch_}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span className="hidden md:inline">Actualiser</span>
          </button>
          <button
            onClick={exportCSV}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={13} />
            CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3c6e] text-white rounded-xl text-sm font-bold hover:bg-[#112a50] transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span className="hidden md:inline">Nouvelle réservation</span>
            <span className="md:hidden">Nouveau</span>
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <XCircle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700">
            Erreur de connexion.{" "}
            <button onClick={fetch_} className="underline font-semibold">Réessayer</button>
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 md:mb-6">
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

      {/* Mobile cards */}
      {loading ? (
        <div className="md:hidden p-12 text-center text-gray-300">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="md:hidden p-12 text-center text-gray-300">
          <Car size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucune réservation</p>
        </div>
      ) : (
        <div className="md:hidden space-y-3">
          {bookings.map((b) => {
            const { suitcases, trolleys, address, source, lang, driverIsMe, driverName, driverPhone } = parseNotes(b.notes);
            const s = source ? SOURCE_LABELS[source] : null;
            return (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
                {/* Top row: date + status */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{b.date}</span>
                    <span className="ml-2 text-gray-400 text-sm">{b.time}</span>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", STATUS[b.status].cls)}>
                    {STATUS[b.status].label}
                  </span>
                </div>

                {/* Route */}
                <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                  {b.trip_type === "airport"
                    ? <Plane size={14} className="text-blue-400 shrink-0" />
                    : <Car size={14} className="text-gray-400 shrink-0" />}
                  <span>{CITY_NAMES[b.from_city] || b.from_city}</span>
                  <span className="text-gray-300">→</span>
                  <span>{CITY_NAMES[b.to_city] || b.to_city}</span>
                </div>

                {/* Client + details */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="font-medium text-gray-800">{b.name}</div>
                    <a href={`tel:${b.phone}`} className="flex items-center gap-1 text-sm text-[#1a3c6e]" dir="ltr">
                      <Phone size={12} />{b.phone}
                    </a>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s && <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", s.cls)}>{s.label}</span>}
                      {lang && LANG_FLAGS[lang] && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-gray-50 text-gray-700 border-gray-200">{LANG_FLAGS[lang]}</span>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {b.passengers}p · {b.vehicle_type === "sedan" ? "4pl" : "6pl"}
                      {suitcases > 0 && ` · ${suitcases}🧳`}
                      {trolleys > 0 && ` · ${trolleys} trolley`}
                    </div>
                    {address && <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{address}</div>}
                    {driverIsMe && <span className="text-xs px-1.5 py-0.5 rounded bg-[#1a3c6e]/10 text-[#1a3c6e] font-semibold">Moi</span>}
                    {driverName && <div className="text-xs text-gray-600 font-semibold">{driverName}{driverPhone && ` · ${driverPhone}`}</div>}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-bold text-gray-800">{b.price_estimate ? `${b.price_estimate} ₪` : <span className="text-gray-300">—</span>}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50">
                  <button onClick={() => setEditBooking(b)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1a3c6e]/10 text-[#1a3c6e] rounded-lg text-xs font-semibold">
                    <Pencil size={12} />Modifier
                  </button>
                  {b.status === "pending" && <>
                    <button onClick={() => updateStatus(b.id, "confirmed")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold">
                      <CheckCircle size={12} />Confirmer
                    </button>
                    <button onClick={() => updateStatus(b.id, "cancelled")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold">
                      <XCircle size={12} />Annuler
                    </button>
                  </>}
                  {b.status === "confirmed" && (
                    <button onClick={() => updateStatus(b.id, "completed")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg text-xs font-semibold">
                      <Clock size={12} />Terminé
                    </button>
                  )}
                  {b.status === "cancelled" && (
                    confirmDelete === b.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => deleteBooking(b.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold">Confirmer</button>
                        <button onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(b.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold">
                        <Trash2 size={12} />Supprimer
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table (desktop only) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                      {(() => {
                        const { suitcases, trolleys, address, driverIsMe, driverName, driverPhone } = parseNotes(b.notes);
                        return (
                          <>
                            {(suitcases > 0 || trolleys > 0) && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 ml-5">
                                <Briefcase size={11} className="shrink-0" />
                                {suitcases > 0 && <span>{suitcases} valise{suitcases > 1 ? "s" : ""}</span>}
                                {suitcases > 0 && trolleys > 0 && <span>·</span>}
                                {trolleys > 0 && <span>{trolleys} trolley{trolleys > 1 ? "s" : ""}</span>}
                              </div>
                            )}
                            {address && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 ml-5">
                                <MapPin size={11} className="shrink-0" />
                                <span className="truncate max-w-[220px]">{address}</span>
                              </div>
                            )}
                            {driverIsMe && (
                              <div className="text-xs mt-0.5 ml-5">
                                <span className="px-1.5 py-0.5 rounded bg-[#1a3c6e]/10 text-[#1a3c6e] font-semibold">Moi</span>
                              </div>
                            )}
                            {driverName && (
                              <div className="text-xs text-gray-500 mt-0.5 ml-5">
                                <span className="font-semibold text-gray-700">{driverName}</span>
                                {driverPhone && (
                                  <a href={`tel:${driverPhone}`} className="ml-1.5 text-[#1a3c6e] hover:underline" dir="ltr">{driverPhone}</a>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}
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
                      {(() => {
                        const { source, lang } = parseNotes(b.notes);
                        const s = source ? SOURCE_LABELS[source] : null;
                        return (
                          <div className="flex items-center gap-1 flex-wrap mt-1">
                            {s && (
                              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", s.cls)}>
                                {s.label}
                              </span>
                            )}
                            {lang && LANG_FLAGS[lang] && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-gray-50 text-gray-700 border-gray-200">
                                {LANG_FLAGS[lang]}
                              </span>
                            )}
                          </div>
                        );
                      })()}
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
                        <button
                          onClick={() => setEditBooking(b)}
                          title="Modifier"
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1a3c6e]/10 text-[#1a3c6e] rounded-lg hover:bg-[#1a3c6e]/20 transition-colors text-xs font-semibold"
                        >
                          <Pencil size={12} />
                          Modifier
                        </button>
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
                        {b.status === "cancelled" && (
                          confirmDelete === b.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteBooking(b.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(b.id)}
                              title="Supprimer définitivement"
                              className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )
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

    {showModal && (
      <AdminBookingModal
        onClose={() => setShowModal(false)}
        onCreated={fetch_}
      />
    )}
    {editBooking && (
      <AdminBookingModal
        booking={editBooking}
        onClose={() => setEditBooking(null)}
        onCreated={fetch_}
      />
    )}
    </>
  );
}
