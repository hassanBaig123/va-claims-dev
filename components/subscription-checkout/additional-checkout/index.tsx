import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PaymentMethod from '../payment-method'

import OrderSummary from './order-summary'
import ContactInformation from '../contact-information'
import { handleCardPayment } from '../index'
import { PurchaseProduct } from '@/components/learn-more/paypal'
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import { getUser } from '@/actions/user.server'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'

export interface AddOn {
  id: string
  name: string
  price: number
  description: string
}

interface CheckoutProps {
  formId?: string
  selectedProducts: PurchaseProduct[]
  selectedProduct?: PurchaseProduct | null
  isAdditionalLetterCheckout: boolean
  allConditions?: any
}

export default function AdditionalCheckout({
  formId,
  selectedProducts,
  allConditions,
  isAdditionalLetterCheckout = false,
}: CheckoutProps) {
  const router = useRouter()
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
  const [loading, setLoading] = useState<boolean>(false)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [applePaymentRequest, setApplePaymentRequest] = useState(null)
  const { user } = useSupabaseUser()
  const [userData, setUserData] = useState<{
    avatar_url: string | null
    billing_address: any
    course_state: string | null
    email: string
    form_state: string | null
    full_name: string | null
    id: string
    last_logged_in: string | null
    preferences: any
  } | null>(null)

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method)
  }

  const isPayButtonDisabled = !isFormValid || !isComplete || loading

  const userInfo = {
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zip,
    phone,
  }

  const billing_details = {
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
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const data = await getUser(user.id)
        setUserData(data?.data)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-4 mt-12 md:mt-28 mb-20">
      {/* web view */}
      <h3 className="block text-center text-crimsonNew font-bold text-3xl md:text-5xl font-lexendDeca leading-0 md:leading-[71px]">
        Checkout
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 md:mt-10">
        {/* OrderSummary appears first on mobile */}
        <div className="lg:order-2 order-1">
          <OrderSummary
            {...{
              selectedProducts,
            }}
          />
        </div>
        <div className="lg:col-span-2 lg:order-1 order-2">
          <PaymentMethod
            shouldShowInstallmentsOption={false}
            installmentPerMonth={0}
            {...{
              setErrors,
              formId: '',
              allConditions,
              addOn: null,
              agreedToTerms,
              paymentMethod,
              selectedProducts,
              applePaymentRequest,
              handlePaymentChange,
              setApplePaymentRequest,
              isAdditionalLetterCheckout: true,
            }}
          />
          {paymentMethod === 'card' && (
            <ContactInformation
              userData={userData}
              {...{
                stripe,
                elements,
                CardElement,
                paymentMethod,
                firstName,
                setIsComplete,
                lastName,
                email,
                street,
                phone,
                city,
                state,
                zip,
                errors,
                agreedToTerms,
                setFirstName,
                setLastName,
                setEmail,
                setStreet,
                setPhone,
                setCity,
                setState,
                setZip,
                setErrors,
                setIsFormValid,
                setAgreedToTerms,
              }}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button className="mr-2 max-w-fit min-h-12 rounded-[10px] border px-3 py-2 border-gray-400 px-4 py-2 rounded-[10px] border hover:bg-yellow hover:border-none transition-colors font-semibold">
          Cancel
        </button>
        <button
          className={`bg-yellow max-w-fit min-h-12 rounded-[10px] border px-3 py-2  px-4 py-2 rounded-[10px] transition-colors font-semibold ${
            isPayButtonDisabled
              ? 'opacity-50'
              : 'hover:border-gray-400 hover:bg-white'
          } `}
          onClick={() =>
            paymentMethod === 'card'
              ? handleCardPayment({
                  formId,
                  allConditions,
                  router,
                  stripe,
                  elements,
                  userInfo,
                  CardElement,
                  addOn: null,
                  billing_details,
                  selectedProducts,
                  isAdditionalLetterCheckout,
                  onFailedPayment: () => setLoading(false),
                  onPaymentProcessing: () => setLoading(true),
                })
              : ''
          }
          disabled={isPayButtonDisabled}
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
