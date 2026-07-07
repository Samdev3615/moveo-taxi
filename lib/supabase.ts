import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type TripType = "airport" | "intercity";
export type VehicleType = "sedan" | "minibus";

export interface Booking {
  id: string;
  created_at: string;
  trip_type: TripType;
  direction?: "to_airport" | "from_airport";
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  flight_number?: string;
  terminal?: string;
  name: string;
  phone: string;
  email?: string;
  passengers: number;
  vehicle_type: VehicleType;
  price_estimate?: number;
  status: BookingStatus;
  notes?: string;
}

export type BookingInsert = Omit<Booking, "id" | "created_at" | "status"> & {
  status?: BookingStatus;
};
