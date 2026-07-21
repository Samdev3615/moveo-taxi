import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "reports") {
    const { data, error } = await supabaseAdmin
      .from("seo_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (type === "posts") {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id, slug, locale, title, excerpt, topic, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (type === "mark-read" && id) {
    const { error } = await supabaseAdmin
      .from("seo_reports")
      .update({ status: "read" })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (type === "post-status" && id) {
    const status = searchParams.get("status");
    if (!["published", "archived", "draft"].includes(status ?? "")) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from("blog_posts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
