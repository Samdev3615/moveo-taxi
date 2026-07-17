import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendBookingNotification, sendClientConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, phone, from_city, to_city, date, time, trip_type } = body;
    if (!name || !phone || !from_city || !to_city || !date || !time || !trip_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          trip_type: body.trip_type,
          direction: body.direction || null,
          from_city: body.from_city,
          to_city: body.to_city,
          date: body.date,
          time: body.time,
          flight_number: body.flight_number || null,
          terminal: body.terminal || null,
          name: body.name,
          phone: body.phone,
          email: body.email || null,
          passengers: body.passengers || 1,
          vehicle_type: body.vehicle_type === "car6" ? "minibus" : "sedan",
          price_estimate: body.price_estimate || null,
          notes: [
            body.pickup_address ? `Adresse: ${body.pickup_address}` : null,
            body.suitcases > 0 ? `Valises: ${body.suitcases}` : null,
            body.trolleys > 0 ? `Trolleys: ${body.trolleys}` : null,
            body.notes || null,
          ].filter(Boolean).join("\n") || null,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", JSON.stringify(error));
      throw error;
    }

    try {
      await sendBookingNotification({ id: data.id, ...body });
    } catch (emailErr) {
      console.error("Admin notification failed:", emailErr);
    }

    if (body.email) {
      try {
        await sendClientConfirmation({ id: data.id, ...body });
      } catch (emailErr) {
        console.error("Client confirmation failed:", emailErr);
      }
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? "Unknown error";
    console.error("Booking error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
