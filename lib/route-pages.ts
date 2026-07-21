import type { CityKey } from "./prices";

export interface RoutePage {
  slug: string;
  from: CityKey;
  to: CityKey;
  duration: string;
  distance: number;
}

export const ROUTE_PAGES: RoutePage[] = [
  // Aéroport Ben Gurion
  { slug: "tel-aviv-ben-gurion",      from: "tel_aviv",    to: "ben_gurion", duration: "30 min",    distance: 20  },
  { slug: "jerusalem-ben-gurion",     from: "jerusalem",   to: "ben_gurion", duration: "45 min",    distance: 50  },
  { slug: "haifa-ben-gurion",         from: "haifa",       to: "ben_gurion", duration: "1h 15min",  distance: 95  },
  { slug: "netanya-ben-gurion",       from: "netanya",     to: "ben_gurion", duration: "35 min",    distance: 30  },
  { slug: "beer-sheva-ben-gurion",    from: "beer_sheva",  to: "ben_gurion", duration: "1h",        distance: 90  },
  { slug: "ashdod-ben-gurion",        from: "ashdod",      to: "ben_gurion", duration: "40 min",    distance: 40  },
  { slug: "herzliya-ben-gurion",      from: "herzliya",    to: "ben_gurion", duration: "20 min",    distance: 15  },
  { slug: "rehovot-ben-gurion",       from: "rehovot",     to: "ben_gurion", duration: "25 min",    distance: 25  },
  { slug: "eilat-ben-gurion",         from: "eilat",       to: "ben_gurion", duration: "3h 30min",  distance: 340 },
  { slug: "nahariya-ben-gurion",      from: "nahariya",    to: "ben_gurion", duration: "1h 30min",  distance: 130 },
  { slug: "tiberias-ben-gurion",      from: "tiberias",    to: "ben_gurion", duration: "1h 30min",  distance: 130 },
  { slug: "modiin-ben-gurion",        from: "modiin",      to: "ben_gurion", duration: "30 min",    distance: 40  },
  { slug: "petah-tikva-ben-gurion",   from: "petah_tikva", to: "ben_gurion", duration: "20 min",    distance: 15  },
  // Inter-urbain populaires
  { slug: "tel-aviv-jerusalem",       from: "tel_aviv",    to: "jerusalem",  duration: "1h 10min",  distance: 65  },
  { slug: "tel-aviv-haifa",           from: "tel_aviv",    to: "haifa",      duration: "1h",        distance: 95  },
  { slug: "tel-aviv-beer-sheva",      from: "tel_aviv",    to: "beer_sheva", duration: "1h 10min",  distance: 90  },
  { slug: "tel-aviv-eilat",           from: "tel_aviv",    to: "eilat",      duration: "3h 30min",  distance: 350 },
  { slug: "tel-aviv-netanya",         from: "tel_aviv",    to: "netanya",    duration: "35 min",    distance: 30  },
  { slug: "jerusalem-haifa",          from: "jerusalem",   to: "haifa",      duration: "1h 30min",  distance: 155 },
  { slug: "jerusalem-beer-sheva",     from: "jerusalem",   to: "beer_sheva", duration: "1h 05min",  distance: 85  },
  { slug: "jerusalem-eilat",          from: "jerusalem",   to: "eilat",      duration: "3h 10min",  distance: 310 },
  { slug: "haifa-tel-aviv",           from: "haifa",       to: "tel_aviv",   duration: "1h",        distance: 95  },
  { slug: "haifa-netanya",            from: "haifa",       to: "netanya",    duration: "30 min",    distance: 55  },
  { slug: "beer-sheva-eilat",         from: "beer_sheva",  to: "eilat",      duration: "2h 10min",  distance: 240 },
];

export function getRouteBySlug(slug: string): RoutePage | undefined {
  return ROUTE_PAGES.find((r) => r.slug === slug);
}
