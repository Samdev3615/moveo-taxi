"use client";

import { useEffect, useState } from "react";
import { FileText, TrendingUp, Search, Users, RefreshCw, Eye, CheckCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

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

const FLAG: Record<string, string> = { he: "🇮🇱", en: "🇬🇧", fr: "🇫🇷", ru: "🇷🇺", es: "🇪🇸", hébreu: "🇮🇱", anglais: "🇬🇧", français: "🇫🇷", russe: "🇷🇺", espagnol: "🇪🇸" };

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const IMPACT_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

// ─── Rendu spécifique par agent ───────────────────────────────────────────────

function CompetitorDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  const competitors = (c.competitors ?? []) as Record<string, unknown>[];
  const opportunites = (c.opportunites ?? []) as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      {/* Recommandation principale */}
      {c.recommandation && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Recommandation principale</p>
          <p className="text-sm text-slate-800">{c.recommandation as string}</p>
          {c.langue_moins_competitive && (
            <p className="mt-2 text-xs text-orange-700">
              Langue la moins concurrentielle : <strong>{FLAG[c.langue_moins_competitive as string]} {c.langue_moins_competitive as string}</strong>
            </p>
          )}
        </div>
      )}

      {/* Opportunités */}
      {opportunites.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Opportunités par langue</h3>
          <div className="space-y-2">
            {opportunites.map((o, i) => (
              <div key={i} className="flex gap-3 items-start bg-white border border-slate-100 rounded-lg p-3">
                <span className="text-lg flex-shrink-0">{FLAG[o.langue as string] ?? "🌐"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700">{o.action as string}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${PRIORITY_COLORS[o.priorite as string] ?? ""}`}>
                  {o.priorite as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concurrents */}
      {competitors.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">{competitors.length} concurrents identifiés</h3>
          <div className="grid grid-cols-1 gap-2">
            {competitors.map((comp, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="font-semibold text-sm text-slate-800">{comp.name as string}</span>
                    <span className="ml-2 text-xs text-slate-400">{comp.url as string}</span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-shrink-0">{comp.type as string}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {((comp.langues ?? []) as string[]).map((l) => (
                    <span key={l} className="text-sm">{FLAG[l] ?? l}</span>
                  ))}
                </div>
                {comp.force && <p className="text-xs text-slate-600"><span className="font-medium">Force :</span> {comp.force as string}</p>}
                {((comp.mots_cles ?? []) as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {((comp.mots_cles) as string[]).map((k) => (
                      <span key={k} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{k}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KeywordsDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;

  type KW = { keyword: string; locale?: string; volume?: string; competition?: string; opportunity?: string; content_angle?: string; difficulty?: string; transliteration?: string; intent?: string };
  const highIntent = (c.high_intent ?? []) as KW[];
  const informational = (c.informational ?? []) as KW[];
  const longTail = (c.long_tail ?? []) as KW[];
  const hebrew = (c.hebrew_specific ?? []) as KW[];
  const top5 = (c.top_5_priority ?? []) as string[];
  const gaps = (c.gaps_identifies ?? []) as string[];

  return (
    <div className="space-y-5">
      {c.insight && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Insight stratégique</p>
          <p className="text-sm text-slate-800">{c.insight as string}</p>
        </div>
      )}

      {top5.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Top 5 priorités</h3>
          <div className="flex flex-wrap gap-2">
            {top5.map((k, i) => (
              <span key={i} className="text-sm font-semibold bg-green-600 text-white px-3 py-1 rounded-full">#{i + 1} {k}</span>
            ))}
          </div>
        </div>
      )}

      {highIntent.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Intention d'achat ({highIntent.length})</h3>
          <div className="space-y-1">
            {highIntent.map((k, i) => (
              <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
                <span>{FLAG[k.locale ?? ""] ?? "🌐"}</span>
                <span className="font-semibold text-slate-800 flex-shrink-0">{k.keyword}</span>
                {k.volume && <span className={`px-1.5 py-0.5 rounded text-xs ${k.volume === "high" ? "bg-red-100 text-red-600" : k.volume === "medium" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}>vol. {k.volume}</span>}
                {k.opportunity && <span className="text-slate-500 flex-1">{k.opportunity}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {informational.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Informationnels ({informational.length})</h3>
          <div className="space-y-1">
            {informational.map((k, i) => (
              <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
                <span>{FLAG[k.locale ?? ""] ?? "🌐"}</span>
                <span className="font-semibold text-slate-800 flex-shrink-0">{k.keyword}</span>
                {k.content_angle && <span className="text-slate-500 flex-1">{k.content_angle}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {longTail.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Long tail ({longTail.length})</h3>
          <div className="flex flex-wrap gap-2">
            {longTail.map((k, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-lg">
                {FLAG[k.locale ?? ""] ?? "🌐"} {k.keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {hebrew.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Hébreu spécifique 🇮🇱</h3>
          <div className="space-y-1">
            {hebrew.map((k, i) => (
              <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
                <span className="font-semibold text-slate-800" dir="rtl">{k.keyword}</span>
                {k.transliteration && <span className="text-slate-400 italic">{k.transliteration}</span>}
                {k.intent && <span className="text-slate-500 flex-1">{k.intent}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Lacunes de contenu identifiées</h3>
          <ul className="space-y-1">
            {gaps.map((g, i) => <li key={i} className="text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">⚠ {g}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function AuditorDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  type Issue = { issue?: string; action?: string; page?: string; fix?: string; effort?: string; impact?: string; expected_result?: string };
  const criticals = (c.critical_issues ?? []) as Issue[];
  const quickWins = (c.quick_wins ?? []) as Issue[];
  const longTerm = (c.long_term ?? []) as Issue[];
  const score = c.score as { current?: number; potential?: number; main_blocker?: string } | undefined;

  return (
    <div className="space-y-5">
      {score && (
        <div className="flex gap-4">
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-purple-700">{score.current ?? "?"}<span className="text-lg">/100</span></p>
            <p className="text-xs text-purple-500 mt-1">Score actuel</p>
          </div>
          <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-700">{score.potential ?? "?"}<span className="text-lg">/100</span></p>
            <p className="text-xs text-green-500 mt-1">Potentiel</p>
          </div>
        </div>
      )}

      {score?.main_blocker && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Principal bloquant</p>
          <p className="text-sm text-slate-800">{score.main_blocker}</p>
        </div>
      )}

      {c.visibilite_actuelle && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Visibilité actuelle</p>
          <p className="text-sm text-slate-700">{c.visibilite_actuelle as string}</p>
        </div>
      )}

      {criticals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-red-600 mb-2">Problèmes critiques ({criticals.length})</h3>
          <div className="space-y-2">
            {criticals.map((issue, i) => (
              <div key={i} className="bg-white border border-red-100 rounded-lg p-3">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="text-xs font-semibold text-slate-800">{issue.issue}</p>
                  {issue.impact && <span className={`text-xs px-2 py-0.5 rounded-full ${IMPACT_COLORS[issue.impact] ?? ""}`}>{issue.impact}</span>}
                </div>
                {issue.page && <p className="text-xs text-slate-400 mb-1">Page : {issue.page}</p>}
                {issue.fix && <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">Fix : {issue.fix}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {quickWins.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-green-700 mb-2">Gains rapides ({quickWins.length})</h3>
          <div className="space-y-2">
            {quickWins.map((w, i) => (
              <div key={i} className="bg-white border border-green-100 rounded-lg p-3 flex gap-3 items-start">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono flex-shrink-0">{w.effort}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800">{w.action}</p>
                  {w.reason && <p className="text-xs text-slate-500 mt-0.5">{w.reason}</p>}
                </div>
                {w.impact && <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${IMPACT_COLORS[w.impact] ?? ""}`}>{w.impact}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {longTerm.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">Long terme ({longTerm.length})</h3>
          <div className="space-y-1">
            {longTerm.map((l, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-lg p-3 flex gap-3 items-start">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono flex-shrink-0">{l.effort}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{l.action}</p>
                  {l.expected_result && <p className="text-xs text-slate-500 mt-0.5">{l.expected_result}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportDetail({ report }: { report: Report }) {
  if (report.agent === "competitor") return <CompetitorDetail c={report.content} />;
  if (report.agent === "keywords") return <KeywordsDetail c={report.content} />;
  if (report.agent === "auditor") return <AuditorDetail c={report.content} />;
  return <pre className="text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(report.content, null, 2)}</pre>;
}

// ─── Page principale ──────────────────────────────────────────────────────────

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
  const goodReports = reports.filter((r) => !(r.content as Record<string, unknown>)?.error);

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
            disabled={triggering === agent || pendingRefresh === agent}
            className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 hover:shadow-sm transition-all disabled:opacity-50"
          >
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${AGENT_COLORS[agent]}`}>
              {AGENT_ICONS[agent]} {AGENT_LABELS[agent]}
            </span>
            <span className="text-xs text-slate-500">
              {triggering === agent ? "Lancement…" : pendingRefresh === agent ? "En cours… (~60s)" : "Lancer maintenant"}
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
          {goodReports.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aucun rapport. Lance un agent pour démarrer.</p>
            </div>
          ) : goodReports.map((r) => (
            <div key={r.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${r.status === "unread" ? "border-blue-200 shadow-sm" : "border-slate-100"}`}>
              <div className="flex items-start gap-4 p-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${AGENT_COLORS[r.agent]}`}>
                  {AGENT_ICONS[r.agent]} {AGENT_LABELS[r.agent]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                  {r.summary && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{r.summary}</p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {expanded === r.id ? <ChevronUp size={12} /> : <Eye size={12} />}
                    {expanded === r.id ? "Fermer" : "Détail"}
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
                  <ReportDetail report={r} />
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
