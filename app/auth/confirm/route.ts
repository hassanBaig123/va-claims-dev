import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash'); // Keep using token_hash if required by the link
  const email = searchParams.get('email'); // Email should be part of the link
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  let redirectTo;

  try {
    const parsedUrl = new URL(next, request.url);
    if (parsedUrl.origin === request.nextUrl.origin) {
      redirectTo = request.nextUrl.clone();
      redirectTo.pathname = parsedUrl.pathname;
    } else {
      redirectTo = parsedUrl;
    }
  } catch (error) {
    redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
  }

  if (token_hash && email && type) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash, // Use 'token_hash'
      type
    });

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        redirectTo.searchParams.set('email', user.email);
      } else {
        redirectTo = request.nextUrl.clone();
        redirectTo.pathname = '/auth/auth-code-error';
        return NextResponse.redirect(redirectTo);
      }
      
      return NextResponse.redirect(redirectTo);
    }

    console.error('Error in verifyOtp:', error.message);
  }

  console.error('Error verifying token_hash, email && type:', token_hash, email, type);
  redirectTo = request.nextUrl.clone();
  redirectTo.pathname = '/auth/auth-code-error';
  return NextResponse.redirect(redirectTo);
}
