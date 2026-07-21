import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const maxDuration = 60;

const VALID_AGENTS = ["writer", "competitor", "auditor", "keywords"];

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

  // Réponse immédiate au navigateur — l'agent tourne en arrière-plan
  after(async () => {
    await fetch(`${baseUrl}/api/agents/${agent}`, {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });
  });

  return NextResponse.json({ triggered: true });
}
