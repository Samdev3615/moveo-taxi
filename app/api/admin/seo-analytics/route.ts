import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTopQueries, getTopPages } from "@/lib/gsc";
import { getGa4Overview, getGa4TopPages, getGa4TrafficSources, getGa4DailySessions } from "@/lib/ga4";

export const maxDuration = 45;

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ga4Enabled = !!process.env.GA4_REFRESH_TOKEN;
  const gscEnabled = !!process.env.GSC_REFRESH_TOKEN;

  const [
    ga4_7d, ga4_30d, ga4Daily, ga4Pages, ga4Sources,
    gscQueriesRaw, gscPagesRaw,
    { data: auditRows },
    { data: orchRows },
  ] = await Promise.all([
    ga4Enabled ? getGa4Overview(7)           : Promise.resolve(null),
    ga4Enabled ? getGa4Overview(30)          : Promise.resolve(null),
    ga4Enabled ? getGa4DailySessions(30)     : Promise.resolve([]),
    ga4Enabled ? getGa4TopPages(7, 8)        : Promise.resolve(null),
    ga4Enabled ? getGa4TrafficSources(7)     : Promise.resolve(null),
    gscEnabled ? getTopQueries(30, 15)       : Promise.resolve(null),
    gscEnabled ? getTopPages(30, 10)         : Promise.resolve(null),
    supabaseAdmin
      .from("seo_reports")
      .select("content, created_at")
      .eq("agent", "auditor")
      .order("created_at", { ascending: true })
      .limit(10),
    supabaseAdmin
      .from("seo_reports")
      .select("content")
      .eq("agent", "orchestrator")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const scoreHistory = (auditRows ?? [])
    .filter(r => !(r.content as Record<string, unknown>)?.error)
    .map(r => {
      const sc = ((r.content as Record<string, unknown>)?.score ?? {}) as Record<string, unknown>;
      return {
        date: (r.created_at as string).slice(0, 10),
        score: Number(sc.current ?? 0) || null,
        potential: Number(sc.potential ?? 0) || null,
      };
    })
    .filter(r => r.score);

  const latestOrchestrator = (orchRows?.[0]?.content ?? null) as Record<string, unknown> | null;

  const topPages = (ga4Pages ?? []).map(r => ({
    path: r.dimensionValues?.[0]?.value ?? "",
    sessions: Number(r.metricValues?.[0]?.value ?? 0),
    bounceRate: Math.round(Number(r.metricValues?.[2]?.value ?? 0) * 100),
  }));

  const sources = (ga4Sources ?? []).map(r => ({
    channel: r.dimensionValues?.[0]?.value ?? "",
    sessions: Number(r.metricValues?.[0]?.value ?? 0),
  }));

  return NextResponse.json({
    ga4: { overview7d: ga4_7d, overview30d: ga4_30d, daily: ga4Daily ?? [], topPages, sources },
    gsc: { queries: gscQueriesRaw ?? [], pages: gscPagesRaw ?? [] },
    seo: { scoreHistory, latestOrchestrator },
  });
}
