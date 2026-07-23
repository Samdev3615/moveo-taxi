import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const maxDuration = 300;

const VALID_AGENTS = ["writer", "competitor", "auditor", "keywords", "orchestrator", "local-seo"];

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent");

  if (!agent || !VALID_AGENTS.includes(agent)) {
    return NextResponse.json({ error: "Invalid agent" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moveotaxi.com";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/api/agents/${agent}`, {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });
    if (!res.ok) {
      const body = await res.text();
      await supabaseAdmin.from("seo_reports").insert({
        agent,
        title: `Erreur trigger — ${agent} (HTTP ${res.status})`,
        summary: body.slice(0, 300),
        content: { error: true, status: res.status, body: body.slice(0, 1000) },
      });
      return NextResponse.json({ error: body }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ triggered: true, ...data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabaseAdmin.from("seo_reports").insert({
      agent,
      title: `Erreur réseau — ${agent}`,
      summary: msg.slice(0, 300),
      content: { error: true, message: msg },
    });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
