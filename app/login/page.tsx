'use client'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Loader from '@/components/global/Loader'
import { SubmitButton } from '@/components/submit-button'

import { createClient } from '@/utils/supabase/client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { signInWithMagicLink } from '@/utils/auth-actions'

const supabase = createClient()

// Lazy load GoogleSignInButton
const GoogleSignInButton = dynamic(
  () => import('@/components/global/google-sign-in-button'),
  {
    ssr: false,
  },
)

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading } = useSupabaseUser()

  const [otp, setOtp] = useState(searchParams.get('otp') || '')
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [loading, setLoading] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(!!searchParams.get('otp'))
  const [prefilledEmail, setPrefilledEmail] = useState(
    searchParams.get('email') || '',
  )
  const [signupMessage, setSignupMessage] = useState<
    | { type: 'success' | 'error' | 'warning'; message: React.ReactNode }
    | undefined
  >(undefined)

  const authError = searchParams.get('error') || ''
  const referralCode = searchParams.get('referralCode') || ''

  const handleSendOtp = async (email: string) => {
    if (!isValidEmail(email)) {
      setSignupMessage({ type: 'error', message: 'Invalid email address.' })
      return
    }
    setLoading(true)
    await signInWithMagicLink(email, referralCode)
    setLoading(false)
    setSignupMessage({
      type: 'success',
      message: confirmationMessage({ router }),
    })
    setIsOtpSent(true)
  }

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })
    setLoading(false)
    if (error) {
      setSignupMessage({
        type: 'error',
        message: invalidOTPMessage,
      })
    } else {
      handleSuccessfulLogin()
    }
  }

  const handleSuccessfulLogin = async () => {
    try {
      // Handle referralCode case
      if (referralCode && email) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/signup-referral`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referralCode,
              email: email,
            }),
          },
        )
        if (response?.ok && response?.status === 200) {
          console.log('courses added successfully !!')
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      router.push('/todos')
    }
  }

  const handleResendOtp = () => {
    handleSendOtp(email)
  }

  const handleChangeEmail = () => {
    setIsOtpSent(false)
    setOtp('')
    setSignupMessage(undefined)
    setPrefilledEmail(email)
  }

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase
        .from('referrals')
        .select(`*`)
        .eq('referral_code', referralCode)
        .single()

      if (data) {
        console.log('Referral data:', data)
        setSignupMessage({ type: 'success', message: data.signup_message })
      }
      if (isLoading) {
        return
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (user) {
        router.push('/')
        return
      }
    }

    checkAuth()
  }, [router, isLoading])

  useEffect(() => {
    authError &&
      setSignupMessage({
        type: 'error',
        message: getErrorMessage(authError),
      })
  }, [authError])

  useEffect(() => {
    if (email && otp) {
      setIsOtpSent(true)
    }
  }, [email, otp])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isOtpSent) {
      await handleVerifyOtp(otp)
    } else {
      await handleSendOtp(email)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white flex items-center justify-center min-h-screen fixed z-50 w-full">
        <Loader /> <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full sm:px-8 px-2 justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 w-full">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-md rounded-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png"
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto w-auto"
              priority
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            {signupMessage && (
              <div className="flex justify-center my-4">
                <p
                  className={`${
                    variants[signupMessage.type]
                  } text-center p-2 rounded-sm`}
                >
                  {signupMessage.message}
                </p>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="animate-in flex flex-col w-full sm:w-96 justify-center gap-2 text-foreground"
            >
              {isOtpSent && (
                <div className="text-md mt-4">
                  <span>Email: {email}</span>
                </div>
              )}
              <label
                className="text-md mt-4"
                htmlFor={isOtpSent ? 'One-time Password' : 'email'}
              >
                {isOtpSent ? 'One-time Password' : 'Email'}
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                name={isOtpSent ? 'One-time Password' : 'email'}
                placeholder={
                  isOtpSent ? 'Enter One-time Password' : 'you@example.com'
                }
                required
                value={isOtpSent ? otp : email}
                onChange={(e) =>
                  isOtpSent ? setOtp(e.target.value) : setEmail(e.target.value)
                }
                defaultValue={isOtpSent ? '' : prefilledEmail}
              />
              {isOtpSent && (
                <div className="flex justify-between mb-6">
                  <span
                    className="underline cursor-pointer"
                    onClick={handleResendOtp}
                  >
                    Resend One-time Password
                  </span>
                  <span
                    className="underline cursor-pointer"
                    onClick={handleChangeEmail}
                  >
                    Change Email
                  </span>
                </div>
              )}
              <SubmitButton
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                pendingText={
                  isOtpSent ? 'Verifying...' : 'Sending One-time Password...'
                }
              >
                {loading
                  ? 'Loading....'
                  : isOtpSent
                  ? 'Verify One-time Password'
                  : 'Send One-time Password'}
              </SubmitButton>
              <div className="flex flex-col items-center justify-center space-x-2">
                <span className="text-gray-500 pb-5">or</span>
                <GoogleSignInButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const variants = {
  success: 'bg-lime-500',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500',
}

interface ConfirmationMessageProps {
  router: ReturnType<typeof useRouter>
}

const invalidOTPMessage = (
  <>
    <p>The One-time Password is invalid.</p>
    <p>Please request a new One-time Password.</p>
  </>
)
const confirmationMessage = ({ router }: ConfirmationMessageProps) => (
  <>
    <p>Please check your email for One-time Password.</p>
    <p>
      If you aren't signed up already please{' '}
      <span
        className="underline font-semibold"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          router.push('/#pricing-section')
        }}
      >
        Checkout our packages
      </span>
    </p>
    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-2">
      <strong>Note:</strong> The email might take a few minutes to arrive. If
      you don't see it in your inbox, please check your spam or junk folder.
    </p>
  </>
)

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const getErrorMessage = (errorType: string) => {
  switch (errorType) {
    case 'invalid':
    case 'expired':
    case 'invalid_otp':
      return (
        <>
          <p>The authentication link is invalid.</p>
          <p>Please request a new link.</p>
        </>
      )
    case 'server_error':
      return 'An error occurred on the server. Please try again later.'
    default:
      return ''
  }
}
