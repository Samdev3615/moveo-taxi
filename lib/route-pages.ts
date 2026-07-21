import type { CityKey } from "./prices";

export interface RoutePage {
  slug: string;
  from: CityKey;
  to: CityKey;
  duration: string;
  distance: number;
}

export const ROUTE_PAGES: RoutePage[] = [
  { slug: "tel-aviv-ben-gurion",    from: "tel_aviv",    to: "ben_gurion", duration: "30 min",    distance: 20 },
  { slug: "jerusalem-ben-gurion",   from: "jerusalem",   to: "ben_gurion", duration: "45 min",    distance: 50 },
  { slug: "haifa-ben-gurion",       from: "haifa",       to: "ben_gurion", duration: "1h 15min",  distance: 95 },
  { slug: "netanya-ben-gurion",     from: "netanya",     to: "ben_gurion", duration: "35 min",    distance: 30 },
  { slug: "beer-sheva-ben-gurion",  from: "beer_sheva",  to: "ben_gurion", duration: "1h",        distance: 90 },
  { slug: "ashdod-ben-gurion",      from: "ashdod",      to: "ben_gurion", duration: "40 min",    distance: 40 },
  { slug: "herzliya-ben-gurion",    from: "herzliya",    to: "ben_gurion", duration: "20 min",    distance: 15 },
  { slug: "rehovot-ben-gurion",     from: "rehovot",     to: "ben_gurion", duration: "25 min",    distance: 25 },
];

export function getRouteBySlug(slug: string): RoutePage | undefined {
  return ROUTE_PAGES.find((r) => r.slug === slug);
}
