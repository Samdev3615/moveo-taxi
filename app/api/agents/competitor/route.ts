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
      max_tokens: 16000,
      messages: [{
        role: "user",
        content: `Tu es Alex Benhamou, analyste SEO concurrentielle pour Moveo Taxi. Tu connais l'entreprise sur le bout des doigts.

${MOVEO_TAXI_BRIEF}

Maintenant, analyse ces résultats Google réels pour identifier nos concurrents directs (services de taxi privé à prix fixe en Israël, transferts aéroport et/ou intercités — même niche que nous) :

${searchContext}

Identifie UNIQUEMENT les concurrents directs qui offrent des services similaires aux nôtres (réservation en ligne, prix fixes, transferts privés). Ne liste pas les sites d'informations générales sur les taxis.

IMPORTANT: Réponds UNIQUEMENT avec du JSON brut, sans texte avant ni après, sans balises markdown.

Format requis:
{"competitors":[{"name":"string","url":"string","type":"string","langues":["string"],"mots_cles":["string"],"force":"string"}],"opportunites":[{"langue":"string","action":"string","priorite":"high|medium|low"}],"langue_moins_competitive":"string","recommandation":"string"}`,
      }],
    });

    // Claude Sonnet 5 peut retourner un bloc "thinking" avant le texte — on cherche le bon bloc
    const textBlock = msg.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

    // Log de debug: types de blocs reçus
    const blockTypes = msg.content.map((b) => b.type).join(", ");

    // Essaie d'extraire le JSON (avec ou sans bloc markdown ```json```)
    const match = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/\{[\s\S]*\}/);
    const jsonStr = match ? (match[1] ?? match[0]) : null;

    if (!jsonStr) {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "competitor",
        title: "Debug — réponse brute de Claude",
        summary: `Blocs: [${blockTypes}] | Longueur texte: ${text.length} | Début: ${text.slice(0, 120)}`,
        content: { error: true, block_types: blockTypes, raw_full: text, raw_length: text.length },
      });
      throw new Error(`No JSON. Blocks=[${blockTypes}] TextLen=${text.length}`);
    }

    let content: Record<string, unknown>;
    try {
      content = JSON.parse(jsonStr);
    } catch (parseErr) {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "competitor",
        title: "Erreur JSON tronqué",
        summary: `JSON coupé à ${jsonStr.length} chars. Erreur: ${String(parseErr).slice(0, 100)}`,
        content: { error: true, partial_json: jsonStr.slice(0, 2000) },
      });
      throw parseErr;
    }
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
