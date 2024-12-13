import { createClient } from '@/utils/supabase/admin'
import { cookies, } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  let referralCode: any = requestUrl.searchParams.get('referralCode')
  const origin = process.env.NEXT_PUBLIC_BASE_URL

  // Use headers() instead of cookies()
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (referralCode) {
    const { data } = await supabase
      .from('referrals')
      .select(`*`)
      .eq('referral_code', referralCode)
      .single()

    if (data) {
      console.log('Referral data:', data)
      referralCode = data
    }
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth-error`)
    }

    if (data.session && data.user) {
      // Check if the user signed in with Google
      const isGoogleUser = data.user.app_metadata.provider === 'google'

      if (isGoogleUser && data.user.email) {
        // Attempt migration only for Google users
        try {
          if (referralCode?.referral_code) {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signup-referral`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: data?.user?.email, referralCode: referralCode?.referral_code }),
            })
          }
        } catch (migrationError) {
          console.error('Error during user migration:', migrationError)
          // Even if migration fails, we'll still redirect to /todos
        }
      }
    }
  }

  // Always redirect to /todos
  return NextResponse.redirect(`${origin}/todos`)
}

export const dynamic = 'force-dynamic'
