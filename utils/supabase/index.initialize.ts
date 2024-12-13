import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr'

// Initialize Supabase client with admin privileges
export const createAdminClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookies().get(name)?.value
        },
        set: (name: string, value: string, options: CookieOptions) => {
          cookies().set(name, value, options)
        },
        remove: (name: string, options: CookieOptions) => {
          cookies().set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  );
};