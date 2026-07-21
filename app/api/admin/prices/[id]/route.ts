import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("route_prices")
    .update({
      car4_day: body.car4_day,
      car4_night: body.car4_night,
      car6_day: body.car6_day,
      car6_night: body.car6_night,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("route_prices")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
