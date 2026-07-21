import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("route_prices")
    .select("*")
    .order("from_city")
    .order("to_city");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("route_prices")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
