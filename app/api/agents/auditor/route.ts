import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { serperSearch, formatResults } from "@/lib/serper";
import { getTopQueries, getTopPages, getCountries, getDevices, formatGscData } from "@/lib/gsc";
import { MOVEO_TAXI_BRIEF } from "@/lib/seo-agent-context";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const gscEnabled = !!process.env.GSC_REFRESH_TOKEN;

    const [siteIndex, brandEn, brandFr, competitors, airportMarket, heMarket, gscQueries, gscPages, gscCountries, gscDevices] = await Promise.all([
      serperSearch("site:moveotaxi.com", { gl: "il", hl: "en", num: 10 }),
      serperSearch("moveotaxi.com taxi Israel", { gl: "il", hl: "en", num: 5 }),
      serperSearch("Moveo Taxi Israël", { gl: "il", hl: "fr", num: 5 }),
      serperSearch("taxi private transfer Ben Gurion airport Israel", { gl: "il", hl: "en", num: 8 }),
      serperSearch("airport taxi Israel book online", { gl: "il", hl: "en", num: 5 }),
      serperSearch("הזמנת מונית אונליין ישראל", { gl: "il", hl: "iw", num: 5 }),
      gscEnabled ? getTopQueries(28, 20) : Promise.resolve(null),
      gscEnabled ? getTopPages(28, 15) : Promise.resolve(null),
      gscEnabled ? getCountries(28) : Promise.resolve(null),
      gscEnabled ? getDevices(28) : Promise.resolve(null),
    ]);

    const gscContext = gscQueries ? `
=== DONNÉES GOOGLE SEARCH CONSOLE (28 derniers jours) ===

TOP 20 REQUÊTES (vraies recherches qui amènent du trafic):
${formatGscData(gscQueries)}

TOP 15 PAGES (pages les plus visitées):
${formatGscData(gscPages ?? [])}

PAYS (origine du trafic):
${formatGscData(gscCountries ?? [])}

APPAREILS:
${formatGscData(gscDevices ?? [])}
` : "\n[Google Search Console non connecté — données Serper uniquement]\n";

    const searchContext = `
=== DONNÉES GOOGLE RÉELLES SUR MOVEO TAXI ===

[Pages indexées par Google - site:moveotaxi.com]
${formatResults(siteIndex)}

[Moveo Taxi sur Google.il en anglais]
${formatResults(brandEn)}

[Moveo Taxi sur Google en français]
${formatResults(brandFr)}

[Marché concurrentiel: taxi Ben Gurion]
${formatResults(competitors)}

[Marché: airport taxi Israel book online]
${formatResults(airportMarket)}

[Marché hébreu: הזמנת מונית אונליין]
${formatResults(heMarket)}
`;

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 4096,
      tools: [{
        name: "save_audit",
        description: "Save the SEO audit results for Moveo Taxi",
        input_schema: {
          type: "object" as const,
          properties: {
            indexation: {
              type: "object" as const,
              properties: {
                pages_trouvees: { type: "string" as const },
                problemes: { type: "array" as const, items: { type: "string" as const } },
                bon_points: { type: "array" as const, items: { type: "string" as const } },
              },
              required: ["pages_trouvees", "problemes", "bon_points"],
            },
            visibilite_actuelle: { type: "string" as const },
            critical_issues: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  issue: { type: "string" as const },
                  page: { type: "string" as const },
                  fix: { type: "string" as const },
                  impact: { type: "string" as const, enum: ["high", "medium", "low"] },
                },
                required: ["issue", "fix", "impact"],
              },
            },
            quick_wins: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  action: { type: "string" as const },
                  effort: { type: "string" as const },
                  impact: { type: "string" as const, enum: ["high", "medium", "low"] },
                  reason: { type: "string" as const },
                },
                required: ["action", "effort", "impact"],
              },
            },
            long_term: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  action: { type: "string" as const },
                  effort: { type: "string" as const },
                  expected_result: { type: "string" as const },
                },
                required: ["action", "effort"],
              },
            },
            content_gaps: { type: "array" as const, items: { type: "string" as const } },
            score: {
              type: "object" as const,
              properties: {
                current: { type: "number" as const },
                potential: { type: "number" as const },
                main_blocker: { type: "string" as const },
              },
              required: ["current", "potential", "main_blocker"],
            },
          },
          required: ["indexation", "visibilite_actuelle", "critical_issues", "quick_wins", "score"],
        },
      }],
      tool_choice: { type: "tool" as const, name: "save_audit" },
      messages: [{
        role: "user",
        content: `Tu es Maya Cohen, auditrice SEO pour Moveo Taxi. Tu connais parfaitement l'entreprise.

${MOVEO_TAXI_BRIEF}

Voici les VRAIES données Google actuelles sur Moveo Taxi et son marché :

${gscContext}
${searchContext}

Structure actuelle du site :
- Homepage avec widget de réservation
- /airport — transferts aéroport Ben Gurion
- /routes — grille de prix intercités
- /[locale]/route/[slug] — pages routes individuelles
- 5 langues: he, en, fr, ru, es (hreflang + canonicals)
- Schema.org JSON-LD ✅ | Google Business Profile ✅ | Blog ✅ (articles en draft)

En te basant sur les VRAIES données Google fournies, fais un audit SEO complet.
Appelle l'outil save_audit avec tes résultats.`,
      }],
    });

    const toolUse = msg.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool_use block in auditor response");
    const content = toolUse.input as Record<string, unknown>;
    const score = content.score as Record<string, unknown> | undefined;
    const criticals = content.critical_issues as unknown[] | undefined;
    const wins = content.quick_wins as unknown[] | undefined;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "auditor",
      title: `Audit SEO — Score ${score?.current ?? "?"}/100 → potentiel ${score?.potential ?? "?"}/100`,
      summary: `${criticals?.length ?? 0} problèmes critiques. ${wins?.length ?? 0} gains rapides. Bloquant: ${score?.main_blocker ?? ""}`,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    try {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "auditor",
        title: "Erreur audit SEO",
        summary: msg.slice(0, 300),
        content: { error: true, message: msg },
      });
    } catch (_) { /* ignore */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
