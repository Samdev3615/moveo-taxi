export type CityKey =
  | "tel_aviv"
  | "jerusalem"
  | "haifa"
  | "beer_sheva"
  | "eilat"
  | "netanya"
  | "ashdod"
  | "rishon"
  | "petah_tikva"
  | "ben_gurion";

// Fixed prices in NIS (sedan). Minibus = sedan * 1.5
const PRICES: Partial<Record<CityKey, Partial<Record<CityKey, number>>>> = {
  tel_aviv: {
    jerusalem: 250,
    haifa: 220,
    beer_sheva: 230,
    eilat: 750,
    netanya: 150,
    ashdod: 160,
    rishon: 80,
    petah_tikva: 90,
    ben_gurion: 140,
  },
  jerusalem: {
    tel_aviv: 250,
    haifa: 320,
    beer_sheva: 220,
    eilat: 700,
    netanya: 280,
    ashdod: 200,
    rishon: 220,
    petah_tikva: 240,
    ben_gurion: 180,
  },
  haifa: {
    tel_aviv: 220,
    jerusalem: 320,
    beer_sheva: 350,
    eilat: 950,
    netanya: 100,
    ashdod: 280,
    rishon: 240,
    petah_tikva: 210,
    ben_gurion: 200,
  },
  beer_sheva: {
    tel_aviv: 230,
    jerusalem: 220,
    haifa: 350,
    eilat: 450,
    netanya: 300,
    ashdod: 150,
    rishon: 200,
    petah_tikva: 220,
    ben_gurion: 250,
  },
  eilat: {
    tel_aviv: 750,
    jerusalem: 700,
    haifa: 950,
    beer_sheva: 450,
    netanya: 800,
    ashdod: 680,
    rishon: 730,
    petah_tikva: 760,
    ben_gurion: 730,
  },
  ben_gurion: {
    tel_aviv: 140,
    jerusalem: 180,
    haifa: 200,
    beer_sheva: 250,
    eilat: 730,
    netanya: 160,
    ashdod: 170,
    rishon: 120,
    petah_tikva: 130,
  },
};

export function getPrice(
  from: CityKey,
  to: CityKey,
  vehicle: "sedan" | "minibus"
): number | null {
  const base = PRICES[from]?.[to] ?? PRICES[to]?.[from];
  if (!base) return null;
  return vehicle === "minibus" ? Math.round(base * 1.5) : base;
}

export const CITIES: CityKey[] = [
  "tel_aviv",
  "jerusalem",
  "haifa",
  "beer_sheva",
  "eilat",
  "netanya",
  "ashdod",
  "rishon",
  "petah_tikva",
  "ben_gurion",
];
