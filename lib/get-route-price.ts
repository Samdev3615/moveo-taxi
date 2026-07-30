import { supabaseAdmin } from "@/lib/supabase-server";

export type RoutePrice = { sedan: number | null; minibus: number | null };

export async function getRoutePrice(from: string, to: string): Promise<RoutePrice> {
  const { data: exact } = await supabaseAdmin
    .from("route_prices")
    .select("car4_day, car6_day")
    .eq("from_city", from)
    .eq("to_city", to)
    .single();

  if (exact) return { sedan: exact.car4_day || null, minibus: exact.car6_day || null };

  const { data: reverse } = await supabaseAdmin
    .from("route_prices")
    .select("car4_day, car6_day")
    .eq("from_city", to)
    .eq("to_city", from)
    .single();

  if (reverse) return { sedan: reverse.car4_day || null, minibus: reverse.car6_day || null };

  return { sedan: null, minibus: null };
}

export async function getAllRoutePrices(): Promise<Map<string, RoutePrice>> {
  const { data } = await supabaseAdmin
    .from("route_prices")
    .select("from_city, to_city, car4_day, car6_day");

  const map = new Map<string, RoutePrice>();
  for (const row of data ?? []) {
    const price: RoutePrice = { sedan: row.car4_day || null, minibus: row.car6_day || null };
    map.set(`${row.from_city}:${row.to_city}`, price);
    if (!map.has(`${row.to_city}:${row.from_city}`)) {
      map.set(`${row.to_city}:${row.from_city}`, price);
    }
  }
  return map;
}
