import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { MOVEO_TAXI_BRIEF } from "@/lib/seo-agent-context";

export const maxDuration = 300;

type ReportRow = { content: Record<string, unknown>; created_at: string; title: string };

async function getLatestGoodReport(agent: string): Promise<ReportRow | null> {
  const { data } = await supabaseAdmin
    .from("seo_reports")
    .select("content, created_at, title")
    .eq("agent", agent)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!data) return null;
  // Filtre les rapports d'erreur côté JS — évite les filtres JSONB instables
  const good = data.find((r) => !(r.content as Record<string, unknown>)?.error);
  return good ?? null;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [competitor, auditor, keywords, writer] = await Promise.all([
      getLatestGoodReport("competitor"),
      getLatestGoodReport("auditor"),
      getLatestGoodReport("keywords"),
      getLatestGoodReport("writer"),
    ]);

    const sections = [
      competitor ? `=== RAPPORT CONCURRENT (${competitor.created_at.slice(0, 10)})\nTitre: ${competitor.title}\n${JSON.stringify(competitor.content, null, 2)}` : null,
      auditor    ? `=== RAPPORT AUDIT SEO (${auditor.created_at.slice(0, 10)})\nTitre: ${auditor.title}\n${JSON.stringify(auditor.content, null, 2)}` : null,
      keywords   ? `=== RAPPORT MOTS-CLÉS (${keywords.created_at.slice(0, 10)})\nTitre: ${keywords.title}\n${JSON.stringify(keywords.content, null, 2)}` : null,
      writer     ? `=== RAPPORT RÉDACTEUR (${writer.created_at.slice(0, 10)})\nTitre: ${writer.title}\n${JSON.stringify(writer.content, null, 2)}` : null,
    ].filter(Boolean);

    if (sections.length === 0) {
      throw new Error("Aucun rapport disponible. Lance d'abord au moins un autre agent (Concurrent, Mots-clés, Auditeur ou Rédacteur).");
    }

    const availableReports = sections.join("\n\n");

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 16000,
      messages: [{
        role: "user",
        content: `Tu es David Levi, orchestrateur SEO stratégique de Moveo Taxi. Tu connais l'entreprise par cœur et coordonnes toute l'équipe.

${MOVEO_TAXI_BRIEF}

Tu analyses les rapports de tes agents spécialisés et tu produis un plan d'action stratégique synthétisé, toujours aligné avec ce que Moveo Taxi fait réellement (transferts aéroport + intercités privés — jamais de courses en ville ni de taxis au compteur).

Voici les derniers rapports disponibles (${sections.length} agent(s)) :

${availableReports}

En croisant ces données, produis un plan d'action SEO stratégique pour les 7 prochains jours.

Retourne UNIQUEMENT un JSON valide :
{
  "synthese": "résumé exécutif en 2-3 phrases de la situation SEO actuelle, basé sur les données croisées",
  "score_global": { "actuel": 0, "potentiel": 0, "note": "explication du score" },
  "priorites": [
    {
      "rang": 1,
      "action": "action concrète et précise à faire cette semaine",
      "pourquoi": "raison basée sur les données croisées des agents",
      "agent_source": "concurrent|auditor|keywords|writer ou combinaison",
      "impact": "high|medium|low",
      "effort": "1h|4h|1d|1w"
    }
  ],
  "mots_cles_prioritaires": [
    { "keyword": "mot-clé exact", "locale": "fr|en|he|ru|es", "raison": "pourquoi le cibler maintenant d'après les données" }
  ],
  "opportunite_rapide": "la meilleure opportunité quick win identifiée en croisant tous les rapports",
  "alerte": "le risque ou problème le plus urgent à adresser",
  "plan_30_jours": [
    { "semaine": 1, "focus": "objectif précis de la semaine 1" },
    { "semaine": 2, "focus": "objectif précis de la semaine 2" },
    { "semaine": 3, "focus": "objectif précis de la semaine 3" },
    { "semaine": 4, "focus": "objectif précis de la semaine 4" }
  ],
  "agents_a_relancer": [
    { "agent": "competitor|auditor|keywords|writer", "raison": "pourquoi relancer en priorité" }
  ]
}

Minimum 5 priorités. Croise vraiment les données pour des insights uniques que chaque agent seul ne pourrait pas produire.`,
      }],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const match = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/\{[\s\S]*\}/);
    const jsonStr = match ? (match[1] ?? match[0]) : null;
    if (!jsonStr) throw new Error("No JSON in response");
    const content = JSON.parse(jsonStr);

    const nbPriorites = (content.priorites as unknown[])?.length ?? 0;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "orchestrator",
      title: `Plan stratégique — ${nbPriorites} priorités · Score ${content.score_global?.actuel ?? "?"}/100`,
      summary: content.synthese ?? content.opportunite_rapide ?? "Plan d'action SEO hebdomadaire",
      content,
    });

    return NextResponse.json({ success: true, priorites: nbPriorites });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    try {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "orchestrator",
        title: "Erreur orchestrateur",
        summary: msg.slice(0, 300),
        content: { error: true, message: msg },
      });
    } catch (_) { /* ignore */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
