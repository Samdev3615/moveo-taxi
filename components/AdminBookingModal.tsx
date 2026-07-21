"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/lib/supabase";

function parseNotesForEdit(notes?: string) {
  const source      = notes?.match(/Source:\s*(\S+)/)?.[1] ?? "whatsapp";
  const client_lang = notes?.match(/Langue:\s*(\S+)/)?.[1] ?? "fr";
  const driverRaw   = notes?.match(/Chauffeur:\s*(.+)/)?.[1] ?? null;
  const driverIsMe  = driverRaw === "moi";
  const driver_type = driverRaw ? (driverIsMe ? "me" : "driver") : "me";
  const driver_name  = driverRaw && !driverIsMe ? driverRaw.split(" | ")[0] : "";
  const driver_phone = driverRaw && !driverIsMe ? (driverRaw.split(" | ")[1] ?? "") : "";
  const pickup_address = notes?.match(/Adresse:\s*(.+)/)?.[1] ?? "";
  const suitcases = parseInt(notes?.match(/Valises:\s*(\d+)/)?.[1] ?? "0");
  const trolleys  = parseInt(notes?.match(/Trolleys:\s*(\d+)/)?.[1] ?? "0");
  // remaining text (user notes)
  const cleaned = (notes ?? "")
    .replace(/Source:\s*\S+\n?/, "")
    .replace(/Langue:\s*\S+\n?/, "")
    .replace(/Chauffeur:\s*.+\n?/, "")
    .replace(/Adresse:\s*.+\n?/, "")
    .replace(/Valises:\s*\d+\n?/, "")
    .replace(/Trolleys:\s*\d+\n?/, "")
    .trim();
  return { source, client_lang, driver_type: driver_type as "me" | "driver", driver_name, driver_phone, pickup_address, suitcases, trolleys, freeNotes: cleaned };
}

const CITIES: { key: string; label: string }[] = [
  { key: "ben_gurion",    label: "Ben Gurion (Aéroport)" },
  { key: "tel_aviv",      label: "Tel Aviv" },
  { key: "jerusalem",     label: "Jérusalem" },
  { key: "haifa",         label: "Haïfa" },
  { key: "beer_sheva",    label: "Beer Sheva" },
  { key: "eilat",         label: "Eilat" },
  { key: "netanya",       label: "Netanya" },
  { key: "ashdod",        label: "Ashdod" },
  { key: "rishon",        label: "Rishon LeZion" },
  { key: "petah_tikva",   label: "Petah Tikva" },
  { key: "herzliya",      label: "Herzliya" },
  { key: "raanana",       label: "Ra'anana" },
  { key: "kfar_saba",     label: "Kfar Saba" },
  { key: "modiin",        label: "Modi'in" },
  { key: "rehovot",       label: "Rehovot" },
  { key: "ashkelon",      label: "Ashkelon" },
  { key: "nahariya",      label: "Nahariya" },
  { key: "acre",          label: "Akko" },
  { key: "tiberias",      label: "Tibériade" },
  { key: "nazareth",      label: "Nazareth" },
  { key: "bat_yam",       label: "Bat Yam" },
  { key: "holon",         label: "Holon" },
  { key: "bnei_brak",     label: "Bnei Brak" },
  { key: "lod",           label: "Lod" },
  { key: "ramla",         label: "Ramla" },
  { key: "dimona",        label: "Dimona" },
  { key: "afula",         label: "Afula" },
  { key: "kiryat_shmona", label: "Kiryat Shmona" },
];

const SOURCES = [
  { value: "whatsapp",       label: "WhatsApp" },
  { value: "telephone",      label: "Téléphone" },
  { value: "site",           label: "Site web" },
  { value: "email",          label: "Email" },
  { value: "recommandation", label: "Recommandation" },
  { value: "autre",          label: "Autre" },
];

const empty = {
  name: "", phone: "", email: "",
  trip_type: "airport" as "airport" | "intercity",
  direction: "to_airport" as "to_airport" | "from_airport",
  from_city: "", to_city: "ben_gurion",
  date: "", time: "",
  flight_number: "", terminal: "",
  passengers: 1,
  vehicle_type: "car4" as "car4" | "car6",
  suitcases: 0, trolleys: 0,
  price_estimate: "" as string | number,
  pickup_address: "", notes: "",
  source: "whatsapp",
  client_lang: "fr",
  driver_type: "me" as "me" | "driver",
  driver_name: "",
  driver_phone: "",
  status: "confirmed" as "pending" | "confirmed",
};

interface Props {
  onClose: () => void;
  onCreated: () => void;
  booking?: Booking;
}

export default function AdminBookingModal({ onClose, onCreated, booking }: Props) {
  const isEdit = !!booking;

  const [form, setForm] = useState(() => {
    if (!booking) return { ...empty };
    const parsed = parseNotesForEdit(booking.notes);
    return {
      name:          booking.name,
      phone:         booking.phone,
      email:         booking.email ?? "",
      trip_type:     booking.trip_type,
      direction:     booking.direction ?? "to_airport",
      from_city:     booking.from_city,
      to_city:       booking.to_city,
      date:          booking.date,
      time:          booking.time.slice(0, 5),
      flight_number: booking.flight_number ?? "",
      terminal:      booking.terminal ?? "",
      passengers:    booking.passengers,
      vehicle_type:  (booking.vehicle_type === "minibus" ? "car6" : "car4") as "car4" | "car6",
      suitcases:     parsed.suitcases,
      trolleys:      parsed.trolleys,
      price_estimate: booking.price_estimate ?? "" as string | number,
      pickup_address: parsed.pickup_address,
      notes:          parsed.freeNotes,
      source:         parsed.source,
      client_lang:    parsed.client_lang,
      driver_type:    parsed.driver_type,
      driver_name:    parsed.driver_name,
      driver_phone:   parsed.driver_phone,
      status:         booking.status as "pending" | "confirmed",
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string | number) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // auto direction when city changes
      if (field === "from_city" && value === "ben_gurion") {
        next.trip_type  = "airport";
        next.direction  = "from_airport";
        next.to_city    = f.to_city === "ben_gurion" ? "" : f.to_city;
      }
      if (field === "to_city" && value === "ben_gurion") {
        next.trip_type  = "airport";
        next.direction  = "to_airport";
        next.from_city  = f.from_city === "ben_gurion" ? "" : f.from_city;
      }
      // auto vehicle type from passengers
      if (field === "passengers") {
        next.vehicle_type = Number(value) > 4 ? "car6" : "car4";
      }
      return next;
    });
  }

  function counter(field: "suitcases" | "trolleys", delta: number) {
    setForm((f) => ({ ...f, [field]: Math.max(0, Math.min(9, f[field] + delta)) }));
  }

  function buildNotes() {
    return [
      form.source      ? `Source: ${form.source}` : null,
      form.client_lang ? `Langue: ${form.client_lang}` : null,
      form.driver_type === "me" ? `Chauffeur: moi` : null,
      form.driver_type === "driver" && form.driver_name
        ? `Chauffeur: ${form.driver_name}${form.driver_phone ? ` | ${form.driver_phone}` : ""}`
        : null,
      form.pickup_address ? `Adresse: ${form.pickup_address}` : null,
      form.suitcases > 0 ? `Valises: ${form.suitcases}` : null,
      form.trolleys  > 0 ? `Trolleys: ${form.trolleys}`  : null,
      form.notes || null,
    ].filter(Boolean).join("\n") || null;
  }

  async function submit() {
    if (!form.name || !form.phone || !form.from_city || !form.to_city || !form.date || !form.time) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const tripType = form.from_city === "ben_gurion" || form.to_city === "ben_gurion" ? "airport" : "intercity";
      const notes = buildNotes();

      if (isEdit) {
        const res = await fetch(`/api/bookings/${booking!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _full_update: true,
            ...form,
            trip_type: tripType,
            price_estimate: form.price_estimate !== "" ? Number(form.price_estimate) : null,
            notes,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Erreur");
      } else {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            trip_type: tripType,
            price_estimate: form.price_estimate !== "" ? Number(form.price_estimate) : null,
            locale: "fr",
            _source: form.source,
            _client_lang: form.client_lang,
            _driver_type: form.driver_type,
            _driver_name: form.driver_type === "driver" ? form.driver_name : null,
            _driver_phone: form.driver_type === "driver" ? form.driver_phone : null,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Erreur");
      }

      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

  const isAirport = form.from_city === "ben_gurion" || form.to_city === "ben_gurion";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-900">{isEdit ? "Modifier la réservation" : "Nouvelle réservation"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEdit ? `ID : ${booking!.id.slice(0, 8)}` : "Saisie manuelle via WhatsApp"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Client */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Client</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Nom complet *</label>
                <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Prénom Nom" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Téléphone *</label>
                  <input className={inputCls} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="05X XXX XXXX" dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} placeholder="optionnel" dir="ltr" />
                </div>
              </div>
            </div>
          </div>

          {/* Trajet */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Trajet</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Départ *</label>
                  <select className={inputCls} value={form.from_city} onChange={e => set("from_city", e.target.value)}>
                    <option value="">---</option>
                    {CITIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Destination *</label>
                  <select className={inputCls} value={form.to_city} onChange={e => set("to_city", e.target.value)}>
                    <option value="">---</option>
                    {CITIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Date *</label>
                  <input type="date" className={inputCls} value={form.date} onChange={e => set("date", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Heure *</label>
                  <input type="time" className={inputCls} value={form.time} onChange={e => set("time", e.target.value)} />
                </div>
              </div>
              {isAirport && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>N° de vol</label>
                    <input className={inputCls} value={form.flight_number} onChange={e => set("flight_number", e.target.value)} placeholder="LY001" />
                  </div>
                  <div>
                    <label className={labelCls}>Terminal</label>
                    <select className={inputCls} value={form.terminal} onChange={e => set("terminal", e.target.value)}>
                      <option value="">---</option>
                      <option value="T1">Terminal 1</option>
                      <option value="T3">Terminal 3</option>
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className={labelCls}>Adresse de prise en charge</label>
                <input className={inputCls} value={form.pickup_address} onChange={e => set("pickup_address", e.target.value)} placeholder="Ex. : 12 rue Herzl, Tel Aviv" />
              </div>
            </div>
          </div>

          {/* Passagers & bagages */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Passagers & bagages</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Passagers</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => set("passengers", n)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-bold border transition-all",
                        form.passengers === n
                          ? n <= 4
                            ? "bg-[#1a3c6e] text-white border-[#1a3c6e]"
                            : "bg-[#F97316] text-white border-[#F97316]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {form.vehicle_type === "car4" ? "Taxi 4 places" : "Taxi 6 places"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(["suitcases", "trolleys"] as const).map(field => (
                  <div key={field}>
                    <label className={labelCls}>{field === "suitcases" ? "Valises" : "Trolleys"}</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => counter(field, -1)}
                        className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center">
                        −
                      </button>
                      <span className="flex-1 text-center text-sm font-bold text-gray-800">{form[field]}</span>
                      <button type="button" onClick={() => counter(field, 1)}
                        className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Source */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Source</p>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("source", value)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all",
                    form.source === value
                      ? "bg-[#1a3c6e] text-white border-[#1a3c6e]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Langue client */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Langue du client</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "fr", label: "🇫🇷 Français" },
                { value: "he", label: "🇮🇱 Hébreu" },
                { value: "en", label: "🇬🇧 Anglais" },
                { value: "ru", label: "🇷🇺 Russe" },
                { value: "es", label: "🇪🇸 Espagnol" },
                { value: "ar", label: "🇸🇦 Arabe" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("client_lang", value)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all",
                    form.client_lang === value
                      ? "bg-[#1a3c6e] text-white border-[#1a3c6e]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chauffeur */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Chauffeur</p>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3">
              {([
                { value: "me",     label: "Je fais la course" },
                { value: "driver", label: "Attribuer à un chauffeur" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("driver_type", value)}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    form.driver_type === value
                      ? "bg-[#1a3c6e] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {form.driver_type === "driver" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nom du chauffeur</label>
                  <input className={inputCls} value={form.driver_name} onChange={e => set("driver_name", e.target.value)} placeholder="Prénom Nom" />
                </div>
                <div>
                  <label className={labelCls}>Téléphone</label>
                  <input className={inputCls} value={form.driver_phone} onChange={e => set("driver_phone", e.target.value)} placeholder="05X XXX XXXX" dir="ltr" />
                </div>
              </div>
            )}
          </div>

          {/* Prix & statut */}
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Prix & statut</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Prix (₪)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.price_estimate}
                  onChange={e => set("price_estimate", e.target.value)}
                  placeholder="Ex. : 270"
                  min={0}
                />
              </div>
              <div>
                <label className={labelCls}>Statut initial</label>
                <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value as "pending" | "confirmed")}>
                  <option value="confirmed">Confirmé</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes internes</label>
            <textarea
              className={cn(inputCls, "resize-none")}
              rows={3}
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Informations supplémentaires..."
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 space-y-2">
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-[#1a3c6e] text-white font-bold py-3 rounded-xl hover:bg-[#112a50] transition-colors text-sm disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Enregistrer les modifications" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
