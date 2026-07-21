import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `You are an SEO auditor for Moveo Taxi (moveotaxi.com), an Israeli private taxi service.

Current site structure:
- Homepage (/) — booking widget, hero section, features, testimonials
- /airport — Ben Gurion airport transfers page
- /routes — price grid for intercity routes (Tel Aviv, Jerusalem, Haifa, Beer Sheva, Eilat, Netanya, Ashdod, Rishon)
- /contact — WhatsApp + phone contact
- /about — company info
- /drivers — driver recruitment
- /[locale]/route/[slug] — individual route pages (e.g., tel-aviv-jerusalem)
- 5 languages: he, en, fr, ru, es (hreflang implemented, canonicals set)
- Sitemap.xml submitted to Google Search Console

What IS implemented:
- Canonical URLs, hreflang tags, meta titles/descriptions
- Sitemap.xml
- WhatsApp pre-filled messages in 5 languages
- Booking form with price calculator
- noindex on /confirmation/* pages

What is MISSING:
- Schema.org JSON-LD (LocalBusiness + TaxiService)
- Blog/content section
- Google Business Profile optimization tips
- Internal linking between route pages

Provide a detailed SEO audit. Return ONLY valid JSON:
{
  "critical_issues": [{ "issue": "", "page": "", "fix": "", "impact": "high|medium|low" }],
  "quick_wins": [{ "action": "", "effort": "1h|4h|1d", "impact": "high|medium|low" }],
  "long_term": [{ "action": "", "effort": "1w|1m", "expected_result": "" }],
  "schema_markup": { "recommended": ["LocalBusiness", "TaxiService", "FAQPage"], "priority": "CRITICAL" },
  "content_gaps": ["missing page or topic 1", "gap 2"],
  "score": { "current": "1-100", "potential": "1-100", "main_blocker": "" }
}`,
      }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const content = JSON.parse(match[0]);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "auditor",
      title: `Audit SEO — Score ${content.score?.current ?? "?"}/100 → potentiel ${content.score?.potential ?? "?"}/100`,
      summary: `${content.critical_issues?.length ?? 0} problèmes critiques. ${content.quick_wins?.length ?? 0} gains rapides identifiés.`,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
