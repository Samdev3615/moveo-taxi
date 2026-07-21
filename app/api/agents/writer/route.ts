import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";

const TOPICS = [
  { slug: "taxi-aeroport-ben-gourion", topic: "taxi transfers from Ben Gurion Airport to Israeli cities" },
  { slug: "taxi-tel-aviv-jerusalem", topic: "taxi from Tel Aviv to Jerusalem: private transfer vs public transport" },
  { slug: "taxi-nuit-israel", topic: "night taxi travel in Israel: safety tips and how to book" },
  { slug: "taxi-groupe-minibus", topic: "group taxi and minibus rentals in Israel for families and groups" },
  { slug: "taxi-eilat", topic: "taxi to Eilat from Tel Aviv and Jerusalem: complete guide" },
  { slug: "prix-taxi-israel", topic: "taxi fares in Israel: complete price guide in NIS" },
  { slug: "taxi-touriste-israel", topic: "taxi guide for tourists in Israel: everything you need to know" },
  { slug: "taxi-vs-train-aeroport", topic: "taxi vs train from Ben Gurion Airport: honest comparison" },
  { slug: "taxi-haifa", topic: "taxi from Haifa to Ben Gurion Airport and Tel Aviv" },
  { slug: "taxi-mer-morte", topic: "day trip taxi to the Dead Sea from Tel Aviv and Jerusalem" },
  { slug: "taxi-reserve-avance", topic: "why you should pre-book your taxi in Israel" },
  { slug: "taxi-conseils-aeroport", topic: "10 tips for taking a taxi at Ben Gurion Airport" },
];

const LOCALES = [
  { code: "en", lang: "English" },
  { code: "fr", lang: "French" },
  { code: "he", lang: "Hebrew" },
  { code: "ru", lang: "Russian" },
  { code: "es", lang: "Spanish" },
];

function getWeekTopic() {
  const start = new Date(new Date().getFullYear(), 0, 1).getTime();
  const week = Math.floor((Date.now() - start) / (7 * 24 * 60 * 60 * 1000));
  return TOPICS[week % TOPICS.length];
}

async function generateForLocale(topic: string, slug: string, locale: string, lang: string) {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `You are an SEO content writer for Moveo Taxi, a premium private taxi service in Israel.
Write a blog post in ${lang} about: "${topic}"

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "title": "SEO-optimized title (50-60 characters)",
  "excerpt": "Meta description (140-160 characters)",
  "content": "Full blog post in HTML using <h2>, <p>, <ul>, <li> tags (400-600 words)"
}

Requirements:
- Write entirely in ${lang}
- Focus on Israeli taxi market: Ben Gurion airport, Tel Aviv, Jerusalem, Haifa, Eilat
- Include realistic NIS prices (airport taxi ~140-250₪, intercity varies)
- Mention Moveo Taxi 2-3 times naturally
- SEO-optimized with natural keyword usage
- Practical, trustworthy tone`,
    }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON for ${locale}`);
  const parsed = JSON.parse(match[0]);

  return {
    slug: `${slug}-${locale}`,
    locale,
    title: parsed.title as string,
    excerpt: parsed.excerpt as string,
    content: parsed.content as string,
    topic,
    status: "draft",
  };
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, topic } = getWeekTopic();

    const results = await Promise.allSettled(
      LOCALES.map(({ code, lang }) => generateForLocale(topic, slug, code, lang))
    );

    const posts = results
      .filter((r): r is PromiseFulfilledResult<ReturnType<typeof generateForLocale> extends Promise<infer T> ? T : never> => r.status === "fulfilled")
      .map((r) => r.value);

    if (posts.length === 0) throw new Error("All locale generations failed");

    const { error } = await supabaseAdmin
      .from("blog_posts")
      .upsert(posts, { onConflict: "slug,locale" });
    if (error) throw error;

    await supabaseAdmin.from("seo_reports").insert({
      agent: "writer",
      title: `Article rédigé: ${posts[0]?.title ?? topic}`,
      summary: `${posts.length}/5 langues générées. Slug de base: ${slug}`,
      content: { topic, slug, posts: posts.map((p) => ({ locale: p.locale, title: p.title })) },
    });

    return NextResponse.json({ success: true, slug, generated: posts.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
