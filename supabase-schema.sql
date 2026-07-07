-- Run this SQL in your Supabase project (SQL Editor)

CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  trip_type       TEXT NOT NULL CHECK (trip_type IN ('airport', 'intercity')),
  direction       TEXT CHECK (direction IN ('to_airport', 'from_airport')),

  from_city       TEXT NOT NULL,
  to_city         TEXT NOT NULL,

  date            DATE NOT NULL,
  time            TIME NOT NULL,

  flight_number   TEXT,
  terminal        TEXT,

  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  passengers      INT DEFAULT 1 CHECK (passengers BETWEEN 1 AND 8),

  vehicle_type    TEXT DEFAULT 'sedan' CHECK (vehicle_type IN ('sedan', 'minibus')),
  price_estimate  DECIMAL(10, 2),

  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes           TEXT
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for booking form)
CREATE POLICY "Allow anonymous inserts" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow anonymous reads (for admin — in production, restrict to authenticated users)
CREATE POLICY "Allow reads" ON bookings
  FOR SELECT USING (true);

-- Allow updates (for admin status changes)
CREATE POLICY "Allow updates" ON bookings
  FOR UPDATE USING (true);

-- Index for common queries
CREATE INDEX bookings_status_idx ON bookings(status);
CREATE INDEX bookings_date_idx ON bookings(date);
CREATE INDEX bookings_created_at_idx ON bookings(created_at DESC);
