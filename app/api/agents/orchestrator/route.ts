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
      max_tokens: 8192,
      tools: [{
        name: "save_strategy",
        description: "Save the weekly SEO strategic plan for Moveo Taxi",
        input_schema: {
          type: "object" as const,
          properties: {
            synthese: { type: "string" as const },
            score_global: {
              type: "object" as const,
              properties: {
                actuel: { type: "number" as const },
                potentiel: { type: "number" as const },
                note: { type: "string" as const },
              },
              required: ["actuel", "potentiel", "note"],
            },
            priorites: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  rang: { type: "number" as const },
                  action: { type: "string" as const },
                  pourquoi: { type: "string" as const },
                  agent_source: { type: "string" as const },
                  impact: { type: "string" as const, enum: ["high", "medium", "low"] },
                  effort: { type: "string" as const },
                },
                required: ["rang", "action", "pourquoi", "impact", "effort"],
              },
            },
            mots_cles_prioritaires: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  keyword: { type: "string" as const },
                  locale: { type: "string" as const },
                  raison: { type: "string" as const },
                },
                required: ["keyword", "locale", "raison"],
              },
            },
            opportunite_rapide: { type: "string" as const },
            alerte: { type: "string" as const },
            plan_30_jours: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  semaine: { type: "number" as const },
                  focus: { type: "string" as const },
                },
                required: ["semaine", "focus"],
              },
            },
            agents_a_relancer: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  agent: { type: "string" as const },
                  raison: { type: "string" as const },
                },
                required: ["agent", "raison"],
              },
            },
          },
          required: ["synthese", "score_global", "priorites", "opportunite_rapide", "alerte", "plan_30_jours"],
        },
      }],
      tool_choice: { type: "tool" as const, name: "save_strategy" },
      messages: [{
        role: "user",
        content: `Tu es David Levi, orchestrateur SEO stratégique de Moveo Taxi. Tu connais l'entreprise par cœur et coordonnes toute l'équipe.

${MOVEO_TAXI_BRIEF}

Tu analyses les rapports de tes agents spécialisés et tu produis un plan d'action stratégique synthétisé, toujours aligné avec ce que Moveo Taxi fait réellement (transferts aéroport + intercités privés — jamais de courses en ville ni de taxis au compteur).

Voici les derniers rapports disponibles (${sections.length} agent(s)) :

${availableReports}

En croisant ces données, produis un plan d'action SEO stratégique pour les 7 prochains jours.
Minimum 5 priorités. Croise vraiment les données pour des insights uniques que chaque agent seul ne pourrait pas produire.
Appelle l'outil save_strategy avec tes résultats.`,
      }],
    });

    const toolUse = msg.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool_use block in orchestrator response");
    const content = toolUse.input as Record<string, unknown>;

    const priorites = content.priorites as unknown[] | undefined;
    const scoreGlobal = content.score_global as Record<string, unknown> | undefined;
    const nbPriorites = priorites?.length ?? 0;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "orchestrator",
      title: `Plan stratégique — ${nbPriorites} priorités · Score ${scoreGlobal?.actuel ?? "?"}/100`,
      summary: String(content.synthese ?? content.opportunite_rapide ?? "Plan d'action SEO hebdomadaire"),
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
