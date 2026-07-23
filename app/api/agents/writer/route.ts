import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import { MOVEO_TAXI_BRIEF } from "@/lib/seo-agent-context";

export const maxDuration = 300;

// Sujets alignés avec les services réels de Moveo Taxi (aéroport + intercités)
const TOPICS = [
  { slug: "transfert-aeroport-ben-gourion", topic: "private taxi transfer from Ben Gurion Airport: complete guide (Moveo Taxi prices, booking, tips)" },
  { slug: "taxi-ben-gurion-tel-aviv", topic: "Ben Gurion Airport to Tel Aviv by private taxi: prices, duration, what to expect (140₪ fixed rate)" },
  { slug: "taxi-ben-gurion-jerusalem", topic: "Ben Gurion Airport to Jerusalem private taxi: fixed price 250₪, night rates, booking guide" },
  { slug: "taxi-ben-gurion-haifa", topic: "Ben Gurion Airport to Haifa private taxi: 490₪ fixed rate, 1h15 drive, how to book" },
  { slug: "taxi-ben-gurion-eilat", topic: "Ben Gurion Airport to Eilat private taxi: 1410₪, 3h30, the cheapest and most comfortable option" },
  { slug: "pourquoi-reserver-taxi-avance-israel", topic: "Why pre-booking your taxi in Israel saves money and stress vs showing up at the airport" },
  { slug: "taxi-vs-train-aeroport-ben-gurion", topic: "Private taxi vs. train from Ben Gurion Airport: honest comparison for 2025 (prices, comfort, convenience)" },
  { slug: "suivi-vol-taxi-aeroport", topic: "Flight tracking for airport taxis in Israel: how Moveo Taxi waits for free if your flight is delayed" },
  { slug: "taxi-groupe-israel-minibus", topic: "Group transfer in Israel: when to book a minibus vs sedan (families, groups of 5-6)" },
  { slug: "taxi-ben-gurion-beer-sheva", topic: "Ben Gurion Airport to Beer Sheva private taxi: 440₪, 1 hour, guide for Negev travelers" },
  { slug: "taxi-ben-gurion-netanya", topic: "Ben Gurion Airport to Netanya private taxi: 230₪, 35 minutes, best option for the coast" },
  { slug: "taxi-intercite-tel-aviv-jerusalem", topic: "Tel Aviv to Jerusalem private taxi: fixed price ~320₪, 1h10, book in advance vs on-demand" },
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
    max_tokens: 2000,
    tools: [{
      name: "save_article",
      description: "Save the SEO blog article for Moveo Taxi",
      input_schema: {
        type: "object" as const,
        properties: {
          title: { type: "string", description: "SEO-optimized title, 50-60 characters" },
          excerpt: { type: "string", description: "Meta description, 140-160 characters" },
          content: { type: "string", description: "Full blog post in HTML using h2, p, ul, li tags (400-600 words)" },
        },
        required: ["title", "excerpt", "content"],
      },
    }],
    tool_choice: { type: "any" as const },
    messages: [{
      role: "user",
      content: `You are Sophie Laurent, SEO content writer for Moveo Taxi. You know the company inside out.

${MOVEO_TAXI_BRIEF}

Your task: Write a blog post in ${lang} about this topic:
"${topic}"

STRICT RULES:
- Write ONLY about services Moveo Taxi actually offers (airport transfers + intercity private taxi)
- NEVER mention street taxis, meters (compteurs), Uber/Gett, shared rides, intra-city rides
- Use ONLY the real Moveo Taxi prices listed in the brief above — no invented prices
- Present Moveo Taxi as the solution naturally (2-3 mentions)
- Write entirely in ${lang}
- SEO-optimized with natural keyword usage
- Practical, trustworthy, expert tone

Call the save_article tool with your response.`,
    }],
  });

  const toolUse = msg.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") throw new Error(`No tool_use block for ${locale}`);
  const input = toolUse.input as { title: string; excerpt: string; content: string };

  return {
    slug: `${slug}-${locale}`,
    locale,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
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

    if (posts.length === 0) {
      const firstErr = results.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      const reason = firstErr?.reason instanceof Error ? firstErr.reason.message : String(firstErr?.reason ?? "unknown");
      throw new Error(`All locale generations failed. First error: ${reason}`);
    }

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
    try {
      await supabaseAdmin.from("seo_reports").insert({
        agent: "writer",
        title: "Erreur rédacteur",
        summary: msg.slice(0, 300),
        content: { error: true, message: msg },
      });
    } catch (_) { /* ignore */ }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
