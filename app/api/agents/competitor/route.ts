import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { serperSearch, formatResults } from "@/lib/serper";

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
      max_tokens: 3000,
      messages: [{
        role: "user",
        content: `Tu es un analyste SEO expert pour Moveo Taxi (moveotaxi.com), service de taxi privé en Israël couvrant aéroport Ben Gurion + trajets intercités.

Voici les vrais résultats Google en 5 langues pour les recherches taxi en Israël :

${searchContext}

Identifie TOUS les concurrents qui apparaissent dans ces résultats (pas seulement Gett/Yango — cherche aussi les agences de voyage, services locaux, agrégateurs, sites spécialisés...).

Réponds UNIQUEMENT avec un JSON valide en français :
{
  "competitors": [
    {
      "name": "nom du service",
      "url": "url",
      "type": "appli|site-local|agence-voyage|agregateur|autre",
      "langues_presentes": ["he","en","fr","ru","es"],
      "mots_cles_seo": ["mots-clés visibles dans leurs titres/snippets"],
      "forces": ["avantage principal"],
      "faiblesses": ["point faible"]
    }
  ],
  "opportunites": [
    { "langue": "langue", "action": "ce que Moveo Taxi doit faire", "priorite": "high|medium|low" }
  ],
  "langue_moins_concurrentielle": "langue avec le moins de concurrents",
  "recommandation": "la chose la plus urgente à faire"
}`,
      }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      // Sauvegarde l'erreur pour debug dans le panel admin
      await supabaseAdmin.from("seo_reports").insert({
        agent: "competitor",
        title: "Erreur — Claude n'a pas retourné de JSON",
        summary: `Réponse brute: ${text.slice(0, 300)}`,
        content: { error: true, raw: text.slice(0, 1000) },
      });
      throw new Error(`No JSON in response. Raw: ${text.slice(0, 200)}`);
    }

    const content = JSON.parse(match[0]);
    const nbConcurrents = content.competitors?.length ?? 0;

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
