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
    const [brandMentions, reviewsEn, reviewsFr, reviewsHe, backlinkOpps, compGbpEn, compGbpFr] = await Promise.all([
      serperSearch('"Moveo Taxi" OR "moveotaxi"', { gl: "il", hl: "en", num: 10 }),
      serperSearch("best private taxi Israel tourists reviews", { gl: "il", hl: "en", num: 8 }),
      serperSearch("taxi privé Israël avis touristes", { gl: "il", hl: "fr", num: 8 }),
      serperSearch("מוניות פרטיות ישראל ביקורות המלצות", { gl: "il", hl: "iw", num: 5 }),
      serperSearch("taxi Israel transfer airport site:tripadvisor.com OR site:viator.com OR site:getyourguide.com OR site:lonelyplanet.com", { gl: "il", hl: "en", num: 8 }),
      serperSearch("Gett taxi Israel Ben Gurion airport review", { gl: "il", hl: "en", num: 5 }),
      serperSearch("Yango taxi Israël avis Ben Gourion", { gl: "il", hl: "fr", num: 5 }),
    ]);

    const searchContext = `
=== MENTIONS DE LA MARQUE "Moveo Taxi" :
${formatResults(brandMentions)}

=== PAYSAGE DES AVIS — Taxi privé Israël (EN) :
${formatResults(reviewsEn)}

=== PAYSAGE DES AVIS — Taxi privé Israël (FR) :
${formatResults(reviewsFr)}

=== PAYSAGE DES AVIS — Taxi privé Israël (HE) :
${formatResults(reviewsHe)}

=== OPPORTUNITÉS BACKLINKS (TripAdvisor, Viator, GetYourGuide, LonelyPlanet) :
${formatResults(backlinkOpps)}

=== GBP CONCURRENTS — Gett (EN) :
${formatResults(compGbpEn)}

=== GBP CONCURRENTS — Yango (FR) :
${formatResults(compGbpFr)}
`;

    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 4096,
      tools: [{
        name: "save_local_seo",
        description: "Save local SEO monitoring report for Moveo Taxi",
        input_schema: {
          type: "object" as const,
          properties: {
            brand_presence: {
              type: "object" as const,
              properties: {
                mentions_trouvees: { type: "number" as const },
                sites_mentionnant: { type: "array" as const, items: { type: "string" as const } },
                sentiment: { type: "string" as const, enum: ["positif", "neutre", "negatif", "aucune_donnee"] },
                note: { type: "string" as const },
              },
              required: ["mentions_trouvees", "sites_mentionnant", "sentiment", "note"],
            },
            opportunites_backlinks: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  site: { type: "string" as const },
                  url_exemple: { type: "string" as const },
                  type_lien: { type: "string" as const },
                  action: { type: "string" as const },
                  priorite: { type: "string" as const, enum: ["haute", "moyenne", "basse"] },
                },
                required: ["site", "type_lien", "action", "priorite"],
              },
            },
            sites_avis_a_viser: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  plateforme: { type: "string" as const },
                  url: { type: "string" as const },
                  action: { type: "string" as const },
                  impact_seo: { type: "string" as const, enum: ["haute", "moyenne", "basse"] },
                },
                required: ["plateforme", "action", "impact_seo"],
              },
            },
            concurrents_gbp: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  concurrent: { type: "string" as const },
                  presence_gbp: { type: "string" as const },
                  nb_avis_estime: { type: "string" as const },
                  opportunite: { type: "string" as const },
                },
                required: ["concurrent", "presence_gbp", "opportunite"],
              },
            },
            recommandations_gbp: {
              type: "array" as const,
              items: { type: "string" as const },
            },
            template_demande_avis: { type: "string" as const },
            top_actions: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  action: { type: "string" as const },
                  impact: { type: "string" as const, enum: ["haute", "moyenne", "basse"] },
                  effort: { type: "string" as const, enum: ["faible", "moyen", "eleve"] },
                },
                required: ["action", "impact", "effort"],
              },
            },
            insight: { type: "string" as const },
          },
          required: [
            "brand_presence", "opportunites_backlinks", "sites_avis_a_viser",
            "concurrents_gbp", "recommandations_gbp", "template_demande_avis",
            "top_actions", "insight",
          ],
        },
      }],
      tool_choice: { type: "tool" as const, name: "save_local_seo" },
      messages: [{
        role: "user",
        content: `Tu es Noam Ben-David, expert SEO local pour Moveo Taxi. Tu surveilles la présence de la marque, les avis, les backlinks et Google Business Profile.

${MOVEO_TAXI_BRIEF}

Contexte GBP : Moveo Taxi a un profil Google Business Profile créé et vérifié, actuellement en attente de validation finale par Google (vidéo soumise). Le téléphone est +972-54-310-0044, le site est moveotaxi.com.

Voici les données Google collectées aujourd'hui :

${searchContext}

Analyse :
1. La présence actuelle de la marque "Moveo Taxi" sur le web
2. Les opportunités de backlinks (TripAdvisor, Viator, GetYourGuide, blogs voyage, sites touristiques Israël)
3. Les plateformes d'avis à cibler en priorité
4. La stratégie GBP face aux concurrents
5. Un template court de message WhatsApp pour demander un avis Google après une course

Minimum 5 opportunités backlinks, 3 plateformes d'avis, 5 top actions.
Appelle l'outil save_local_seo avec tes résultats.`,
      }],
    });

    const toolUse = msg.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool_use block in local-seo response");
    const content = toolUse.input as Record<string, unknown>;

    const topActions = content.top_actions as unknown[] | undefined;
    const backlinks = content.opportunites_backlinks as unknown[] | undefined;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "local-seo",
      title: `SEO Local — ${backlinks?.length ?? 0} opportunités backlinks · ${topActions?.length ?? 0} actions`,
      summary: String(content.insight ?? "Rapport SEO local et monitoring marque"),
      content,
    });

    return NextResponse.json({ success: true, backlinks: backlinks?.length ?? 0 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    try {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "local-seo",
        title: "Erreur agent SEO local",
        summary: msg.slice(0, 300),
        content: { error: true, message: msg },
      });
    } catch (_) { /* ignore */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
