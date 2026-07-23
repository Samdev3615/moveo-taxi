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
      max_tokens: 16000,
      messages: [{
        role: "user",
        content: `Tu es Rafi Shapira, expert mots-clés pour Moveo Taxi. Tu connais l'entreprise en profondeur.

${MOVEO_TAXI_BRIEF}

Tu es un expert en recherche de mots-clés pour Moveo Taxi (moveotaxi.com), service de taxi privé en Israël.

Voici les VRAIS résultats Google actuels en 5 langues pour les recherches taxi en Israël :

${searchContext}

En analysant ces résultats réels (titres, snippets, sites qui rankent, "People also ask"), identifie les meilleures opportunités de mots-clés pour Moveo Taxi.

Retourne UNIQUEMENT un JSON valide :
{
  "high_intent": [
    { "keyword": "mot-clé exact", "locale": "en|fr|he|ru|es", "volume": "high|medium|low", "competition": "high|medium|low", "opportunity": "explication en français" }
  ],
  "informational": [
    { "keyword": "mot-clé exact", "locale": "en|fr|he|ru|es", "content_angle": "angle de contenu en français" }
  ],
  "long_tail": [
    { "keyword": "mot-clé exact", "locale": "en|fr|he|ru|es", "difficulty": "low|medium", "opportunity": "pourquoi c'est une opportunité" }
  ],
  "hebrew_specific": [
    { "keyword": "מילת מפתח בעברית", "transliteration": "translittération", "intent": "intention de recherche en français" }
  ],
  "gaps_identifies": ["lacune de contenu identifiée d'après les résultats Google 1", "gap 2"],
  "top_5_priority": ["mot-clé prioritaire 1", "2", "3", "4", "5"],
  "insight": "insight stratégique clé basé sur les données Google réelles, en français"
}

Minimum 6 mots-clés par catégorie. Base-toi sur ce que tu vois RÉELLEMENT dans les résultats Google fournis.`,
      }],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const match = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/\{[\s\S]*\}/);
    const jsonStr = match ? (match[1] ?? match[0]) : null;
    if (!jsonStr) throw new Error("No JSON in response");
    const content = JSON.parse(jsonStr);

    const totalKeywords =
      (content.high_intent?.length ?? 0) +
      (content.informational?.length ?? 0) +
      (content.long_tail?.length ?? 0);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "keywords",
      title: `Recherche mots-clés — ${totalKeywords} opportunités identifiées (données Google réelles)`,
      summary: content.insight ?? `Top 5: ${(content.top_5_priority ?? []).join(", ")}`,
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
