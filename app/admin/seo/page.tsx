"use client";

import { useEffect, useState } from "react";
import { FileText, TrendingUp, Search, Users, RefreshCw, Eye, CheckCircle, BookOpen, ChevronUp, Layers, RotateCcw, MessageSquare, X, Trash2 } from "lucide-react";

type Report = {
  id: string;
  agent: "competitor" | "auditor" | "keywords" | "writer" | "orchestrator";
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
  content: string;
  topic: string;
  status: "draft" | "published" | "archived";
  created_at: string;
};

type ChatMessage = {
  id: string;
  from: "writer" | "competitor" | "auditor" | "keywords" | "orchestrator";
  text: string;
};

const AGENT_ICONS: Record<string, React.ReactNode> = {
  writer: <FileText size={16} />,
  competitor: <Users size={16} />,
  auditor: <TrendingUp size={16} />,
  keywords: <Search size={16} />,
  orchestrator: <Layers size={16} />,
};

const AGENT_COLORS: Record<string, string> = {
  writer: "bg-blue-100 text-blue-700",
  competitor: "bg-orange-100 text-orange-700",
  auditor: "bg-purple-100 text-purple-700",
  keywords: "bg-green-100 text-green-700",
  orchestrator: "bg-indigo-100 text-indigo-700",
};

const AGENT_LABELS: Record<string, string> = {
  writer: "Rédacteur",
  competitor: "Concurrent",
  auditor: "Auditeur",
  keywords: "Mots-clés",
  orchestrator: "Orchestrateur",
};

const TEAM: Record<string, { name: string; role: string; avatar: string; color: string }> = {
  writer:       { name: "Sophie Laurent",  role: "Rédactrice SEO Multilingue",     avatar: "/images/team-sophie.png",   color: "border-blue-200" },
  competitor:   { name: "Alex Benhamou",   role: "Analyste Concurrentielle",        avatar: "/images/team-alex.png",     color: "border-orange-200" },
  auditor:      { name: "Maya Cohen",      role: "Auditrice SEO Technique",         avatar: "/images/team-maya.png",     color: "border-purple-200" },
  keywords:     { name: "Rafi Shapira",    role: "Expert Mots-clés & Tendances",   avatar: "/images/team-rafi.png",     color: "border-green-200" },
  orchestrator: { name: "David Levi",      role: "Orchestrateur Stratégique",       avatar: "/images/team-david.png",    color: "border-indigo-200" },
};

const FLAG: Record<string, string> = {
  he: "🇮🇱", en: "🇬🇧", fr: "🇫🇷", ru: "🇷🇺", es: "🇪🇸",
  hébreu: "🇮🇱", anglais: "🇬🇧", français: "🇫🇷", russe: "🇷🇺", espagnol: "🇪🇸",
};

const PRIORITY: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

function s(v: unknown): string { return typeof v === "string" ? v : ""; }
function a(v: unknown): unknown[] { return Array.isArray(v) ? v : []; }
function asStr(v: unknown): Record<string, string> { return (v && typeof v === "object") ? v as Record<string, string> : {}; }

// ── Construction de la conversation depuis les vrais rapports ─────────────────
function buildConversation(reports: Report[]): ChatMessage[] {
  const byAgent: Partial<Record<string, Report>> = {};
  for (const r of reports) {
    if (!byAgent[r.agent]) byAgent[r.agent] = r;
  }

  const messages: ChatMessage[] = [];
  const hasOrch = !!byAgent.orchestrator;

  // David ouvre
  if (hasOrch) {
    const c = byAgent.orchestrator!.content;
    messages.push({ id: "david-open", from: "orchestrator", text: `Bonjour l'équipe. Voici le bilan de la semaine.\n\n${s(c.synthese)}` });
  } else {
    messages.push({ id: "david-open", from: "orchestrator", text: "Bonjour l'équipe. Je collecte vos rapports pour préparer notre plan stratégique de la semaine." });
  }

  // Alex répond
  if (byAgent.competitor) {
    const c = byAgent.competitor.content;
    const nb = a(c.competitors).length;
    const langue = s(c.langue_moins_competitive) || s(c.langue_moins_concurrentielle);
    const reco = s(c.recommandation).slice(0, 140);
    let txt = nb > 0 ? `J'ai identifié ${nb} concurrents actifs en 5 langues.` : "J'ai analysé le marché concurrentiel.";
    if (langue) txt += ` Opportunité : marché ${langue} sous-exploité.`;
    if (reco) txt += `\n\n${reco}`;
    messages.push({ id: "alex", from: "competitor", text: txt });
  }

  // Rafi répond
  if (byAgent.keywords) {
    const c = byAgent.keywords.content;
    const insight = s(c.insight).slice(0, 160);
    const top5 = a(c.top_5_priority).map(s).slice(0, 3);
    let txt = insight || "J'ai analysé les opportunités de mots-clés.";
    if (top5.length > 0) txt += `\n\nTop priorités : ${top5.join(", ")}.`;
    messages.push({ id: "rafi", from: "keywords", text: txt });
  }

  // Maya répond
  if (byAgent.auditor) {
    const c = byAgent.auditor.content;
    const score = (c.score && typeof c.score === "object") ? c.score as Record<string, unknown> : {};
    const blocker = s(score.main_blocker).slice(0, 100);
    const qw = a(c.quick_wins).length;
    let txt = `Score SEO actuel : ${score.current ?? "?"}/100 — potentiel ${score.potential ?? "?"}/100.`;
    if (blocker) txt += `\n\nBloquant principal : ${blocker}`;
    if (qw > 0) txt += `\n${qw} gains rapides identifiés.`;
    messages.push({ id: "maya", from: "auditor", text: txt });
  }

  // Sophie répond
  if (byAgent.writer) {
    const c = byAgent.writer.content;
    const posts = a(c.posts).map(asStr);
    const titre = posts[0]?.title ?? s(c.topic);
    const nb = posts.length;
    let txt = titre ? `J'ai rédigé "${titre}"` : "J'ai rédigé un article cette semaine";
    if (nb > 0) txt += ` en ${nb} langue${nb > 1 ? "s" : ""}.`;
    txt += " Statut : brouillon, en attente de publication.";
    messages.push({ id: "sophie", from: "writer", text: txt });
  }

  // David conclut
  if (hasOrch) {
    const c = byAgent.orchestrator!.content;
    const prios = a(c.priorites).map(asStr).slice(0, 3);
    const alerte = s(c.alerte);
    let txt = "Merci à tous. Voici le plan de la semaine :";
    if (prios.length > 0) txt += "\n\n" + prios.map((p, i) => `${i + 1}. ${p.action}`).join("\n");
    if (alerte) txt += `\n\n⚠ Alerte : ${alerte}`;
    messages.push({ id: "david-close", from: "orchestrator", text: txt });
  } else {
    const hasAny = messages.length > 1;
    messages.push({
      id: "david-close",
      from: "orchestrator",
      text: hasAny
        ? "Merci à tous. Lance-moi pour que je synthétise tout ça en plan d'action stratégique."
        : "Lance les agents pour que je puisse coordonner leur travail.",
    });
  }

  return messages;
}

// ── Panel Chat ─────────────────────────────────────────────────────────────────
function ChatPanel({ reports, chatKey }: { reports: Report[]; chatKey: number }) {
  const messages = buildConversation(reports);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setShown(0);
    setTyping(false);
  }, [chatKey]);

  useEffect(() => {
    if (shown >= messages.length) return;
    setTyping(true);
    const delay = shown === 0 ? 600 : 1400;
    const t = setTimeout(() => {
      setTyping(false);
      setShown((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [shown, messages.length, chatKey]);

  const nextAgent = shown < messages.length ? messages[shown].from : null;

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <MessageSquare size={36} className="mb-3 opacity-30" />
        <p className="text-sm">Lance un agent pour démarrer la conversation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      {messages.slice(0, shown).map((m) => {
        const isOrch = m.from === "orchestrator";
        const member = TEAM[m.from];
        return (
          <div key={m.id} className={`flex gap-3 items-end ${isOrch ? "flex-row-reverse" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover object-top shrink-0 border border-slate-200" />
            <div className={`flex flex-col max-w-sm ${isOrch ? "items-end" : "items-start"}`}>
              <span className="text-xs text-slate-400 mb-1 px-1">{member.name}</span>
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${isOrch ? "bg-indigo-600 text-white rounded-br-none" : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"}`}>
                {m.text}
              </div>
            </div>
          </div>
        );
      })}

      {typing && nextAgent && (
        <div className={`flex gap-3 items-end ${nextAgent === "orchestrator" ? "flex-row-reverse" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TEAM[nextAgent].avatar} alt="" className="w-9 h-9 rounded-full object-cover object-top shrink-0 border border-slate-200" />
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${nextAgent === "orchestrator" ? "bg-indigo-100 rounded-br-none" : "bg-white border border-slate-100 rounded-bl-none"}`}>
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Concurrent ────────────────────────────────────────────────────────────────
function CompetitorDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  const recommandation = s(c.recommandation);
  const langueMoins = s(c.langue_moins_competitive) || s(c.langue_moins_concurrentielle);
  const competitors = a(c.competitors).map(asStr);
  const opportunites = a(c.opportunites).map(asStr);
  return (
    <div className="space-y-6">
      {!!recommandation && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Recommandation principale</p>
          <p className="text-sm text-slate-800">{recommandation}</p>
          {!!langueMoins && <p className="mt-2 text-xs text-orange-700">Langue la moins concurrentielle : <strong>{FLAG[langueMoins] ?? ""} {langueMoins}</strong></p>}
        </div>
      )}
      {opportunites.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Opportunités par langue</h3>
          <div className="space-y-2">
            {opportunites.map((o, i) => (
              <div key={i} className="flex gap-3 items-start bg-white border border-slate-100 rounded-lg p-3">
                <span className="text-lg flex-shrink-0">{FLAG[o.langue] ?? "🌐"}</span>
                <p className="text-xs text-slate-700 flex-1">{o.action}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${PRIORITY[o.priorite] ?? ""}`}>{o.priorite}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {competitors.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">{competitors.length} concurrents identifiés</h3>
          <div className="space-y-2">
            {competitors.map((comp, i) => {
              const raw = a((comp as unknown as Record<string, unknown>).langues ?? (comp as unknown as Record<string, unknown>).langues_presentes);
              const langues = raw.map((l) => s(l));
              const mots = a((comp as unknown as Record<string, unknown>).mots_cles ?? (comp as unknown as Record<string, unknown>).mots_cles_utilises ?? (comp as unknown as Record<string, unknown>).mots_cles_seo).map(s);
              return (
                <div key={i} className="bg-white border border-slate-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="font-semibold text-sm text-slate-800">{comp.name}</span>
                      <span className="ml-2 text-xs text-slate-400">{comp.url}</span>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-shrink-0">{comp.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">{langues.map((l) => <span key={l} title={l}>{FLAG[l] ?? l}</span>)}</div>
                  {!!comp.force && <p className="text-xs text-slate-600 mb-1"><span className="font-medium">Force :</span> {comp.force}</p>}
                  {mots.length > 0 && <div className="flex flex-wrap gap-1">{mots.map((k) => <span key={k} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{k}</span>)}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mots-clés ─────────────────────────────────────────────────────────────────
function KeywordsDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  const insight = s(c.insight);
  const top5 = a(c.top_5_priority).map(s);
  const highIntent = a(c.high_intent).map(asStr);
  const informational = a(c.informational).map(asStr);
  const longTail = a(c.long_tail).map(asStr);
  const hebrew = a(c.hebrew_specific).map(asStr);
  const gaps = a(c.gaps_identifies).map(s);
  return (
    <div className="space-y-5">
      {!!insight && <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Insight stratégique</p><p className="text-sm text-slate-800">{insight}</p></div>}
      {top5.length > 0 && <div><h3 className="text-sm font-bold text-slate-700 mb-2">Top 5 priorités</h3><div className="flex flex-wrap gap-2">{top5.map((k, i) => <span key={i} className="text-sm font-semibold bg-green-600 text-white px-3 py-1 rounded-full">#{i + 1} {k}</span>)}</div></div>}
      {highIntent.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Intention achat ({highIntent.length})</h3>
          <div className="space-y-1">{highIntent.map((k, i) => (
            <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
              <span>{FLAG[k.locale] ?? "🌐"}</span>
              <span className="font-semibold text-slate-800 shrink-0">{k.keyword}</span>
              {!!k.volume && <span className={`px-1.5 py-0.5 rounded ${k.volume === "high" ? "bg-red-100 text-red-600" : k.volume === "medium" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}>vol. {k.volume}</span>}
              {!!k.opportunity && <span className="text-slate-500 flex-1">{k.opportunity}</span>}
            </div>
          ))}</div>
        </div>
      )}
      {informational.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Informationnels ({informational.length})</h3>
          <div className="space-y-1">{informational.map((k, i) => (
            <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
              <span>{FLAG[k.locale] ?? "🌐"}</span>
              <span className="font-semibold text-slate-800 shrink-0">{k.keyword}</span>
              {!!k.content_angle && <span className="text-slate-500 flex-1">{k.content_angle}</span>}
            </div>
          ))}</div>
        </div>
      )}
      {longTail.length > 0 && <div><h3 className="text-sm font-bold text-slate-700 mb-2">Long tail ({longTail.length})</h3><div className="flex flex-wrap gap-2">{longTail.map((k, i) => <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-lg">{FLAG[k.locale] ?? "🌐"} {k.keyword}</span>)}</div></div>}
      {hebrew.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Hébreu 🇮🇱</h3>
          <div className="space-y-1">{hebrew.map((k, i) => (
            <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
              <span className="font-semibold text-slate-800" dir="rtl">{k.keyword}</span>
              {!!k.transliteration && <span className="text-slate-400 italic">{k.transliteration}</span>}
              {!!k.intent && <span className="text-slate-500 flex-1">{k.intent}</span>}
            </div>
          ))}</div>
        </div>
      )}
      {gaps.length > 0 && <div><h3 className="text-sm font-bold text-slate-700 mb-2">Lacunes de contenu</h3><ul className="space-y-1">{gaps.map((g, i) => <li key={i} className="text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">⚠ {g}</li>)}</ul></div>}
    </div>
  );
}

// ── Auditeur ──────────────────────────────────────────────────────────────────
function AuditorDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  const score = (c.score && typeof c.score === "object") ? c.score as Record<string, unknown> : {};
  const criticals = a(c.critical_issues).map(asStr);
  const quickWins = a(c.quick_wins).map(asStr);
  const longTerm = a(c.long_term).map(asStr);
  const visibilite = s(c.visibilite_actuelle);
  return (
    <div className="space-y-5">
      {(score.current != null || score.potential != null) && (
        <div className="flex gap-4">
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-purple-700">{String(score.current ?? "?")}<span className="text-lg">/100</span></p>
            <p className="text-xs text-purple-500 mt-1">Score actuel</p>
          </div>
          <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-700">{String(score.potential ?? "?")}<span className="text-lg">/100</span></p>
            <p className="text-xs text-green-500 mt-1">Potentiel</p>
          </div>
        </div>
      )}
      {!!s(score.main_blocker) && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Principal bloquant</p><p className="text-sm text-slate-800">{s(score.main_blocker)}</p></div>}
      {!!visibilite && <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Visibilité actuelle</p><p className="text-sm text-slate-700">{visibilite}</p></div>}
      {criticals.length > 0 && (
        <div><h3 className="text-sm font-bold text-red-600 mb-2">Problèmes critiques ({criticals.length})</h3>
          <div className="space-y-2">{criticals.map((issue, i) => (
            <div key={i} className="bg-white border border-red-100 rounded-lg p-3">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="text-xs font-semibold text-slate-800">{issue.issue}</p>
                {!!issue.impact && <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY[issue.impact] ?? ""}`}>{issue.impact}</span>}
              </div>
              {!!issue.page && <p className="text-xs text-slate-400 mb-1">Page : {issue.page}</p>}
              {!!issue.fix && <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">Fix : {issue.fix}</p>}
            </div>
          ))}</div>
        </div>
      )}
      {quickWins.length > 0 && (
        <div><h3 className="text-sm font-bold text-green-700 mb-2">Gains rapides ({quickWins.length})</h3>
          <div className="space-y-2">{quickWins.map((w, i) => (
            <div key={i} className="bg-white border border-green-100 rounded-lg p-3 flex gap-3 items-start">
              {!!w.effort && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono shrink-0">{w.effort}</span>}
              <div className="flex-1"><p className="text-xs font-semibold text-slate-800">{w.action}</p>{!!w.reason && <p className="text-xs text-slate-500 mt-0.5">{w.reason}</p>}</div>
              {!!w.impact && <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${PRIORITY[w.impact] ?? ""}`}>{w.impact}</span>}
            </div>
          ))}</div>
        </div>
      )}
      {longTerm.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Long terme ({longTerm.length})</h3>
          <div className="space-y-1">{longTerm.map((l, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-lg p-3 flex gap-3 items-start">
              {!!l.effort && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono shrink-0">{l.effort}</span>}
              <div><p className="text-xs font-semibold text-slate-800">{l.action}</p>{!!l.expected_result && <p className="text-xs text-slate-500 mt-0.5">{l.expected_result}</p>}</div>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

// ── Orchestrateur ─────────────────────────────────────────────────────────────
function OrchestratorDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  const synthese = s(c.synthese);
  const score = (c.score_global && typeof c.score_global === "object") ? c.score_global as Record<string, unknown> : {};
  const priorites = a(c.priorites).map(asStr);
  const motsCles = a(c.mots_cles_prioritaires).map(asStr);
  const opportunite = s(c.opportunite_rapide);
  const alerte = s(c.alerte);
  const plan = a(c.plan_30_jours).map(asStr);
  const aRelancer = a(c.agents_a_relancer).map(asStr);
  return (
    <div className="space-y-5">
      {!!synthese && <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4"><p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Synthèse exécutive</p><p className="text-sm text-slate-800">{synthese}</p></div>}
      {(score.actuel != null || score.potentiel != null) && (
        <div className="flex gap-4">
          <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-indigo-700">{String(score.actuel ?? "?")}<span className="text-lg">/100</span></p>
            <p className="text-xs text-indigo-500 mt-1">Score actuel</p>
          </div>
          <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-700">{String(score.potentiel ?? "?")}<span className="text-lg">/100</span></p>
            <p className="text-xs text-green-500 mt-1">Potentiel</p>
          </div>
        </div>
      )}
      {!!s(score.note) && <p className="text-xs text-slate-500 italic">{s(score.note)}</p>}
      {!!alerte && <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start"><span className="text-red-500 text-base shrink-0">⚠</span><div><p className="text-xs font-semibold text-red-600 mb-0.5">Alerte prioritaire</p><p className="text-xs text-slate-700">{alerte}</p></div></div>}
      {!!opportunite && <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex gap-2 items-start"><span className="text-green-600 text-base shrink-0">⚡</span><div><p className="text-xs font-semibold text-green-700 mb-0.5">Quick win</p><p className="text-xs text-slate-700">{opportunite}</p></div></div>}
      {priorites.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-3">Priorités de la semaine</h3>
          <div className="space-y-2">{priorites.map((p, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-lg p-3">
              <div className="flex gap-3 items-start">
                <span className="text-lg font-black text-indigo-300 leading-none shrink-0">#{p.rang ?? i + 1}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800 mb-1">{p.action}</p>
                  {!!p.pourquoi && <p className="text-xs text-slate-500 mb-1">{p.pourquoi}</p>}
                  <div className="flex gap-2 flex-wrap mt-1">
                    {!!p.agent_source && <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">via {p.agent_source}</span>}
                    {!!p.effort && <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{p.effort}</span>}
                    {!!p.impact && <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY[p.impact] ?? ""}`}>{p.impact}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}</div>
        </div>
      )}
      {motsCles.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Mots-clés prioritaires</h3>
          <div className="space-y-1">{motsCles.map((k, i) => (
            <div key={i} className="flex gap-2 items-start text-xs bg-white border border-slate-100 rounded-lg p-2">
              <span>{FLAG[k.locale] ?? "🌐"}</span>
              <span className="font-semibold text-slate-800 shrink-0">{k.keyword}</span>
              {!!k.raison && <span className="text-slate-500 flex-1">{k.raison}</span>}
            </div>
          ))}</div>
        </div>
      )}
      {plan.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Plan 30 jours</h3>
          <div className="space-y-1">{plan.map((w, i) => (
            <div key={i} className="flex gap-3 items-start text-xs bg-white border border-slate-100 rounded-lg p-3">
              <span className="font-black text-indigo-400 shrink-0">S{w.semaine ?? i + 1}</span>
              <p className="text-slate-700">{w.focus}</p>
            </div>
          ))}</div>
        </div>
      )}
      {aRelancer.length > 0 && (
        <div><h3 className="text-sm font-bold text-slate-700 mb-2">Agents à relancer</h3>
          <div className="flex flex-wrap gap-2">{aRelancer.map((ag, i) => (
            <div key={i} className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="font-semibold text-slate-700">{AGENT_LABELS[ag.agent] ?? ag.agent}</span>
              {!!ag.raison && <span className="text-slate-400 ml-1">— {ag.raison}</span>}
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

// ── Rédacteur ─────────────────────────────────────────────────────────────────
function WriterDetail({ c }: { c: Record<string, unknown> }) {
  if (c.error) return <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(c, null, 2)}</pre>;
  const topic = s(c.topic);
  const slug = s(c.slug);
  const posts = (Array.isArray(c.posts) ? c.posts : []) as Array<Record<string, string>>;
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Sujet de la semaine</p>
        <p className="text-sm font-semibold text-slate-800">{topic}</p>
        {!!slug && <p className="text-xs text-slate-400 mt-0.5 font-mono">/{slug}</p>}
      </div>
      {posts.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">
            {posts.length} article{posts.length > 1 ? "s" : ""} générés
          </h3>
          <div className="space-y-2">
            {posts.map((p, i) => (
              <div key={i} className="flex gap-3 items-center bg-white border border-slate-100 rounded-lg p-3">
                <span className="text-lg shrink-0">{FLAG[p.locale] ?? "🌐"}</span>
                <p className="text-xs font-semibold text-slate-800 flex-1 truncate">{p.title}</p>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">brouillon</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <BookOpen size={12} /> Publier depuis l&apos;onglet Articles
          </p>
        </div>
      )}
    </div>
  );
}

function ReportDetail({ report }: { report: Report }) {
  if (report.agent === "competitor") return <CompetitorDetail c={report.content} />;
  if (report.agent === "keywords") return <KeywordsDetail c={report.content} />;
  if (report.agent === "auditor") return <AuditorDetail c={report.content} />;
  if (report.agent === "orchestrator") return <OrchestratorDetail c={report.content} />;
  if (report.agent === "writer") return <WriterDetail c={report.content} />;
  return <pre className="text-xs text-slate-600 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(report.content, null, 2)}</pre>;
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function AdminSeoPage() {
  const [tab, setTab] = useState<"chat" | "reports" | "posts">("chat");
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chatKey, setChatKey] = useState(0);
  const [localeFilter, setLocaleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
    await load();
  }

  async function markRead(id: string) {
    await fetch(`/api/admin/seo-data?type=mark-read&id=${id}`, { method: "POST" });
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "read" } : r));
  }

  async function updatePostStatus(id: string, status: "published" | "archived") {
    await fetch(`/api/admin/seo-data?type=post-status&id=${id}&status=${status}`, { method: "POST" });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  async function deletePost(id: string) {
    await fetch(`/api/admin/seo-data?type=delete-post&id=${id}`, { method: "POST" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
    if (previewPost?.id === id) setPreviewPost(null);
  }

  const unreadCount = reports.filter((r) => r.status === "unread").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const goodReports = reports.filter((r) => !(r.content as Record<string, unknown>)?.error);
  const errorReports = reports.filter((r) => !!(r.content as Record<string, unknown>)?.error);
  const filteredPosts = posts
    .filter((p) => !localeFilter || p.locale === localeFilter)
    .filter((p) => statusFilter === "all" || p.status === statusFilter);

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

      {/* Cartes équipe */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {(["writer", "competitor", "auditor", "keywords", "orchestrator"] as const).map((agent) => {
          const member = TEAM[agent];
          const lastReport = goodReports.find((r) => r.agent === agent);
          const isActive = triggering === agent;
          return (
            <div key={agent} className={`bg-white border-2 ${member.color} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col`}>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.avatar} alt={member.name} className="w-full aspect-square object-cover object-top" />
                <span className={`absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${AGENT_COLORS[agent]}`}>
                  {AGENT_ICONS[agent]}
                </span>
                {lastReport && <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded-full">✓</span>}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="font-bold text-slate-900 text-sm leading-tight">{member.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-tight">{member.role}</p>
                <button
                  onClick={() => triggerAgent(agent)}
                  disabled={!!triggering}
                  className={`mt-auto pt-2 w-full text-xs font-semibold py-1.5 rounded-lg transition-all disabled:opacity-50 ${isActive ? "bg-slate-100 text-slate-500" : agent === "orchestrator" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-900 text-white hover:bg-slate-700"}`}
                >
                  {triggering === agent ? "En cours… (~2 min)" : "Lancer"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onglets */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        <button onClick={() => setTab("chat")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "chat" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
          Chat
        </button>
        <button onClick={() => setTab("reports")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "reports" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
          Rapports {goodReports.length > 0 && <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${unreadCount > 0 ? "bg-red-500 text-white" : "bg-slate-300 text-slate-700"}`}>{goodReports.length}</span>}
        </button>
        <button onClick={() => setTab("posts")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "posts" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
          Articles {draftCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{draftCount}</span>}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Chargement…</div>
      ) : tab === "chat" ? (
        <div className="bg-slate-50 rounded-2xl p-5 min-h-[400px]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">L&apos;équipe en réunion</p>
            <button
              onClick={() => setChatKey((k) => k + 1)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw size={12} /> Rejouer
            </button>
          </div>
          <ChatPanel reports={goodReports} chatKey={chatKey} />
        </div>
      ) : tab === "reports" ? (
        <div className="space-y-3">
          {goodReports.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aucun rapport. Lance un agent pour démarrer.</p>
            </div>
          ) : (
            <>
              {errorReports.length > 0 && (
                <div className="space-y-2 mb-4">
                  {errorReports.map((r) => {
                    const c = r.content as Record<string, unknown>;
                    const msg = String(c.message ?? c.body ?? c.summary ?? "Erreur inconnue").slice(0, 300);
                    return (
                      <div key={r.id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={TEAM[r.agent]?.avatar} alt={TEAM[r.agent]?.name} className="w-8 h-8 rounded-full object-cover object-top shrink-0 border border-red-200 opacity-70" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-red-700">{r.title}</p>
                          <p className="text-xs text-red-500 mt-1 font-mono break-all">{msg}</p>
                          <p className="text-xs text-red-300 mt-1">{TEAM[r.agent]?.name} · {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {goodReports.map((r) => (
                <div key={r.id} className={`bg-white border rounded-xl overflow-hidden ${r.status === "unread" ? "border-blue-200 shadow-sm" : "border-slate-100"}`}>
                  <div className="flex items-center gap-3 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={TEAM[r.agent]?.avatar} alt={TEAM[r.agent]?.name} className="w-10 h-10 rounded-full object-cover object-top shrink-0 border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm leading-tight">{r.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{TEAM[r.agent]?.name} · {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
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
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aucun article. Lance l&apos;agent Rédacteur.</p>
            </div>
          ) : (
            <>
              {/* Filtres */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex gap-1">
                  {[null, "he", "en", "fr", "ru", "es"].map((loc) => (
                    <button
                      key={loc ?? "all"}
                      onClick={() => setLocaleFilter(loc)}
                      className={`text-sm px-2.5 py-1 rounded-lg transition-all ${localeFilter === loc ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                    >
                      {loc ? (FLAG[loc] ?? loc) : "Tous"}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {(["all", "draft", "published", "archived"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-all ${statusFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                    >
                      {st === "all" ? "Tous" : st === "draft" ? "Brouillons" : st === "published" ? "Publiés" : "Archivés"}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 ml-auto">{filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Liste */}
              <div className="space-y-2">
                {filteredPosts.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">Aucun article pour ce filtre.</p>
                ) : filteredPosts.map((p) => (
                  <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{FLAG[p.locale] ?? "🌐"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm leading-tight">{p.title}</p>
                        {!!p.excerpt && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.excerpt}</p>}
                        <p className="text-xs text-slate-300 mt-1 font-mono">{p.slug} · {new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "published" ? "bg-green-100 text-green-700" : p.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                          {p.status === "published" ? "Publié" : p.status === "draft" ? "Brouillon" : "Archivé"}
                        </span>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => setPreviewPost(p)} className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors">Aperçu</button>
                          {p.status === "draft" && <button onClick={() => updatePostStatus(p.id, "published")} className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors">Publier</button>}
                          {p.status === "published" && <button onClick={() => updatePostStatus(p.id, "archived")} className="text-xs text-slate-400 hover:text-slate-700 transition-colors">Archiver</button>}
                          {confirmDelete === p.id ? (
                            <span className="flex gap-1 items-center">
                              <button onClick={() => deletePost(p.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-colors">Confirmer</button>
                              <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-400 hover:text-slate-700 transition-colors">Annuler</button>
                            </span>
                          ) : (
                            <button onClick={() => setConfirmDelete(p.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Supprimer">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal prévisualisation article */}
      {previewPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewPost(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0">{FLAG[previewPost.locale] ?? "🌐"}</span>
                <p className="font-bold text-slate-900 text-sm truncate">{previewPost.title}</p>
              </div>
              <button onClick={() => setPreviewPost(null)} className="text-slate-400 hover:text-slate-700 ml-3 shrink-0">
                <X size={18} />
              </button>
            </div>
            {!!previewPost.excerpt && (
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs text-slate-500 italic">{previewPost.excerpt}</p>
              </div>
            )}
            <div
              className="flex-1 overflow-y-auto p-5 text-sm text-slate-700 [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:text-base [&_h2]:mt-5 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: previewPost.content }}
            />
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
              {previewPost.status === "draft" && (
                <button
                  onClick={() => { updatePostStatus(previewPost.id, "published"); setPreviewPost(null); }}
                  className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Publier cet article
                </button>
              )}
              <button onClick={() => setPreviewPost(null)} className="text-sm text-slate-500 hover:text-slate-800 px-4 py-1.5 rounded-lg transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
