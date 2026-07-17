-- Table des prix par trajet
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS route_prices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_city text NOT NULL,
  to_city text NOT NULL,
  car4_day integer NOT NULL DEFAULT 0,
  car4_night integer NOT NULL DEFAULT 0,
  car6_day integer NOT NULL DEFAULT 0,
  car6_night integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT route_prices_unique UNIQUE (from_city, to_city)
);

-- Politique d'accès (lecture publique, écriture service_role)
ALTER TABLE route_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON route_prices FOR SELECT USING (true);
CREATE POLICY "Service write" ON route_prices FOR ALL USING (true) WITH CHECK (true);

-- Prix initiaux — Ben Gurion ↔ chaque ville (basés sur tarifs marché × 0,85)
-- car4 = 4 places, car6 = 6 places | day = jour (6h-21h), night = nuit (21h-6h)
INSERT INTO route_prices (from_city, to_city, car4_day, car4_night, car6_day, car6_night) VALUES
  ('ben_gurion', 'lod',           110, 120, 150, 160),
  ('ben_gurion', 'ramla',         130, 140, 180, 190),
  ('ben_gurion', 'rishon',        130, 140, 180, 190),
  ('ben_gurion', 'petah_tikva',   130, 140, 180, 190),
  ('ben_gurion', 'holon',         130, 140, 180, 190),
  ('ben_gurion', 'tel_aviv',      140, 150, 190, 200),
  ('ben_gurion', 'modiin',        140, 150, 190, 200),
  ('ben_gurion', 'bat_yam',       140, 150, 190, 200),
  ('ben_gurion', 'bnei_brak',     140, 150, 190, 200),
  ('ben_gurion', 'rehovot',       140, 150, 190, 200),
  ('ben_gurion', 'herzliya',      170, 180, 230, 240),
  ('ben_gurion', 'raanana',       170, 190, 230, 260),
  ('ben_gurion', 'kfar_saba',     170, 190, 230, 260),
  ('ben_gurion', 'ashdod',        230, 270, 310, 360),
  ('ben_gurion', 'netanya',       230, 270, 310, 360),
  ('ben_gurion', 'jerusalem',     250, 290, 340, 390),
  ('ben_gurion', 'ashkelon',      290, 340, 390, 460),
  ('ben_gurion', 'afula',         430, 510, 580, 690),
  ('ben_gurion', 'beer_sheva',    440, 510, 590, 690),
  ('ben_gurion', 'haifa',         490, 580, 660, 780),
  ('ben_gurion', 'nazareth',      540, 620, 730, 840),
  ('ben_gurion', 'acre',          560, 650, 760, 880),
  ('ben_gurion', 'nahariya',      590, 690, 800, 930),
  ('ben_gurion', 'tiberias',      600, 710, 810, 960),
  ('ben_gurion', 'dimona',        610, 710, 820, 960),
  ('ben_gurion', 'kiryat_shmona', 820, 970, 1110, 1310),
  ('ben_gurion', 'eilat',         1410, 1680, 1900, 2270)
ON CONFLICT (from_city, to_city) DO UPDATE SET
  car4_day = EXCLUDED.car4_day,
  car4_night = EXCLUDED.car4_night,
  car6_day = EXCLUDED.car6_day,
  car6_night = EXCLUDED.car6_night,
  updated_at = now();
