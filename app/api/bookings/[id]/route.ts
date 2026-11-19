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

  // Full update (edit mode) vs status-only update
  const isFullUpdate = body._full_update === true;

  const update = isFullUpdate
    ? {
        trip_type:     body.trip_type,
        direction:     body.direction || null,
        from_city:     body.from_city,
        to_city:       body.to_city,
        date:          body.date,
        time:          body.time,
        flight_number: body.flight_number || null,
        terminal:      body.terminal || null,
        name:          body.name,
        phone:         body.phone,
        email:         body.email || null,
        passengers:    body.passengers || 1,
        vehicle_type:  body.vehicle_type === "car6" ? "minibus" : "sedan",
        price_estimate: body.price_estimate ? Number(body.price_estimate) : null,
        status:        body.status || "pending",
        notes:         body.notes || null,
      }
    : body.notes !== undefined
    ? { notes: body.notes }
    : { status: body.status };

  const { error } = await supabaseAdmin
    .from("bookings")
    .update(update)
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
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
