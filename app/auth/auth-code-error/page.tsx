import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

export default function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: { [key: string]: string } = {
    expired: 'The authentication link has expired. Please request a new one.',
    invalid: 'The authentication link is invalid. Please try again or request a new link.',
    invalid_otp: 'The provided one-time password is invalid. Please try again or request a new one.',
    server_error: 'An error occurred on the server. Please try again later.',
  }

  const error = searchParams.error
  const errorMessage = error ? errorMessages[error] : 'An unknown error occurred.'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
}