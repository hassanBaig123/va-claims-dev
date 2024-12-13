import { cookies } from 'next/headers'
import { isValidURL } from '@/utils/helpers'
import { NextRequest, NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { validateSignature } from '@/utils/auth' // Assuming auth.ts is in the utils folder

export async function GET(request: NextRequest) {
  console.log('GET request to /auth/confirm', request.url)
  const origin = process.env.NEXT_PUBLIC_BASE_URL
  const { searchParams } = new URL(request.url)
  console.log('searchParams', searchParams)
  const token_hash = searchParams.get('token') // Changed from 'token_hash' to 'token'
  console.log('token_hash', token_hash)
  const type = searchParams.get('type') as EmailOtpType | null
  console.log('type', type)
  let next = searchParams.get('redirect_to') ?? '/' // Changed from 'next' to 'redirect_to'
  console.log('next', next)

  // New parameters for signed URL
  const target = searchParams.get('target')
  console.log('target', target)
  const expires = searchParams.get('expires')
  console.log('expires', expires)
  const signature = searchParams.get('signature')
  console.log('signature', signature)

  let referralCode = ""

  const isValidateURL = isValidURL(next)

  if (isValidateURL) {
    const { searchParams: nextURLParams } = new URL(next)
    referralCode = nextURLParams.get('referralCode') || ""
    if (referralCode) {
      next = next.split('?')?.[0]
    }
  }

  let redirectTo: URL
  //@ts-ignore
  console.log('redirectTo 1', redirectTo)

  try {
    console.log('try', next, request.url)
    redirectTo = new URL(next, request.url)
    console.log('try 1', redirectTo, redirectTo.origin, request.nextUrl.origin)
  } catch (error) {
    redirectTo = new URL('/', origin)
    console.log('redirectTo 3', redirectTo)
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      },
    },
  )

  // Handle signed URL case
  if (target && expires && signature) {
    // Check if the link has expired
    const expirationTime = parseInt(expires, 10)
    if (Date.now() / 1000 > expirationTime) {
      console.error('Link has expired')
      redirectTo = new URL('/login', origin)
      redirectTo.searchParams.set('error', 'expired')
      console.log('redirectTo 4', redirectTo)
      return NextResponse.redirect(redirectTo)
    }

    // Validate the signature
    try {
      if (!validateSignature(decodeURIComponent(target), expires, signature)) {
        console.error('Invalid signature')
        redirectTo = new URL('/login', origin)
        redirectTo.searchParams.set('error', 'invalid')
        console.log('redirectTo 5', redirectTo)
        return NextResponse.redirect(redirectTo)
      }
    } catch (error) {
      console.error('Error validating signature:', error)
      redirectTo = new URL('/login', origin)
      redirectTo.searchParams.set('error', 'server_error')
      console.log('redirectTo 6', redirectTo)
      return NextResponse.redirect(redirectTo)
    }

    // If we've made it this far, the link is valid. Now check authentication.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (user) {
      // User is logged in, redirect to the target page
      // Handle referralCode case
      if (referralCode && user?.email) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/signup-referral`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referralCode,
              email: user?.email,
            }),
          },
        )
        if (response?.ok && response?.status === 200) {
          console.log('courses added successfully !!')
        }
      }
      redirectTo = new URL(decodeURIComponent(target), origin)
      console.log('redirectTo 7', redirectTo)
      return NextResponse.redirect(redirectTo)
    } else {
      // User is not logged in, redirect to login page with return URL
      redirectTo = new URL('/login', origin)
      redirectTo.searchParams.set('returnUrl', decodeURIComponent(target))
      console.log('redirectTo 8', redirectTo)
      return NextResponse.redirect(redirectTo)
    }
  }

  // Handle OTP verification case
  if (token_hash && type) {
    const { error, data: { user } } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })
    if (error) {
      console.error('Error verifying OTP:', error)
      redirectTo = new URL('/login', origin)
      redirectTo.searchParams.set('error', 'invalid_otp')
      console.log('redirectTo 9', redirectTo)
      return NextResponse.redirect(redirectTo)
    }

    // Handle referralCode case
    if (referralCode && user?.email) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/signup-referral`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode,
            email: user?.email,
          }),
        },
      )
      if (response?.ok && response?.status === 200) {
        console.log('courses added successfully !!')
      }
    }
  }

  console.log('redirectTo 10', redirectTo)
  return NextResponse.redirect(redirectTo)
}
