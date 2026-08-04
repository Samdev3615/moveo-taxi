"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap } from "lucide-react";

type GscRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };
type ScorePoint = { date: string; score: number | null; potential: number | null };

type Analytics = {
  ga4: {
    overview7d: { sessions: number; users: number; pageviews: number; bounceRate: number; avgDurationSec: number } | null;
    overview30d: { sessions: number; users: number; pageviews: number; bounceRate: number; avgDurationSec: number } | null;
    daily: { date: string; sessions: number }[];
    topPages: { path: string; sessions: number; bounceRate: number }[];
    sources: { channel: string; sessions: number }[];
  };
  gsc: { queries: GscRow[]; pages: GscRow[] };
  seo: { scoreHistory: ScorePoint[]; latestOrchestrator: Record<string, unknown> | null };
};

const SOURCE_COLORS: Record<string, string> = {
  "Direct":         "#0f2445",
  "Organic Search": "#16A34A",
  "AI Assistant":   "#8B5CF6",
  "Unassigned":     "#94A3B8",
};
const SOURCE_FALLBACK = "#CBD5E1";

function fmtDate(d: string) {
  if (d.length === 8) return `${d.slice(6)}/${d.slice(4, 6)}`;
  return d.slice(5);
}

function fmtDur(sec: number) {
  return `${Math.floor(sec / 60)}m${sec % 60}s`;
}

function KpiCard({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: "up" | "down" | "neutral" }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-slate-400";
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black text-slate-900 leading-none">{value}</span>
        {trend && <Icon size={16} className={`${color} mb-0.5`} />}
      </div>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">{children}</h3>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/seo-analytics")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Erreur de chargement"); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-[#16A34A] rounded-full animate-spin" />
      <span className="text-sm">Chargement des données GA4 + GSC…</span>
    </div>
  );

  if (error || !data) return (
    <div className="text-center py-16 text-slate-400 text-sm">{error ?? "Aucune donnée"}</div>
  );

  const { ga4, gsc, seo } = data;
  const ov7 = ga4.overview7d;
  const ov30 = ga4.overview30d;
  const totalSrc = ga4.sources.reduce((s, r) => s + r.sessions, 0) || 1;
  const latestScore = seo.scoreHistory.at(-1);
  const orch = seo.latestOrchestrator;

  // Bounce rate trend: 7j vs 30j
  const bounceTrend = ov7 && ov30
    ? (ov7.bounceRate > ov30.bounceRate ? "down" : ov7.bounceRate < ov30.bounceRate ? "up" : "neutral")
    : "neutral";

  return (
    <div className="space-y-8">

      {/* ── KPIs 7 jours ─────────────────────────────────────────── */}
      <div>
        <SectionTitle>Trafic — 7 derniers jours</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Sessions" value={ov7?.sessions ?? "—"} sub={ov30 ? `${ov30.sessions} sur 30j` : undefined} trend="neutral" />
          <KpiCard label="Utilisateurs" value={ov7?.users ?? "—"} sub={ov30 ? `${ov30.users} sur 30j` : undefined} trend="neutral" />
          <KpiCard
            label="Taux de rebond"
            value={ov7 ? `${ov7.bounceRate}%` : "—"}
            sub={ov30 ? `${ov30.bounceRate}% sur 30j` : undefined}
            trend={bounceTrend === "up" ? "down" : bounceTrend === "down" ? "up" : "neutral"}
          />
          <KpiCard
            label="Score SEO"
            value={latestScore ? `${latestScore.score}/100` : "—"}
            sub={latestScore ? `Potentiel : ${latestScore.potential}/100` : "Lance l'auditeur"}
            trend={latestScore && latestScore.score && latestScore.score > 40 ? "up" : "down"}
          />
        </div>
      </div>

      {/* ── Sessions 30j + Sources ───────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Sessions — 30 jours</SectionTitle>
          {ga4.daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ga4.daily} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  labelFormatter={(l: unknown) => fmtDate(String(l))}
                  formatter={(v: unknown) => [`${v} sessions`, ""]}
                />
                <Area type="monotone" dataKey="sessions" stroke="#16A34A" strokeWidth={2} fill="url(#sessGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-300 text-sm">Pas de données journalières</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Sources de trafic (7j)</SectionTitle>
          {ga4.sources.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={ga4.sources} dataKey="sessions" nameKey="channel" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2}>
                    {ga4.sources.map((s, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[s.channel] ?? SOURCE_FALLBACK} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: unknown) => [`${v} sessions`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {ga4.sources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SOURCE_COLORS[s.channel] ?? SOURCE_FALLBACK }} />
                      <span className="text-slate-600">{s.channel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{s.sessions}</span>
                      <span className="text-slate-400">{Math.round((s.sessions / totalSrc) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-300 text-sm">Pas de données</div>
          )}
        </div>
      </div>

      {/* ── Top pages + GSC ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Pages les + visitées (7j)</SectionTitle>
          {ga4.topPages.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ga4.topPages.slice(0, 7)} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="path"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  formatter={(v: unknown) => [`${v} sessions`, "Sessions"]}
                />
                <Bar dataKey="sessions" fill="#16A34A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-300 text-sm">Pas de données</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Requêtes Google (30j)</SectionTitle>
          {gsc.queries.length > 0 ? (
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="text-left pb-2 font-medium">Requête</th>
                    <th className="text-right pb-2 font-medium">Pos.</th>
                    <th className="text-right pb-2 font-medium">Clics</th>
                    <th className="text-right pb-2 font-medium">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {gsc.queries.slice(0, 10).map((r, i) => {
                    const pos = r.position ?? 0;
                    const posColor = pos <= 10 ? "text-green-600 font-semibold" : pos <= 30 ? "text-amber-600" : "text-slate-400";
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-1.5 pr-3 text-slate-700 truncate max-w-[160px]">{r.keys?.[0] ?? ""}</td>
                        <td className={`py-1.5 text-right tabular-nums ${posColor}`}>{pos.toFixed(0)}</td>
                        <td className="py-1.5 text-right tabular-nums text-slate-600">{r.clicks ?? 0}</td>
                        <td className="py-1.5 text-right tabular-nums text-slate-500">{(((r.ctr ?? 0) * 100)).toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-300 text-sm">GSC non connecté</div>
          )}
        </div>
      </div>

      {/* ── Score SEO historique + Alertes orchestrateur ─────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Score SEO — historique</SectionTitle>
          {seo.scoreHistory.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={seo.scoreHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="potential" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#potGrad)" dot={false} name="Potentiel" />
                <Area type="monotone" dataKey="score" stroke="#16A34A" strokeWidth={2} fill="url(#scoreGrad)" dot={{ r: 4, fill: "#16A34A" }} name="Score actuel" />
              </AreaChart>
            </ResponsiveContainer>
          ) : seo.scoreHistory.length === 1 ? (
            <div className="flex flex-col items-center justify-center h-36 gap-2">
              <div className="text-5xl font-black text-slate-900">{seo.scoreHistory[0].score}<span className="text-2xl text-slate-400">/100</span></div>
              <div className="text-sm text-slate-400">Potentiel : <span className="font-semibold text-blue-600">{seo.scoreHistory[0].potential}/100</span></div>
              <div className="text-xs text-slate-300">Lance l'auditeur à nouveau pour voir l'évolution</div>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-slate-300 text-sm">Lance l'agent Auditeur pour voir les scores</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Plan de la semaine</SectionTitle>
          {orch ? (
            <div className="space-y-3">
              {(orch.alerte as string | undefined) && (
                <div className="flex gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{orch.alerte as string}</p>
                </div>
              )}
              {(orch.opportunite_rapide as string | undefined) && (
                <div className="flex gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                  <Zap size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-green-700">{orch.opportunite_rapide as string}</p>
                </div>
              )}
              {Array.isArray(orch.priorites) && (orch.priorites as Record<string, unknown>[]).slice(0, 4).map((p, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{p.action as string}</p>
                    {(p.impact as string) && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.impact === "high" ? "bg-red-100 text-red-600" : p.impact === "medium" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                        {p.impact === "high" ? "Urgent" : p.impact === "medium" ? "Important" : "Faible"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-slate-300 text-sm">Lance l'Orchestrateur pour voir le plan</div>
          )}
        </div>
      </div>

      {/* ── Durée moyenne ─────────────────────────────────────────── */}
      {ov7 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <SectionTitle>Engagement détaillé (7j)</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-black text-slate-900">{fmtDur(ov7.avgDurationSec)}</div>
              <div className="text-xs text-slate-400 mt-1">Durée moyenne</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{ov7.pageviews}</div>
              <div className="text-xs text-slate-400 mt-1">Pages vues</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{ov7.sessions > 0 ? (ov7.pageviews / ov7.sessions).toFixed(1) : "—"}</div>
              <div className="text-xs text-slate-400 mt-1">Pages / session</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{ov7.sessions > 0 ? Math.round((ov7.users / ov7.sessions) * 100) : "—"}%</div>
              <div className="text-xs text-slate-400 mt-1">Nouveaux visiteurs</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
