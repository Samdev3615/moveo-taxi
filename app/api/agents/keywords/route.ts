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
    const [enAirport, frAirport, ruAirport, heAirport, enIntercity, heIntercity, longTailFr, longTailRu, esAirport, esIntercity] = await Promise.all([
      serperSearch("taxi Ben Gurion airport Tel Aviv", { gl: "il", hl: "en", num: 8 }),
      serperSearch("taxi aéroport Ben Gourion", { gl: "il", hl: "fr", num: 8 }),
      serperSearch("такси аэропорт Бен Гурион", { gl: "il", hl: "ru", num: 5 }),
      serperSearch("מונית מנתב\"ג לתל אביב", { gl: "il", hl: "iw", num: 5 }),
      serperSearch("private taxi Tel Aviv Jerusalem price", { gl: "il", hl: "en", num: 5 }),
      serperSearch("מונית פרטית ירושלים תל אביב", { gl: "il", hl: "iw", num: 5 }),
      serperSearch("taxi pas cher Eilat depuis Tel Aviv", { gl: "il", hl: "fr", num: 5 }),
      serperSearch("такси Израиль туристы цена", { gl: "il", hl: "ru", num: 5 }),
      serperSearch("taxi privado aeropuerto Israel Ben Gurion", { gl: "es", hl: "es", num: 5 }),
      serperSearch("taxi Tel Aviv precio reservar online", { gl: "es", hl: "es", num: 5 }),
    ]);

    const searchContext = `
=== VRAIS RÉSULTATS GOOGLE PAR LANGUE ===

[EN] taxi Ben Gurion airport Tel Aviv:
${formatResults(enAirport)}

[FR] taxi aéroport Ben Gourion:
${formatResults(frAirport)}

[RU] такси аэропорт Бен Гурион:
${formatResults(ruAirport)}

[HE] מונית מנתב"ג לתל אביב:
${formatResults(heAirport)}

[EN] private taxi Tel Aviv Jerusalem:
${formatResults(enIntercity)}

[HE] מונית פרטית ירושלים תל אביב:
${formatResults(heIntercity)}

[FR] taxi Eilat pas cher:
${formatResults(longTailFr)}

[RU] такси Израиль туристы:
${formatResults(longTailRu)}

[ES] taxi privado aeropuerto Israel:
${formatResults(esAirport)}

[ES] taxi Tel Aviv precio:
${formatResults(esIntercity)}
`;

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 4096,
      tools: [{
        name: "save_keywords",
        description: "Save keyword research results for Moveo Taxi",
        input_schema: {
          type: "object" as const,
          properties: {
            high_intent: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  keyword: { type: "string" as const },
                  locale: { type: "string" as const },
                  volume: { type: "string" as const, enum: ["high", "medium", "low"] },
                  competition: { type: "string" as const, enum: ["high", "medium", "low"] },
                  opportunity: { type: "string" as const },
                },
                required: ["keyword", "locale", "volume", "competition", "opportunity"],
              },
            },
            informational: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  keyword: { type: "string" as const },
                  locale: { type: "string" as const },
                  content_angle: { type: "string" as const },
                },
                required: ["keyword", "locale", "content_angle"],
              },
            },
            long_tail: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  keyword: { type: "string" as const },
                  locale: { type: "string" as const },
                  difficulty: { type: "string" as const, enum: ["low", "medium"] },
                  opportunity: { type: "string" as const },
                },
                required: ["keyword", "locale", "difficulty", "opportunity"],
              },
            },
            hebrew_specific: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  keyword: { type: "string" as const },
                  transliteration: { type: "string" as const },
                  intent: { type: "string" as const },
                },
                required: ["keyword", "intent"],
              },
            },
            gaps_identifies: { type: "array" as const, items: { type: "string" as const } },
            top_5_priority: { type: "array" as const, items: { type: "string" as const } },
            insight: { type: "string" as const },
          },
          required: ["high_intent", "informational", "long_tail", "hebrew_specific", "gaps_identifies", "top_5_priority", "insight"],
        },
      }],
      tool_choice: { type: "tool" as const, name: "save_keywords" },
      messages: [{
        role: "user",
        content: `Tu es Rafi Shapira, expert mots-clés pour Moveo Taxi. Tu connais l'entreprise en profondeur.

${MOVEO_TAXI_BRIEF}

Voici les VRAIS résultats Google actuels en 5 langues pour les recherches taxi en Israël :

${searchContext}

En analysant ces résultats réels (titres, snippets, sites qui rankent, "People also ask"), identifie les meilleures opportunités de mots-clés pour Moveo Taxi.

Minimum 6 mots-clés par catégorie. Base-toi sur ce que tu vois RÉELLEMENT dans les résultats Google fournis.
Appelle l'outil save_keywords avec tes résultats.`,
      }],
    });

    const toolUse = msg.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool_use block in keywords response");
    const content = toolUse.input as Record<string, unknown>;
    const highIntent = content.high_intent as unknown[] | undefined;
    const informational = content.informational as unknown[] | undefined;
    const longTail = content.long_tail as unknown[] | undefined;
    const top5 = content.top_5_priority as string[] | undefined;

    const totalKeywords =
      (highIntent?.length ?? 0) +
      (informational?.length ?? 0) +
      (longTail?.length ?? 0);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "keywords",
      title: `Recherche mots-clés — ${totalKeywords} opportunités identifiées (données Google réelles)`,
      summary: String(content.insight ?? `Top 5: ${(top5 ?? []).join(", ")}`),
      content,
    });

    return NextResponse.json({ success: true, total: totalKeywords });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    try {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "keywords",
        title: "Erreur recherche mots-clés",
        summary: msg.slice(0, 300),
        content: { error: true, message: msg },
      });
    } catch (_) { /* ignore */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
