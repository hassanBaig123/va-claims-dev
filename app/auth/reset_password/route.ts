import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = process.env.NEXT_PUBLIC_BASE_URL
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${origin}/signin/forgot_password`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again.",
        ),
      )
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${origin}/signin/update_password`,
      'You are now signed in.',
      'Please enter a new password for your account.',
    ),
  )
}
