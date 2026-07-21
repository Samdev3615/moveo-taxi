import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { serperSearch, formatResults } from "@/lib/serper";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [gett, yango, airportTaxi, moveo, hebrewTaxi, francophone] = await Promise.all([
      serperSearch("Gett taxi Israel airport transfer", { gl: "il", hl: "en" }),
      serperSearch("Yango taxi Israel Ben Gurion", { gl: "il", hl: "en" }),
      serperSearch("taxi Ben Gurion airport private transfer", { gl: "il", hl: "en", num: 8 }),
      serperSearch("site:moveotaxi.com OR moveotaxi", { gl: "il", hl: "en" }),
      serperSearch("מונית נתב\"ג מחיר", { gl: "il", hl: "iw" }),
      serperSearch("taxi aéroport Ben Gourion prix", { gl: "il", hl: "fr" }),
    ]);

    const searchContext = `
=== RÉSULTATS GOOGLE EN TEMPS RÉEL ===

[Gett taxi Israël]
${formatResults(gett)}

[Yango taxi Israël]
${formatResults(yango)}

[Marché: taxi Ben Gurion (Google.il)]
${formatResults(airportTaxi)}

[Moveo Taxi sur Google]
${formatResults(moveo)}

[Recherches hébraïques: מונית נתב"ג]
${formatResults(hebrewTaxi)}

[Recherches françaises: taxi Ben Gourion]
${formatResults(francophone)}
`;

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 3000,
      messages: [{
        role: "user",
        content: `Tu es un analyste SEO expert pour Moveo Taxi (moveotaxi.com), service de taxi privé en Israël.

Voici les VRAIS résultats Google actuels pour les requêtes taxi en Israël :

${searchContext}

En analysant ces données réelles, fournis une analyse concurrentielle complète.

Retourne UNIQUEMENT un objet JSON valide en français :
{
  "competitors": [
    {
      "name": "nom du concurrent",
      "presence_google": "comment il apparaît dans les résultats ci-dessus",
      "strengths": ["force 1", "force 2"],
      "weaknesses": ["faiblesse 1", "faiblesse 2"],
      "seo_positioning": "positionnement SEO observé dans les vrais résultats"
    }
  ],
  "moveo_position": "où et comment Moveo Taxi apparaît dans les résultats Google actuels",
  "gaps": ["gap SEO identifié dans les vrais résultats 1", "gap 2", "gap 3"],
  "content_topics": ["sujet que les concurrents rankent d'après les résultats réels"],
  "recommendations": [
    { "priority": "high|medium|low", "action": "action concrète basée sur les données réelles", "reason": "raison basée sur les résultats Google" }
  ],
  "opportunity_score": "note 1-10",
  "key_insight": "insight principal basé sur les données Google réelles"
}`,
      }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const content = JSON.parse(match[0]);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "competitor",
      title: `Analyse concurrentielle — Score opportunité: ${content.opportunity_score}/10`,
      summary: content.key_insight ?? `${content.competitors?.length ?? 0} concurrents analysés avec données Google réelles.`,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
