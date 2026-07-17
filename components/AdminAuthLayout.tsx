"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Tag, LogOut, ExternalLink } from "lucide-react";

const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "moveo2024";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true);
    setReady(true);
  }, []);

  function login() {
    if (pw === PASS) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setPw("");
  }

  if (!ready) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-[#1a3c6e] rounded-2xl items-center justify-center mb-4 shadow-lg">
              <span className="text-xl font-black text-white">M</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Moveo Taxi</h1>
            <p className="text-gray-500 text-sm mt-1">Panneau d'administration</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="••••••••"
              autoFocus
              className={`w-full border rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] transition-colors ${
                error ? "border-red-400 bg-red-50 animate-pulse" : "border-gray-200 bg-gray-50"
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs text-center mb-3">Mot de passe incorrect</p>
            )}
            <button
              onClick={login}
              className="w-full bg-[#1a3c6e] text-white font-bold py-3 rounded-xl hover:bg-[#112a50] transition-colors text-sm tracking-wide"
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin/bookings", icon: LayoutDashboard, label: "Réservations" },
    { href: "/admin/prices", icon: Tag, label: "Tarifs" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-52 bg-[#0f2445] shrink-0 flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow">
              <span className="text-sm font-black text-[#1a3c6e]">M</span>
            </div>
            <div>
              <div className="font-black text-white text-sm leading-tight">Moveo Taxi</div>
              <div className="text-white/40 text-xs">Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 text-xs transition-colors w-full px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <ExternalLink size={13} />
            Voir le site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/40 hover:text-white/80 text-xs transition-colors w-full px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
