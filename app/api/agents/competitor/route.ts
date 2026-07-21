import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { serperSearch, formatResults } from "@/lib/serper";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Recherches en 5 langues — aéroport + intercités + général
    const searches = await Promise.all([
      // 🇮🇱 HÉBREU
      serperSearch('מונית נתב"ג מחיר', { gl: "il", hl: "iw", num: 8 }),
      serperSearch("מונית פרטית תל אביב ירושלים", { gl: "il", hl: "iw", num: 8 }),
      serperSearch("הזמנת מונית ישראל אונליין", { gl: "il", hl: "iw", num: 8 }),
      serperSearch("שירות מונית אילת תל אביב", { gl: "il", hl: "iw", num: 5 }),
      serperSearch("מונית שדה התעופה בן גוריון", { gl: "il", hl: "iw", num: 5 }),

      // 🇬🇧 ANGLAIS
      serperSearch("private taxi Ben Gurion airport", { gl: "il", hl: "en", num: 8 }),
      serperSearch("airport transfer Israel book online", { gl: "il", hl: "en", num: 8 }),
      serperSearch("taxi Tel Aviv Jerusalem price", { gl: "il", hl: "en", num: 8 }),
      serperSearch("intercity taxi Israel private", { gl: "il", hl: "en", num: 5 }),
      serperSearch("Israel private transfer tourism", { gl: "il", hl: "en", num: 5 }),

      // 🇫🇷 FRANÇAIS
      serperSearch("taxi aéroport Ben Gourion", { gl: "il", hl: "fr", num: 8 }),
      serperSearch("taxi privé Israël pas cher", { gl: "il", hl: "fr", num: 8 }),
      serperSearch("transfert privé Tel Aviv Jérusalem", { gl: "il", hl: "fr", num: 5 }),

      // 🇷🇺 RUSSE
      serperSearch("такси аэропорт Бен Гурион цена", { gl: "il", hl: "ru", num: 8 }),
      serperSearch("частное такси Израиль", { gl: "il", hl: "ru", num: 8 }),
      serperSearch("трансфер из аэропорта Израиль", { gl: "il", hl: "ru", num: 5 }),

      // 🇪🇸 ESPAGNOL
      serperSearch("taxi aeropuerto Ben Gurion", { gl: "il", hl: "es", num: 8 }),
      serperSearch("transfer privado Israel turismo", { gl: "il", hl: "es", num: 5 }),
    ]);

    const [
      heAirport, heIntercity, heOnline, heEilat, heTerminal,
      enAirport, enTransfer, enIntercity, enPrivate, enTourism,
      frAirport, frPrivate, frIntercity,
      ruAirport, ruPrivate, ruTransfer,
      esAirport, esTransfer,
    ] = searches;

    const searchContext = `
=== RÉSULTATS GOOGLE EN TEMPS RÉEL — ANALYSE CONCURRENTIELLE COMPLÈTE ===

--- 🇮🇱 HÉBREU ---
[מונית נתב"ג מחיר]
${formatResults(heAirport)}

[מונית פרטית תל אביב ירושלים]
${formatResults(heIntercity)}

[הזמנת מונית ישראל אונליין]
${formatResults(heOnline)}

[שירות מונית אילת תל אביב]
${formatResults(heEilat)}

[מונית שדה התעופה בן גוריון]
${formatResults(heTerminal)}

--- 🇬🇧 ANGLAIS ---
[private taxi Ben Gurion airport]
${formatResults(enAirport)}

[airport transfer Israel book online]
${formatResults(enTransfer)}

[taxi Tel Aviv Jerusalem price]
${formatResults(enIntercity)}

[intercity taxi Israel private]
${formatResults(enPrivate)}

[Israel private transfer tourism]
${formatResults(enTourism)}

--- 🇫🇷 FRANÇAIS ---
[taxi aéroport Ben Gourion]
${formatResults(frAirport)}

[taxi privé Israël pas cher]
${formatResults(frPrivate)}

[transfert privé Tel Aviv Jérusalem]
${formatResults(frIntercity)}

--- 🇷🇺 RUSSE ---
[такси аэропорт Бен Гурион цена]
${formatResults(ruAirport)}

[частное такси Израиль]
${formatResults(ruPrivate)}

[трансфер из аэропорта Израиль]
${formatResults(ruTransfer)}

--- 🇪🇸 ESPAGNOL ---
[taxi aeropuerto Ben Gurion]
${formatResults(esAirport)}

[transfer privado Israel turismo]
${formatResults(esTransfer)}
`;

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `Tu es un analyste SEO expert pour Moveo Taxi (moveotaxi.com), service de taxi privé en Israël.

Voici les VRAIS résultats Google en 5 langues pour toutes les requêtes taxi/transfert en Israël :

${searchContext}

Analyse tous ces résultats et identifie TOUS les concurrents réels qui apparaissent (pas seulement Gett/Yango — cherche tous les sites qui rankent : agences de voyage, services privés locaux, plateformes de réservation, sites en hébreu, en russe, en français...).

Retourne UNIQUEMENT un JSON valide en français :
{
  "competitors": [
    {
      "name": "nom du site/service",
      "url": "url du site",
      "langues_presentes": ["he", "en", "fr", "ru", "es"],
      "type": "appli|site-local|agence-voyage|agregateur|autre",
      "requetes_ou_ils_rankent": ["requête 1", "requête 2"],
      "angle_seo": "comment ils se positionnent SEO (ex: prix bas, luxe, touristes...)",
      "mots_cles_utilises": ["mot-clé SEO identifié dans leurs titres/snippets"],
      "forces": ["force 1", "force 2"],
      "faiblesses": ["faiblesse 1"]
    }
  ],
  "carte_marche": {
    "segments_couverts": ["segment avec beaucoup de concurrents"],
    "segments_sous_exploites": ["segment avec peu de concurrents = opportunité"],
    "langue_la_moins_concurrentielle": "langue avec moins de concurrents",
    "langue_la_plus_concurrentielle": "langue la plus saturée"
  },
  "mots_cles_concurrents": [
    { "mot_cle": "mot-clé identifié dans les snippets/titres concurrents", "locale": "langue", "concurrent_qui_ranke": "nom" }
  ],
  "opportunites": [
    { "opportunite": "description de l'opportunité", "langue": "langue", "action": "ce que Moveo Taxi doit faire", "priorite": "high|medium|low" }
  ],
  "moveo_vs_concurrents": "analyse de la position actuelle de Moveo Taxi face à tous ces concurrents identifiés",
  "recommandation_principale": "la 1 chose la plus urgente à faire pour surpasser les concurrents identifiés"
}`,
      }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const content = JSON.parse(match[0]);

    const nbConcurrents = content.competitors?.length ?? 0;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "competitor",
      title: `Analyse concurrentielle — ${nbConcurrents} concurrents identifiés en 5 langues`,
      summary: content.recommandation_principale ?? `${nbConcurrents} concurrents analysés. Segment sous-exploité: ${content.carte_marche?.langue_la_moins_concurrentielle ?? "?"}`,
      content,
    });

    return NextResponse.json({ success: true, competitors: nbConcurrents });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
