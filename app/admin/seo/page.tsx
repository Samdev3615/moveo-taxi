"use client";

import { useEffect, useState } from "react";
import { FileText, TrendingUp, Search, Users, RefreshCw, Eye, CheckCircle, BookOpen } from "lucide-react";

type Report = {
  id: string;
  agent: "competitor" | "auditor" | "keywords" | "writer";
  title: string;
  summary: string;
  content: Record<string, unknown>;
  status: "unread" | "read";
  created_at: string;
};

type BlogPost = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  topic: string;
  status: "draft" | "published" | "archived";
  created_at: string;
};

const AGENT_ICONS: Record<string, React.ReactNode> = {
  writer: <FileText size={16} />,
  competitor: <Users size={16} />,
  auditor: <TrendingUp size={16} />,
  keywords: <Search size={16} />,
};

const AGENT_COLORS: Record<string, string> = {
  writer: "bg-blue-100 text-blue-700",
  competitor: "bg-orange-100 text-orange-700",
  auditor: "bg-purple-100 text-purple-700",
  keywords: "bg-green-100 text-green-700",
};

const AGENT_LABELS: Record<string, string> = {
  writer: "Rédacteur",
  competitor: "Concurrent",
  auditor: "Auditeur",
  keywords: "Mots-clés",
};

const FLAG: Record<string, string> = { he: "🇮🇱", en: "🇬🇧", fr: "🇫🇷", ru: "🇷🇺", es: "🇪🇸" };

export default function AdminSeoPage() {
  const [tab, setTab] = useState<"reports" | "posts">("reports");
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [pendingRefresh, setPendingRefresh] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [r, p] = await Promise.all([
      fetch("/api/admin/seo-data?type=reports").then((x) => x.json()),
      fetch("/api/admin/seo-data?type=posts").then((x) => x.json()),
    ]);
    setReports(r.data ?? []);
    setPosts(p.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function triggerAgent(agent: string) {
    setTriggering(agent);
    await fetch(`/api/admin/trigger-agent?agent=${agent}`, { method: "POST" });
    setTriggering(null);
    // L'agent tourne en arrière-plan — auto-refresh après 45s
    setPendingRefresh(agent);
    setTimeout(async () => {
      await load();
      setPendingRefresh(null);
    }, 90000);
  }

  async function markRead(id: string) {
    await fetch(`/api/admin/seo-data?type=mark-read&id=${id}`, { method: "POST" });
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "read" } : r));
  }

  async function updatePostStatus(id: string, status: "published" | "archived") {
    await fetch(`/api/admin/seo-data?type=post-status&id=${id}&status=${status}`, { method: "POST" });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  const unreadCount = reports.filter((r) => r.status === "unread").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Agence SEO IA</h1>
          <p className="text-slate-500 text-sm mt-1">Agents autonomes — analyses et contenu générés par Claude</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* Trigger buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {["writer", "competitor", "auditor", "keywords"].map((agent) => (
          <button
            key={agent}
            onClick={() => triggerAgent(agent)}
            disabled={triggering === agent}
            className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all disabled:opacity-50"
          >
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${AGENT_COLORS[agent]}`}>
              {AGENT_ICONS[agent]} {AGENT_LABELS[agent]}
            </span>
            <span className="text-xs text-slate-500">
              {triggering === agent
                ? "Lancement…"
                : pendingRefresh === agent
                ? "En génération… (~60s)"
                : "Lancer maintenant"}
            </span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setTab("reports")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reports" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          Rapports {unreadCount > 0 && <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </button>
        <button
          onClick={() => setTab("posts")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "posts" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          Articles {draftCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{draftCount}</span>}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Chargement…</div>
      ) : tab === "reports" ? (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aucun rapport. Lance un agent pour démarrer.</p>
            </div>
          ) : reports.map((r) => (
            <div key={r.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${r.status === "unread" ? "border-blue-200 shadow-sm" : "border-slate-100"}`}>
              <div className="flex items-start gap-4 p-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${AGENT_COLORS[r.agent]}`}>
                  {AGENT_ICONS[r.agent]} {AGENT_LABELS[r.agent]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                  {r.summary && <p className="text-xs text-slate-500 mt-0.5">{r.summary}</p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
                    <Eye size={12} /> Détail
                  </button>
                  {r.status === "unread" && (
                    <button onClick={() => markRead(r.id)} className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1">
                      <CheckCircle size={12} /> Lu
                    </button>
                  )}
                </div>
              </div>
              {expanded === r.id && (
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                  <pre className="text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(r.content, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aucun article. Lance l&apos;agent Rédacteur.</p>
            </div>
          ) : posts.map((p) => (
            <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
              <span className="text-xl">{FLAG[p.locale] ?? "🌐"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{p.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.slug} · {new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === "published" ? "bg-green-100 text-green-700" :
                  p.status === "draft" ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-500"
                }`}>{p.status}</span>
                {p.status === "draft" && (
                  <button onClick={() => updatePostStatus(p.id, "published")} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                    Publier
                  </button>
                )}
                {p.status !== "archived" && (
                  <button onClick={() => updatePostStatus(p.id, "archived")} className="text-xs text-slate-400 hover:text-slate-700 transition-colors">
                    Archiver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
