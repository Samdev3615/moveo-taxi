import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { serperSearch, formatResults } from "@/lib/serper";
import { getTopQueries, getTopPages, getCountries, getDevices, formatGscData } from "@/lib/gsc";

export const maxDuration = 60;

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
      max_tokens: 16000,
      messages: [{
        role: "user",
        content: `Tu es un auditeur SEO expert pour Moveo Taxi (moveotaxi.com).

Voici les VRAIES données Google actuelles sur Moveo Taxi et son marché :

${gscContext}
${searchContext}

Structure actuelle du site (implémentée) :
- Homepage avec widget de réservation
- /airport — transferts aéroport Ben Gurion
- /routes — grille de prix intercités
- /contact, /about, /drivers
- /[locale]/route/[slug] — pages routes individuelles
- 5 langues: he, en, fr, ru, es (hreflang + canonicals)
- Sitemap.xml soumis à Google Search Console
- noindex sur /confirmation/*

CE QUI EST IMPLÉMENTÉ :
- Schema.org JSON-LD (LocalBusiness + TaxiService) ✅ dans app/[locale]/layout.tsx
- Google Business Profile ✅ créé et vérifié (en attente validation vidéo Google)

CE QUI MANQUE (identifié précédemment) :
- Blog / section contenu (articles générés mais non publiés)
- FAQPage Schema.org
- Liens internes entre pages routes

En te basant sur les VRAIES données Google fournies, fais un audit SEO complet.

Retourne UNIQUEMENT un JSON valide en français :
{
  "indexation": {
    "pages_trouvees": "nombre de pages indexées observées",
    "problemes": ["problème d'indexation observé 1"],
    "bon_points": ["point positif observé dans les résultats"]
  },
  "visibilite_actuelle": "comment Moveo Taxi apparaît actuellement sur Google d'après les données réelles",
  "critical_issues": [
    { "issue": "problème critique en français", "page": "page concernée", "fix": "correction précise", "impact": "high|medium|low" }
  ],
  "quick_wins": [
    { "action": "action rapide en français", "effort": "1h|4h|1d", "impact": "high|medium|low", "reason": "pourquoi basé sur les données réelles" }
  ],
  "long_term": [
    { "action": "action long terme", "effort": "1w|1m", "expected_result": "résultat attendu" }
  ],
  "schema_markup": {
    "recommended": ["LocalBusiness", "TaxiService", "FAQPage"],
    "priority": "CRITIQUE",
    "reason": "impact attendu sur les résultats Google"
  },
  "content_gaps": ["page ou sujet manquant identifié d'après les résultats concurrents"],
  "score": {
    "current": 0,
    "potential": 0,
    "main_blocker": "principal obstacle identifié dans les données Google"
  }
}`,
      }],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const content = JSON.parse(match[0]);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "auditor",
      title: `Audit SEO — Score ${content.score?.current ?? "?"}/100 → potentiel ${content.score?.potential ?? "?"}/100`,
      summary: `${content.critical_issues?.length ?? 0} problèmes critiques. ${content.quick_wins?.length ?? 0} gains rapides. Bloquant: ${content.score?.main_blocker ?? ""}`,
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
