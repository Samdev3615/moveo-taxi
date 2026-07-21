import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL_SONNET } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const msg = await anthropic.messages.create({
      model: MODEL_SONNET,
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `You are an SEO competitive analyst for Moveo Taxi (moveotaxi.com), a private taxi service in Israel.

Analyze the competitive landscape for private taxi and transfer services in Israel.

Main competitors to analyze:
- Gett (formerly GetTaxi) — app-based, large network
- Yango (Yandex) — app-based, competitive pricing
- Ben Yehuda Taxi / local companies — traditional
- Sherut (shared taxi) services
- Airport official taxi stands

Return ONLY a valid JSON object:
{
  "competitors": [
    {
      "name": "competitor name",
      "strengths": ["s1", "s2"],
      "weaknesses": ["w1", "w2"],
      "seo_positioning": "how they rank online"
    }
  ],
  "gaps": ["gap SEO 1 en français", "gap 2", "gap 3"],
  "content_topics": ["sujet que les concurrents rankent et que nous devrions cibler"],
  "recommendations": [
    { "priority": "high|medium|low", "action": "action à faire en français", "reason": "raison en français" }
  ],
  "opportunity_score": "note 1-10 pour l'opportunité marché de Moveo Taxi"
}

Write ALL text values in French (except competitor names and keyword strings).`,
      }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const content = JSON.parse(match[0]);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "competitor",
      title: `Analyse concurrentielle — Score opportunité: ${content.opportunity_score}/10`,
      summary: `${content.competitors?.length ?? 0} concurrents analysés. ${content.recommendations?.length ?? 0} recommandations.`,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
