"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { RoutePrice, RoutePriceInsert } from "@/lib/supabase";
import { CITIES, type CityKey } from "@/lib/prices";
import { Plus, Save, Trash2, Loader2, CheckCircle, RefreshCw, Search } from "lucide-react";

const CITY_LABELS: Record<CityKey, string> = {
  tel_aviv: "Tel Aviv", jerusalem: "Jérusalem", haifa: "Haïfa",
  beer_sheva: "Beer Sheva", eilat: "Eilat", netanya: "Netanya",
  ashdod: "Ashdod", rishon: "Rishon LeZion", petah_tikva: "Petah Tikva",
  ben_gurion: "Ben Gurion", herzliya: "Herzliya", raanana: "Ra'anana",
  kfar_saba: "Kfar Saba", modiin: "Modi'in", rehovot: "Rehovot",
  ashkelon: "Ashkelon", nahariya: "Nahariya", acre: "Akko",
  tiberias: "Tibériade", nazareth: "Nazareth", afula: "Afula",
  kiryat_shmona: "Kiryat Shmona", dimona: "Dimona", bat_yam: "Bat Yam",
  holon: "Holon", bnei_brak: "Bnei Brak", lod: "Lod", ramla: "Ramla",
  beit_shemesh: "Beit Shemesh", hadera: "Hadera", nes_ziona: "Nes Ziona",
  ramat_gan: "Ramat Gan", kiryat_gat: "Kiryat Gat", tzfat: "Safed (Tzfat)",
  rosh_hayin: "Rosh HaAyin", hod_hasharon: "Hod HaSharon", ramat_hasharon: "Ramat HaSharon",
  yavne: "Yavne", kiryat_ata: "Kiryat Ata", bet_shean: "Beit She'an",
  sderot: "Sderot", arad: "Arad",
};

type EditableRow = RoutePrice & { dirty?: boolean; saving?: boolean; saved?: boolean };

export default function AdminPrices() {
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [addFrom, setAddFrom] = useState<CityKey>("ben_gurion");
  const [addTo, setAddTo] = useState<CityKey>("tel_aviv");

  useEffect(() => { fetchPrices(); }, []);

  async function fetchPrices() {
    setLoading(true);
    const { data } = await supabase
      .from("route_prices")
      .select("*")
      .order("from_city")
      .order("to_city");
    setRows((data as EditableRow[]) || []);
    setLoading(false);
  }

  function updateCell(id: string, field: keyof RoutePrice, raw: string) {
    const value = parseInt(raw) || 0;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value, dirty: true, saved: false } : r))
    );
  }

  async function saveRow(row: EditableRow) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, saving: true } : r)));
    await supabase
      .from("route_prices")
      .update({
        car4_day: row.car4_day,
        car4_night: row.car4_night,
        car6_day: row.car6_day,
        car6_night: row.car6_night,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    setRows((prev) =>
      prev.map((r) => r.id === row.id ? { ...r, saving: false, dirty: false, saved: true } : r)
    );
    setTimeout(() => {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, saved: false } : r)));
    }, 2000);
  }

  async function deleteRow(id: string) {
    if (!confirm("Supprimer ce trajet ?")) return;
    await supabase.from("route_prices").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function addRow() {
    if (addFrom === addTo) return alert("Départ et arrivée identiques");
    const exists = rows.find(
      (r) =>
        (r.from_city === addFrom && r.to_city === addTo) ||
        (r.from_city === addTo && r.to_city === addFrom)
    );
    if (exists) return alert("Ce trajet existe déjà");
    const insert: RoutePriceInsert = {
      from_city: addFrom, to_city: addTo,
      car4_day: 0, car4_night: 0, car6_day: 0, car6_night: 0,
    };
    const { data } = await supabase.from("route_prices").insert(insert).select().single();
    if (data) setRows((prev) => [...prev, data as EditableRow]);
  }

  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const q = norm(search);
  const filtered = rows.filter((r) => {
    const fromLabel = norm(CITY_LABELS[r.from_city as CityKey] || r.from_city);
    const toLabel   = norm(CITY_LABELS[r.to_city   as CityKey] || r.to_city);
    const fromKey   = r.from_city.replace(/_/g, " ");
    const toKey     = r.to_city.replace(/_/g, " ");
    return fromLabel.includes(q) || toLabel.includes(q) || fromKey.includes(q) || toKey.includes(q);
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Tarifs</h1>
          <p className="text-gray-400 text-sm">
            {filtered.length} trajet{filtered.length !== 1 ? "s" : ""}
            {search ? ` trouvé${filtered.length !== 1 ? "s" : ""} pour « ${search} »` : " configurés"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Rechercher une ville…"
              className="pl-8 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] w-52 shadow-sm"
            />
          </div>
          <button
            onClick={fetchPrices}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Add route */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">De</label>
          <select
            value={addFrom}
            onChange={(e) => setAddFrom(e.target.value as CityKey)}
            className="border border-gray-200 bg-slate-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
          >
            {CITIES.map((c) => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Vers</label>
          <select
            value={addTo}
            onChange={(e) => setAddTo(e.target.value as CityKey)}
            className="border border-gray-200 bg-slate-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
          >
            {CITIES.map((c) => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
          </select>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a3c6e] text-white text-sm font-bold rounded-xl hover:bg-[#112a50] transition-colors shadow-sm"
        >
          <Plus size={15} />
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-300">
            <Loader2 size={24} className="animate-spin mx-auto mb-3" />
            <p className="text-sm">Chargement…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">De</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vers</th>
                  <th className="py-3 text-center bg-blue-50/60">
                    <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider">4 places</div>
                    <div className="flex justify-center gap-8 mt-1 text-xs text-gray-400">
                      <span>Jour</span>
                      <span>Nuit</span>
                    </div>
                  </th>
                  <th className="py-3 text-center bg-violet-50/60">
                    <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider">6 places</div>
                    <div className="flex justify-center gap-8 mt-1 text-xs text-gray-400">
                      <span>Jour</span>
                      <span>Nuit</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((row) => (
                  <tr key={row.id} className={row.dirty ? "bg-amber-50/60" : "hover:bg-slate-50/70 transition-colors"}>
                    <td className="px-4 py-2.5 font-medium text-gray-800">
                      {CITY_LABELS[row.from_city as CityKey] || row.from_city}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {CITY_LABELS[row.to_city as CityKey] || row.to_city}
                    </td>
                    <td className="px-3 py-2.5 bg-blue-50/30">
                      <div className="flex gap-2 justify-center">
                        <PriceInput value={row.car4_day} onChange={(v) => updateCell(row.id, "car4_day", v)} />
                        <PriceInput value={row.car4_night} onChange={(v) => updateCell(row.id, "car4_night", v)} night />
                      </div>
                    </td>
                    <td className="px-3 py-2.5 bg-violet-50/30">
                      <div className="flex gap-2 justify-center">
                        <PriceInput value={row.car6_day} onChange={(v) => updateCell(row.id, "car6_day", v)} />
                        <PriceInput value={row.car6_night} onChange={(v) => updateCell(row.id, "car6_night", v)} night />
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {row.saved ? (
                          <CheckCircle size={16} className="text-emerald-500" />
                        ) : (
                          <button
                            onClick={() => saveRow(row)}
                            disabled={!row.dirty || row.saving}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed bg-[#1a3c6e] text-white hover:bg-[#112a50]"
                          >
                            {row.saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                            Enregistrer
                          </button>
                        )}
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="p-1.5 text-gray-200 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-300">
                      <Plus size={24} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">{search ? `Aucun trajet trouvé pour « ${search} »` : "Aucun trajet. Ajoutez-en un ci-dessus."}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} sur {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(0)}
                disabled={currentPage === 0}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >«</button>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
                    i === currentPage
                      ? "bg-[#1a3c6e] text-white border-[#1a3c6e]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >{i + 1}</button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >›</button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceInput({ value, onChange, night }: { value: number; onChange: (v: string) => void; night?: boolean }) {
  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none">₪</span>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-20 pl-5 pr-1 py-1.5 border rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] transition-colors ${
          night ? "border-slate-200 bg-slate-50 text-slate-500" : "border-gray-200 bg-white text-gray-800"
        }`}
        min={0}
        placeholder="0"
      />
    </div>
  );
}
