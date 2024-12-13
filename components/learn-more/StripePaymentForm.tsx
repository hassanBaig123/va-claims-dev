import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

interface StripePaymentFormProps {
  onSuccessfulPayment: (paymentMethodId: string) => void
  onPaymentProcessing: () => void
  onFailedPayment: (error: string) => void
  selectedProductId: string
  agreedToTerms: boolean
  productPrice: number
  productDescription: string
  selectedPaymentMethod: string
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  onSuccessfulPayment,
  onPaymentProcessing,
  onFailedPayment,
  selectedProductId,
  agreedToTerms,
  productPrice,
  selectedPaymentMethod,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [zip, setZip] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [street, setStreet] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (event: any) => {
    setIsComplete(event.complete)
  }

  useEffect(() => {
    const allFieldsFilled =
      [firstName, lastName, email, street, city, state, zip, phone].every(
        (field) => field.trim() !== '',
      ) && agreedToTerms
    setIsFormValid(allFieldsFilled)
  }, [
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zip,
    phone,
    agreedToTerms,
  ])

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setIsError(false)

    if (!stripe || !elements) {
      console.error('Stripe has not initialized.')
      setMessage('Payment processing is not available at this moment.')
      setIsError(true)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      console.error('Card element not found.')
      setMessage('Payment cannot be processed at this time.')
      setIsError(true)
      return
    }

    onPaymentProcessing()
    const paymentMethodResult = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: `${firstName} ${lastName}`,
        email,
        address: {
          line1: street,
          city,
          state,
          postal_code: zip,
          country: 'US',
        },
        phone,
      },
    })

    if (paymentMethodResult.error) {
      console.error(paymentMethodResult.error.message)
      onFailedPayment(
        paymentMethodResult.error.message || 'An unknown error occurred.',
      )
      return
    }

    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethodId: paymentMethodResult?.paymentMethod?.id,
        productId: selectedProductId,
        userInfo: {
          firstName,
          lastName,
          email,
          street,
          city,
          state,
          zip,
          phone,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error || 'Failed to process payment.')
      setIsError(true)
      onFailedPayment(data.error || 'Failed to process payment.')
      return
    }

    if (data.requiresAction) {
      const { error: confirmationError } = await stripe.confirmCardPayment(
        data.clientSecret,
      )
      if (confirmationError) {
        console.error('Error confirming payment:', confirmationError.message)
        setMessage(
          confirmationError.message || 'Payment failed. Please try again.',
        )
        setIsError(true)
        onFailedPayment(
          confirmationError.message || 'Payment failed. Please try again.',
        )
      } else {
        setMessage(
          'Payment successful! Please check your email for further instructions.',
        )
        setIsError(false)
        onSuccessfulPayment(paymentMethodResult.paymentMethod.id)
      }
    } else if (data.success) {
      setMessage(
        'Payment successful! Please check your email for further instructions.',
      )
      setIsError(false)
      onSuccessfulPayment(paymentMethodResult.paymentMethod.id)
    } else {
      setMessage(data.error || 'Payment failed. Please try again.')
      setIsError(true)
      onFailedPayment(data.error || 'Payment failed. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={handleInputChange(setFirstName, 'firstName')}
            className="w-full p-2 border rounded text-sm"
          />
          <FieldError {...{ errorMessage: errors?.firstName }} />
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name *"
            value={lastName}
            onChange={handleInputChange(setLastName, 'lastName')}
            className="w-full p-2 border rounded text-sm"
          />
          <FieldError {...{ errorMessage: errors?.lastName }} />
        </div>
      </div>
      <div>
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={handleInputChange(setEmail, 'email')}
          className="w-full p-2 border rounded text-sm"
        />
        <FieldError {...{ errorMessage: errors?.email }} />
      </div>
      <div>
        <input
          type="text"
          placeholder="Street Address *"
          value={street}
          onChange={handleInputChange(setStreet, 'street')}
          className="w-full p-2 border rounded text-sm"
        />
        <FieldError {...{ errorMessage: errors?.street }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <input
            type="text"
            placeholder="City *"
            value={city}
            onChange={handleInputChange(setCity, 'city')}
            className="w-full p-2 border rounded text-sm"
          />
          <FieldError {...{ errorMessage: errors?.city }} />
        </div>
        <div>
          <input
            type="text"
            placeholder="State *"
            value={state}
            onChange={handleInputChange(setState, 'state')}
            className="w-full p-2 border rounded text-sm"
          />
          <FieldError {...{ errorMessage: errors?.state }} />
        </div>
        <div>
          <input
            type="text"
            placeholder="Zip Code *"
            value={zip}
            onChange={handleInputChange(setZip, 'zip')}
            className="w-full p-2 border rounded text-sm"
          />
          <FieldError {...{ errorMessage: errors?.zip }} />
        </div>
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone Number *"
          value={phone}
          onChange={handleInputChange(setPhone, 'phone')}
          className="w-full p-2 border rounded text-sm"
        />
        <FieldError {...{ errorMessage: errors?.phone }} />
      </div>
      {selectedPaymentMethod === 'card' && (
        <div className="mb-4">
          <label
            htmlFor="card-element"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Credit or debit card
          </label>
          <div id="card-element" className="p-2 border rounded">
            <CardElement
              onChange={handleChange}
              options={{ style: { base: { fontSize: '14px' } } }}
            />
          </div>
        </div>
      )}
      {selectedPaymentMethod === 'card' && (
        <button
          type="submit"
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded w-full ${
            isFormValid && isComplete
              ? 'hover:bg-blue-700'
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!isFormValid || !isComplete}
        >
          Pay {formatCurrency(productPrice)}
        </button>
      )}
      {message && (
        <div
          className={`mt-4 p-2 rounded text-sm ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  )
}

export default StripePaymentForm

interface FieldErrorProps {
  errorMessage: string
}

const FieldError: React.FC<FieldErrorProps> = ({ errorMessage }) => (
  <>
    {errorMessage && (
      <p style={{ fontWeight: 500 }} className="text-red-500 text-xs mt-1">
        {errorMessage}
      </p>
    )}
  </>
)

interface TermsCheckProps {
  agreedToTerms: boolean
  errorMessageKey?: string
  errors: { [key: string]: string }
  setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
}

export const TermsCheck: React.FC<TermsCheckProps> = ({
  errors,
  setErrors,
  agreedToTerms,
  setAgreedToTerms,
  errorMessageKey = 'agreedToTerms',
}) => (
  <div>
    <div className="mb-2 flex items-start">
      <input
        id="terms"
        type="checkbox"
        checked={agreedToTerms}
        onChange={(e) => {
          const checked = e.target.checked
          setAgreedToTerms(checked)
          if (checked) {
            setErrors((prev) => ({ ...prev, agreedToTerms: '' }))
          }
        }}
        className="mr-3 mt-1"
        style={{
          transform: 'scale(1.5)',
        }}
      />
      <label htmlFor="terms" className="text-md">
        I have read and agree to the website{' '}
        <Link
          href="/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          terms of service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          privacy policy
        </Link>
      </label>
    </div>
    <FieldError errorMessage={errors?.[errorMessageKey] || ''} />
  </div>
)
