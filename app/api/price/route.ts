import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CityKey } from "@/lib/prices";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") as CityKey;
  const to = searchParams.get("to") as CityKey;

  if (!from || !to) {
    return NextResponse.json({ error: "Missing cities" }, { status: 400 });
  }

  // 1. Direction exacte (from → to)
  const { data: exact } = await supabase
    .from("route_prices")
    .select("car4_day, car4_night, car6_day, car6_night")
    .eq("from_city", from)
    .eq("to_city", to)
    .single();

  if (exact) {
    return NextResponse.json(exact);
  }

  // 2. Direction inverse (to → from) — si pas de tarif spécifique dans ce sens
  const { data: reverse } = await supabase
    .from("route_prices")
    .select("car4_day, car4_night, car6_day, car6_night")
    .eq("from_city", to)
    .eq("to_city", from)
    .single();

  if (reverse) {
    return NextResponse.json(reverse);
  }

  // 3. Aucun tarif trouvé — on indique au client qu'on le recontacte
  return NextResponse.json({ no_price: true });
}
