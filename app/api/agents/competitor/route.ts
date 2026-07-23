import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { serperSearch, formatResults } from "@/lib/serper";
import { MOVEO_TAXI_BRIEF } from "@/lib/seo-agent-context";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 10 recherches ciblées en 5 langues — parallèles (~3-5s)
    const [
      heAirport, heIntercity,
      enAirport, enIntercity, enTourism,
      frAirport, frPrivate,
      ruAirport,
      esAirport,
      heOnline,
    ] = await Promise.all([
      serperSearch('מונית נתב"ג מחיר', { gl: "il", hl: "iw", num: 8 }),
      serperSearch("מונית פרטית תל אביב ירושלים", { gl: "il", hl: "iw", num: 8 }),
      serperSearch("private taxi Ben Gurion airport Israel", { gl: "il", hl: "en", num: 8 }),
      serperSearch("taxi Tel Aviv Jerusalem intercity price", { gl: "il", hl: "en", num: 6 }),
      serperSearch("Israel private transfer tourism", { gl: "il", hl: "en", num: 6 }),
      serperSearch("taxi aéroport Ben Gourion Israel", { gl: "il", hl: "fr", num: 6 }),
      serperSearch("taxi privé Israël tourisme", { gl: "il", hl: "fr", num: 6 }),
      serperSearch("такси аэропорт Бен Гурион цена", { gl: "il", hl: "ru", num: 6 }),
      serperSearch("taxi aeropuerto Ben Gurion Israel", { gl: "il", hl: "es", num: 6 }),
      serperSearch("הזמנת מונית אונליין ישראל", { gl: "il", hl: "iw", num: 6 }),
    ]);

    const searchContext = `
=== RÉSULTATS GOOGLE RÉELS — CONCURRENTS TAXI ISRAËL EN 5 LANGUES ===

🇮🇱 HÉBREU — Aéroport
${formatResults(heAirport)}

🇮🇱 HÉBREU — Intercités
${formatResults(heIntercity)}

🇮🇱 HÉBREU — Réservation online
${formatResults(heOnline)}

🇬🇧 ANGLAIS — Aéroport Ben Gurion
${formatResults(enAirport)}

🇬🇧 ANGLAIS — Intercités
${formatResults(enIntercity)}

🇬🇧 ANGLAIS — Tourisme
${formatResults(enTourism)}

🇫🇷 FRANÇAIS — Aéroport
${formatResults(frAirport)}

🇫🇷 FRANÇAIS — Taxi privé
${formatResults(frPrivate)}

🇷🇺 RUSSE — Aéroport
${formatResults(ruAirport)}

🇪🇸 ESPAGNOL — Aéroport
${formatResults(esAirport)}
`;

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 4096,
      tools: [{
        name: "save_competitor_analysis",
        description: "Save the competitive analysis for Moveo Taxi",
        input_schema: {
          type: "object" as const,
          properties: {
            competitors: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  name: { type: "string" as const },
                  url: { type: "string" as const },
                  type: { type: "string" as const },
                  langues: { type: "array" as const, items: { type: "string" as const } },
                  mots_cles: { type: "array" as const, items: { type: "string" as const } },
                  force: { type: "string" as const },
                },
                required: ["name", "url", "type"],
              },
            },
            opportunites: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  langue: { type: "string" as const },
                  action: { type: "string" as const },
                  priorite: { type: "string" as const, enum: ["high", "medium", "low"] },
                },
                required: ["langue", "action", "priorite"],
              },
            },
            langue_moins_competitive: { type: "string" as const },
            recommandation: { type: "string" as const },
          },
          required: ["competitors", "opportunites", "langue_moins_competitive", "recommandation"],
        },
      }],
      tool_choice: { type: "tool" as const, name: "save_competitor_analysis" },
      messages: [{
        role: "user",
        content: `Tu es Alex Benhamou, analyste SEO concurrentielle pour Moveo Taxi. Tu connais l'entreprise sur le bout des doigts.

${MOVEO_TAXI_BRIEF}

Analyse ces résultats Google réels pour identifier nos concurrents directs (services de taxi privé à prix fixe en Israël, transferts aéroport et/ou intercités — même niche que nous) :

${searchContext}

Identifie UNIQUEMENT les concurrents directs qui offrent des services similaires aux nôtres (réservation en ligne, prix fixes, transferts privés). Ne liste pas les sites d'informations générales sur les taxis.

Appelle l'outil save_competitor_analysis avec tes résultats.`,
      }],
    });

    const toolUse = msg.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool_use block in competitor response");
    const content = toolUse.input as Record<string, unknown>;
    const nbConcurrents = (content.competitors as unknown[])?.length ?? 0;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "competitor",
      title: `Analyse concurrentielle — ${nbConcurrents} concurrents identifiés en 5 langues`,
      summary: content.recommandation ?? `${nbConcurrents} concurrents. Langue sous-exploitée: ${content.langue_moins_concurrentielle ?? "?"}`,
      content,
    });

    return NextResponse.json({ success: true, competitors: nbConcurrents });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Sauvegarde l'erreur dans Supabase — visible dans le panel admin
    try {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "competitor",
        title: "Erreur agent concurrent",
        summary: msg.slice(0, 300),
        content: { error: true, message: msg },
      });
    } catch (_) { /* ignore secondary error */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
