"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Download, CheckCircle, XCircle, Clock, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/supabase";

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "ממתין",
  confirmed: "מאושר",
  completed: "הושלם",
  cancelled: "בוטל",
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "moveo2024";

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/bookings" : `/api/bookings?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (authed) fetchBookings();
  }, [authed, fetchBookings]);

  async function updateStatus(id: string, status: BookingStatus) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  }

  function exportCSV() {
    const headers = ["ID", "Date", "From", "To", "Type", "Name", "Phone", "Passengers", "Vehicle", "Price", "Status"];
    const rows = bookings.map((b) => [
      b.id.slice(0, 8),
      `${b.date} ${b.time}`,
      b.from_city,
      b.to_city,
      b.trip_type,
      b.name,
      b.phone,
      b.passengers,
      b.vehicle_type,
      b.price_estimate || "",
      b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-4xl">🚕</span>
            <h1 className="text-xl font-bold text-[#1a3c6e] mt-2">Moveo Taxi Admin</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && password === ADMIN_PASS && setAuthed(true)}
            placeholder="סיסמה"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]"
          />
          <button
            onClick={() => password === ADMIN_PASS && setAuthed(true)}
            className="w-full bg-[#1a3c6e] text-white font-bold py-3 rounded-xl hover:bg-[#112a50] transition-colors"
          >
            כניסה
          </button>
          {password && password !== ADMIN_PASS && (
            <p className="text-red-500 text-sm text-center mt-2">סיסמה שגויה</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚕</span>
            <div>
              <h1 className="text-xl font-bold text-[#1a3c6e]">לוח ניהול</h1>
              <p className="text-gray-500 text-sm">{bookings.length} הזמנות</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 bg-white rounded-xl text-sm hover:bg-gray-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              רענן
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3c6e] text-white rounded-xl text-sm hover:bg-[#112a50]"
            >
              <Download size={14} />
              CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(["all", "pending", "confirmed", "completed"] as const).map((s) => {
            const count = s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "bg-white rounded-2xl p-4 text-center shadow-sm border-2 transition-colors",
                  filter === s ? "border-[#1a3c6e]" : "border-transparent"
                )}
              >
                <div className="text-2xl font-bold text-[#1a3c6e]">{count}</div>
                <div className="text-xs text-gray-500">
                  {s === "all" ? "הכל" : STATUS_LABELS[s as BookingStatus]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">טוען...</div>
          ) : bookings.length === 0 ? (
            <div className="p-10 text-center text-gray-400">אין הזמנות</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-start">מספר</th>
                    <th className="px-4 py-3 text-start">תאריך</th>
                    <th className="px-4 py-3 text-start">מסלול</th>
                    <th className="px-4 py-3 text-start">לקוח</th>
                    <th className="px-4 py-3 text-start">טלפון</th>
                    <th className="px-4 py-3 text-start">מחיר</th>
                    <th className="px-4 py-3 text-start">סטטוס</th>
                    <th className="px-4 py-3 text-start">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">
                        {b.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>{b.date}</div>
                        <div className="text-gray-400 text-xs">{b.time}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {b.trip_type === "airport" ? (
                            <span title="airport">✈️</span>
                          ) : (
                            <Car size={14} className="text-gray-400" />
                          )}
                          <span>{b.from_city} → {b.to_city}</span>
                        </div>
                        <div className="text-xs text-gray-400">{b.passengers} נוסעים • {b.vehicle_type}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${b.phone}`} className="text-[#1a3c6e] hover:underline" dir="ltr">
                          {b.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1a3c6e]">
                        {b.price_estimate ? `${b.price_estimate} ₪` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium", STATUS_COLORS[b.status])}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, "confirmed")}
                                className="p-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                                title="אשר"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "cancelled")}
                                className="p-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                                title="בטל"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(b.id, "completed")}
                              className="p-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                              title="הושלם"
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
    </div>
  );
}
