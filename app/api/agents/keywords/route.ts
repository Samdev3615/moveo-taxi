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
        content: `You are a keyword research specialist for Moveo Taxi, an Israeli private taxi service covering:
- Ben Gurion Airport transfers
- Intercity routes: Tel Aviv, Jerusalem, Haifa, Beer Sheva, Eilat, Netanya, Ashdod, Rishon LeZion
- 5 languages: Hebrew, English, French, Russian, Spanish
- Target: tourists, immigrants, business travelers, families

Research keyword opportunities across all 5 languages.

Return ONLY valid JSON:
{
  "high_intent": [
    { "keyword": "exact keyword", "locale": "en|fr|he|ru|es", "volume": "high|medium|low", "intent": "booking" }
  ],
  "informational": [
    { "keyword": "exact keyword", "locale": "en|fr|he|ru|es", "content_angle": "what blog post to write" }
  ],
  "long_tail": [
    { "keyword": "exact keyword", "locale": "en|fr|he|ru|es", "difficulty": "low|medium", "opportunity": "why" }
  ],
  "hebrew_specific": [
    { "keyword": "Hebrew keyword in Hebrew script", "transliteration": "", "intent": "" }
  ],
  "top_5_priority": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "insight": "1 key strategic insight for Moveo Taxi SEO"
}

Include at least 5 keywords per category, mixing all 5 languages.`,
      }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const content = JSON.parse(match[0]);

    const totalKeywords =
      (content.high_intent?.length ?? 0) +
      (content.informational?.length ?? 0) +
      (content.long_tail?.length ?? 0);

    await supabaseAdmin.from("seo_reports").insert({
      agent: "keywords",
      title: `Recherche mots-clés — ${totalKeywords} opportunités identifiées`,
      summary: content.insight ?? `Top 5: ${(content.top_5_priority ?? []).join(", ")}`,
      content,
    });

    return NextResponse.json({ success: true, total: totalKeywords });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
