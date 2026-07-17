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
  | "ben_gurion"
  | "herzliya"
  | "raanana"
  | "kfar_saba"
  | "modiin"
  | "rehovot"
  | "ashkelon"
  | "nahariya"
  | "acre"
  | "tiberias"
  | "nazareth"
  | "afula"
  | "kiryat_shmona"
  | "dimona"
  | "bat_yam"
  | "holon"
  | "bnei_brak"
  | "lod"
  | "ramla"
  | "beit_shemesh"
  | "hadera"
  | "nes_ziona"
  | "ramat_gan"
  | "kiryat_gat"
  | "tzfat"
  | "rosh_hayin"
  | "hod_hasharon"
  | "ramat_hasharon"
  | "yavne"
  | "kiryat_ata"
  | "bet_shean"
  | "sderot"
  | "arad";

interface CityCoords {
  lat: number;
  lng: number;
}

export const CITY_COORDS: Record<CityKey, CityCoords> = {
  tel_aviv:      { lat: 32.0853, lng: 34.7818 },
  jerusalem:     { lat: 31.7683, lng: 35.2137 },
  haifa:         { lat: 32.7940, lng: 34.9896 },
  beer_sheva:    { lat: 31.2516, lng: 34.7913 },
  eilat:         { lat: 29.5581, lng: 34.9482 },
  netanya:       { lat: 32.3215, lng: 34.8532 },
  ashdod:        { lat: 31.8014, lng: 34.6497 },
  rishon:        { lat: 31.9642, lng: 34.8007 },
  petah_tikva:   { lat: 32.0842, lng: 34.8878 },
  ben_gurion:    { lat: 32.0114, lng: 34.8867 },
  herzliya:      { lat: 32.1658, lng: 34.8433 },
  raanana:       { lat: 32.1866, lng: 34.8706 },
  kfar_saba:     { lat: 32.1781, lng: 34.9065 },
  modiin:        { lat: 31.8969, lng: 35.0095 },
  rehovot:       { lat: 31.8928, lng: 34.8113 },
  ashkelon:      { lat: 31.6688, lng: 34.5742 },
  nahariya:      { lat: 33.0074, lng: 35.0950 },
  acre:          { lat: 32.9234, lng: 35.0688 },
  tiberias:      { lat: 32.7922, lng: 35.5312 },
  nazareth:      { lat: 32.6996, lng: 35.3034 },
  afula:         { lat: 32.6081, lng: 35.2890 },
  kiryat_shmona: { lat: 33.2073, lng: 35.5701 },
  dimona:        { lat: 31.0690, lng: 35.0323 },
  bat_yam:       { lat: 32.0171, lng: 34.7499 },
  holon:         { lat: 32.0114, lng: 34.7798 },
  bnei_brak:     { lat: 32.0840, lng: 34.8338 },
  lod:           { lat: 31.9516, lng: 34.8954 },
  ramla:         { lat: 31.9292, lng: 34.8738 },
  beit_shemesh:  { lat: 31.7469, lng: 34.9928 },
  hadera:        { lat: 32.4338, lng: 34.9193 },
  nes_ziona:     { lat: 31.9298, lng: 34.7983 },
  ramat_gan:     { lat: 32.0684, lng: 34.8248 },
  kiryat_gat:    { lat: 31.6100, lng: 34.7642 },
  tzfat:         { lat: 32.9646, lng: 35.4960 },
  rosh_hayin:    { lat: 32.0956, lng: 34.9553 },
  hod_hasharon:  { lat: 32.1500, lng: 34.8894 },
  ramat_hasharon:{ lat: 32.1457, lng: 34.8403 },
  yavne:         { lat: 31.8779, lng: 34.7434 },
  kiryat_ata:    { lat: 32.8063, lng: 35.1096 },
  bet_shean:     { lat: 32.5034, lng: 35.4975 },
  sderot:        { lat: 31.5236, lng: 34.5965 },
  arad:          { lat: 31.2589, lng: 35.2127 },
};

// Prices for Ben Gurion airport routes — based on competitor market rates × 0.85
// Source: hadartaxi.com pricing (scraped July 2026)
const AIRPORT_PRICES: Record<Exclude<CityKey, "ben_gurion">, { day: number; night: number }> = {
  lod:           { day: 110, night: 120 },
  ramla:         { day: 130, night: 140 },
  rishon:        { day: 130, night: 140 },
  petah_tikva:   { day: 130, night: 140 },
  holon:         { day: 130, night: 140 },
  tel_aviv:      { day: 140, night: 150 },
  modiin:        { day: 140, night: 150 },
  bat_yam:       { day: 140, night: 150 },
  bnei_brak:     { day: 140, night: 150 },
  rehovot:       { day: 140, night: 150 },
  herzliya:      { day: 170, night: 180 },
  raanana:       { day: 170, night: 190 },
  kfar_saba:     { day: 170, night: 190 },
  ashdod:        { day: 230, night: 270 },
  netanya:       { day: 230, night: 270 },
  jerusalem:     { day: 250, night: 290 },
  ashkelon:      { day: 290, night: 340 },
  afula:         { day: 430, night: 510 },
  beer_sheva:    { day: 440, night: 510 },
  haifa:         { day: 490, night: 580 },
  nazareth:      { day: 540, night: 620 },
  acre:          { day: 560, night: 650 },
  nahariya:      { day: 590, night: 690 },
  tiberias:      { day: 600, night: 710 },
  dimona:        { day: 610, night: 710 },
  kiryat_shmona: { day: 820, night: 970 },
  eilat:         { day: 1410, night: 1680 },
  beit_shemesh:  { day: 195,  night: 225  },
  hadera:        { day: 230,  night: 265  },
  nes_ziona:     { day: 130,  night: 145  },
  ramat_gan:     { day: 145,  night: 160  },
  kiryat_gat:    { day: 215,  night: 245  },
  tzfat:         { day: 680,  night: 790  },
  rosh_hayin:    { day: 155,  night: 170  },
  hod_hasharon:  { day: 165,  night: 185  },
  ramat_hasharon:{ day: 155,  night: 175  },
  yavne:         { day: 150,  night: 165  },
  kiryat_ata:    { day: 510,  night: 590  },
  bet_shean:     { day: 480,  night: 560  },
  sderot:        { day: 295,  night: 340  },
  arad:          { day: 500,  night: 580  },
};

// Real road distances in km between city pairs
const ROAD_KM: Record<string, number> = {
  "ben_gurion:tel_aviv": 18,   "ben_gurion:jerusalem": 50,   "ben_gurion:haifa": 100,
  "ben_gurion:beer_sheva": 100, "ben_gurion:eilat": 340,      "ben_gurion:netanya": 35,
  "ben_gurion:ashdod": 55,     "ben_gurion:rishon": 12,       "ben_gurion:petah_tikva": 15,
  "ben_gurion:herzliya": 25,   "ben_gurion:raanana": 35,      "ben_gurion:kfar_saba": 40,
  "ben_gurion:modiin": 40,     "ben_gurion:rehovot": 25,      "ben_gurion:ashkelon": 80,
  "ben_gurion:nahariya": 130,  "ben_gurion:acre": 120,        "ben_gurion:tiberias": 130,
  "ben_gurion:nazareth": 105,  "ben_gurion:afula": 95,        "ben_gurion:kiryat_shmona": 200,
  "ben_gurion:dimona": 130,    "ben_gurion:bat_yam": 20,      "ben_gurion:holon": 20,
  "ben_gurion:bnei_brak": 15,  "ben_gurion:lod": 5,           "ben_gurion:ramla": 8,

  "jerusalem:tel_aviv": 65,    "haifa:tel_aviv": 95,          "beer_sheva:tel_aviv": 90,
  "eilat:tel_aviv": 350,       "netanya:tel_aviv": 30,        "ashdod:tel_aviv": 40,
  "rishon:tel_aviv": 15,       "petah_tikva:tel_aviv": 18,    "herzliya:tel_aviv": 15,
  "raanana:tel_aviv": 25,      "kfar_saba:tel_aviv": 30,      "modiin:tel_aviv": 50,
  "rehovot:tel_aviv": 30,      "ashkelon:tel_aviv": 65,       "nahariya:tel_aviv": 120,
  "acre:tel_aviv": 110,        "tiberias:tel_aviv": 135,      "nazareth:tel_aviv": 100,
  "afula:tel_aviv": 90,        "kiryat_shmona:tel_aviv": 195, "dimona:tel_aviv": 135,
  "bat_yam:tel_aviv": 10,      "holon:tel_aviv": 12,          "bnei_brak:tel_aviv": 8,
  "lod:tel_aviv": 25,          "ramla:tel_aviv": 28,

  "haifa:jerusalem": 155,      "beer_sheva:jerusalem": 85,    "eilat:jerusalem": 310,
  "netanya:jerusalem": 110,    "ashdod:jerusalem": 55,        "rishon:jerusalem": 55,
  "petah_tikva:jerusalem": 60, "herzliya:jerusalem": 75,      "raanana:jerusalem": 80,
  "kfar_saba:jerusalem": 80,   "modiin:jerusalem": 35,        "rehovot:jerusalem": 50,
  "ashkelon:jerusalem": 75,    "nahariya:jerusalem": 200,     "acre:jerusalem": 190,
  "tiberias:jerusalem": 155,   "nazareth:jerusalem": 150,     "afula:jerusalem": 140,
  "kiryat_shmona:jerusalem": 260, "dimona:jerusalem": 120,    "bat_yam:jerusalem": 60,
  "holon:jerusalem": 58,       "bnei_brak:jerusalem": 65,     "lod:jerusalem": 45,
  "ramla:jerusalem": 42,

  "beer_sheva:haifa": 180,     "eilat:haifa": 445,            "netanya:haifa": 55,
  "ashdod:haifa": 140,         "rishon:haifa": 115,           "petah_tikva:haifa": 100,
  "herzliya:haifa": 80,        "raanana:haifa": 75,           "kfar_saba:haifa": 70,
  "modiin:haifa": 130,         "rehovot:haifa": 120,          "ashkelon:haifa": 160,
  "nahariya:haifa": 35,        "acre:haifa": 22,              "tiberias:haifa": 55,
  "nazareth:haifa": 35,        "afula:haifa": 40,             "kiryat_shmona:haifa": 105,
  "dimona:haifa": 240,         "bat_yam:haifa": 120,          "holon:haifa": 115,
  "bnei_brak:haifa": 105,      "lod:haifa": 90,               "ramla:haifa": 95,

  "eilat:beer_sheva": 240,     "netanya:beer_sheva": 145,     "ashdod:beer_sheva": 70,
  "rishon:beer_sheva": 80,     "petah_tikva:beer_sheva": 100, "herzliya:beer_sheva": 115,
  "raanana:beer_sheva": 120,   "kfar_saba:beer_sheva": 120,   "modiin:beer_sheva": 75,
  "rehovot:beer_sheva": 60,    "ashkelon:beer_sheva": 50,     "nahariya:beer_sheva": 230,
  "acre:beer_sheva": 220,      "tiberias:beer_sheva": 200,    "nazareth:beer_sheva": 185,
  "afula:beer_sheva": 175,     "kiryat_shmona:beer_sheva": 295, "dimona:beer_sheva": 35,
  "bat_yam:beer_sheva": 95,    "holon:beer_sheva": 95,        "bnei_brak:beer_sheva": 100,
  "lod:beer_sheva": 90,        "ramla:beer_sheva": 88,

  "netanya:eilat": 370,        "ashdod:eilat": 290,           "rishon:eilat": 340,
  "petah_tikva:eilat": 355,    "herzliya:eilat": 360,         "raanana:eilat": 365,
  "kfar_saba:eilat": 370,      "modiin:eilat": 320,           "rehovot:eilat": 330,
  "ashkelon:eilat": 270,       "nahariya:eilat": 490,         "acre:eilat": 480,
  "tiberias:eilat": 455,       "nazareth:eilat": 435,         "afula:eilat": 430,
  "kiryat_shmona:eilat": 530,  "dimona:eilat": 205,           "bat_yam:eilat": 345,
  "holon:eilat": 342,          "bnei_brak:eilat": 350,        "lod:eilat": 335,
  "ramla:eilat": 332,

  "ashdod:netanya": 70,        "rishon:netanya": 50,          "petah_tikva:netanya": 40,
  "herzliya:netanya": 20,      "raanana:netanya": 20,         "kfar_saba:netanya": 22,
  "modiin:netanya": 75,        "rehovot:netanya": 55,         "ashkelon:netanya": 90,
  "nahariya:netanya": 90,      "acre:netanya": 80,            "tiberias:netanya": 110,
  "nazareth:netanya": 70,      "afula:netanya": 65,           "kiryat_shmona:netanya": 165,
  "dimona:netanya": 175,       "bat_yam:netanya": 45,         "holon:netanya": 43,
  "bnei_brak:netanya": 40,     "lod:netanya": 55,             "ramla:netanya": 55,

  "rishon:ashdod": 30,         "petah_tikva:ashdod": 55,      "herzliya:ashdod": 55,
  "raanana:ashdod": 60,        "kfar_saba:ashdod": 65,        "modiin:ashdod": 60,
  "rehovot:ashdod": 30,        "ashkelon:ashdod": 30,         "nahariya:ashdod": 155,
  "acre:ashdod": 145,          "tiberias:ashdod": 165,        "nazareth:ashdod": 135,
  "afula:ashdod": 130,         "kiryat_shmona:ashdod": 235,   "dimona:ashdod": 95,
  "bat_yam:ashdod": 35,        "holon:ashdod": 35,            "bnei_brak:ashdod": 45,
  "lod:ashdod": 40,            "ramla:ashdod": 40,

  "nahariya:acre": 10,         "tiberias:nazareth": 40,       "tiberias:afula": 35,
  "tiberias:kiryat_shmona": 65,"nazareth:afula": 20,          "nazareth:kiryat_shmona": 95,
  "afula:kiryat_shmona": 80,   "acre:tiberias": 55,
  "acre:nazareth": 40,         "acre:afula": 45,              "acre:kiryat_shmona": 95,
  "nahariya:tiberias": 65,     "nahariya:nazareth": 50,       "nahariya:afula": 55,
  "nahariya:kiryat_shmona": 70,

  "bat_yam:holon": 5,          "bat_yam:bnei_brak": 15,       "bat_yam:rishon": 10,
  "holon:bnei_brak": 12,       "holon:rishon": 12,            "holon:lod": 20,
  "holon:ramla": 22,           "bnei_brak:petah_tikva": 8,    "lod:ramla": 8,
  "lod:petah_tikva": 18,       "ramla:rehovot": 22,           "petah_tikva:herzliya": 18,
  "petah_tikva:raanana": 15,   "petah_tikva:kfar_saba": 12,   "herzliya:raanana": 10,
  "herzliya:kfar_saba": 15,    "raanana:kfar_saba": 8,        "modiin:rehovot": 40,
  "modiin:lod": 30,            "rehovot:rishon": 15,

  "ben_gurion:beit_shemesh": 38,  "ben_gurion:hadera": 55,         "ben_gurion:nes_ziona": 18,
  "ben_gurion:ramat_gan": 20,     "ben_gurion:kiryat_gat": 55,     "ben_gurion:tzfat": 165,
  "ben_gurion:rosh_hayin": 28,    "ben_gurion:hod_hasharon": 32,   "ben_gurion:ramat_hasharon": 25,
  "ben_gurion:yavne": 28,         "ben_gurion:kiryat_ata": 108,    "ben_gurion:bet_shean": 115,
  "ben_gurion:sderot": 80,        "ben_gurion:arad": 115,

  "beit_shemesh:tel_aviv": 55,    "beit_shemesh:jerusalem": 42,    "beit_shemesh:haifa": 145,
  "beit_shemesh:beer_sheva": 95,  "beit_shemesh:modiin": 30,       "beit_shemesh:rehovot": 40,
  "beit_shemesh:ashdod": 55,      "beit_shemesh:ashkelon": 70,

  "hadera:tel_aviv": 65,          "hadera:haifa": 45,              "hadera:netanya": 30,
  "hadera:beer_sheva": 165,       "hadera:herzliya": 45,           "hadera:raanana": 40,
  "hadera:kfar_saba": 35,         "hadera:jerusalem": 140,

  "nes_ziona:tel_aviv": 20,       "nes_ziona:rehovot": 15,         "nes_ziona:rishon": 10,
  "nes_ziona:ashdod": 30,         "nes_ziona:jerusalem": 60,       "nes_ziona:yavne": 18,

  "ramat_gan:tel_aviv": 7,        "ramat_gan:bnei_brak": 5,        "ramat_gan:petah_tikva": 15,
  "ramat_gan:jerusalem": 65,      "ramat_gan:haifa": 95,

  "kiryat_gat:tel_aviv": 60,      "kiryat_gat:beer_sheva": 45,     "kiryat_gat:ashkelon": 25,
  "kiryat_gat:ashdod": 35,        "kiryat_gat:jerusalem": 70,      "kiryat_gat:sderot": 25,

  "tzfat:tel_aviv": 180,          "tzfat:haifa": 55,               "tzfat:tiberias": 50,
  "tzfat:acre": 55,               "tzfat:kiryat_shmona": 40,       "tzfat:nahariya": 60,
  "tzfat:jerusalem": 220,

  "rosh_hayin:tel_aviv": 30,      "rosh_hayin:petah_tikva": 15,    "rosh_hayin:kfar_saba": 20,
  "rosh_hayin:herzliya": 22,      "rosh_hayin:jerusalem": 70,      "rosh_hayin:haifa": 90,

  "hod_hasharon:tel_aviv": 30,    "hod_hasharon:herzliya": 15,     "hod_hasharon:raanana": 8,
  "hod_hasharon:kfar_saba": 12,   "hod_hasharon:netanya": 30,      "hod_hasharon:haifa": 75,

  "ramat_hasharon:tel_aviv": 15,  "ramat_hasharon:herzliya": 10,   "ramat_hasharon:raanana": 15,
  "ramat_hasharon:netanya": 35,   "ramat_hasharon:haifa": 82,

  "yavne:tel_aviv": 30,           "yavne:rehovot": 15,             "yavne:nes_ziona": 18,
  "yavne:ashdod": 22,             "yavne:ashkelon": 40,            "yavne:jerusalem": 55,

  "kiryat_ata:haifa": 10,         "kiryat_ata:acre": 20,           "kiryat_ata:nazareth": 30,
  "kiryat_ata:tel_aviv": 105,     "kiryat_ata:netanya": 55,        "kiryat_ata:afula": 35,

  "bet_shean:tiberias": 28,       "bet_shean:afula": 25,           "bet_shean:haifa": 80,
  "bet_shean:tel_aviv": 110,      "bet_shean:jerusalem": 120,      "bet_shean:nazareth": 40,

  "sderot:tel_aviv": 85,          "sderot:beer_sheva": 30,         "sderot:ashkelon": 15,
  "sderot:ashdod": 40,            "sderot:kiryat_gat": 25,         "sderot:jerusalem": 90,

  "arad:beer_sheva": 35,          "arad:tel_aviv": 130,            "arad:jerusalem": 130,
  "arad:dimona": 25,              "arad:eilat": 155,               "arad:haifa": 215,
};

function getRoadKm(from: CityKey, to: CityKey): number {
  const key1 = `${from}:${to}`;
  const key2 = `${to}:${from}`;
  if (ROAD_KM[key1] !== undefined) return ROAD_KM[key1];
  if (ROAD_KM[key2] !== undefined) return ROAD_KM[key2];
  return haversineKm(CITY_COORDS[from], CITY_COORDS[to]) * 1.3;
}

function haversineKm(a: CityCoords, b: CityCoords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// Intercity pricing formula (non-airport routes)
// Tiered per-km rate: higher for short trips, lower for long-haul
function intercitySedan(km: number, isNight: boolean): number {
  const dayPrice = km <= 50
    ? 100 + km * 3.5
    : 100 + 50 * 3.5 + (km - 50) * 2.8;
  const price = isNight ? dayPrice * 1.15 : dayPrice;
  return Math.max(100, Math.round(price / 10) * 10);
}

export function estimatePrice(
  from: CityKey,
  to: CityKey,
  hour = 10
): { sedan: number; minibus: number } {
  if (from === to) return { sedan: 0, minibus: 0 };

  const isNight = hour >= 21 || hour < 6;

  if (from === "ben_gurion" || to === "ben_gurion") {
    const city = (from === "ben_gurion" ? to : from) as Exclude<CityKey, "ben_gurion">;
    const p = AIRPORT_PRICES[city];
    const sedan = isNight ? p.night : p.day;
    return { sedan, minibus: Math.round((sedan * 1.35) / 10) * 10 };
  }

  const km = getRoadKm(from, to);
  const sedan = intercitySedan(km, isNight);
  return { sedan, minibus: Math.round((sedan * 1.35) / 10) * 10 };
}

export function getPrice(
  from: CityKey,
  to: CityKey,
  vehicle: "sedan" | "minibus"
): number | null {
  if (from === to) return null;
  const prices = estimatePrice(from, to, 10);
  return prices[vehicle] || null;
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
  "herzliya",
  "raanana",
  "kfar_saba",
  "modiin",
  "rehovot",
  "ashkelon",
  "nahariya",
  "acre",
  "tiberias",
  "nazareth",
  "afula",
  "kiryat_shmona",
  "dimona",
  "bat_yam",
  "holon",
  "bnei_brak",
  "lod",
  "ramla",
  "beit_shemesh",
  "hadera",
  "nes_ziona",
  "ramat_gan",
  "kiryat_gat",
  "tzfat",
  "rosh_hayin",
  "hod_hasharon",
  "ramat_hasharon",
  "yavne",
  "kiryat_ata",
  "bet_shean",
  "sderot",
  "arad",
];
