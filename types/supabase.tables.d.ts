import { Tables } from "../models/supabase/supabase";

export type Customer = Tables<"customers">;
export type User = Tables<"users">;
export type CustomerUser = {
  customer_id: string;
  email: string;
  full_name: string;
  old_user_id: string | null;
  order_count: string | null;
  phone?: string | null;
  user_id: string;
  last_logged_in: string | null
  purchased_plan: string | null
  avatar_url: string | null
}