import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"
import { createClient } from "./utils/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSupaUser = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return user

}