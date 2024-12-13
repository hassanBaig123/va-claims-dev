import { useRouter } from 'next/navigation'
import PaymentMethod from './payment-method'
import { toast } from '@/components/ui/use-toast'
import ContactInformation from './contact-information'
import OrderSummary from './order-summary'
import { useEffect, useState } from 'react'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import { getSupaUser } from '@/utils'
import { PurchaseProduct } from '../learn-more/paypal'
import { getUser } from '@/actions/user.server'

import './subscription-checkout.css'

interface CheckoutProps {
  addOn: PurchaseProduct | null
  selectedProduct: PurchaseProduct
}

export default function Checkout({ addOn, selectedProduct }: CheckoutProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
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

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const data = await getUser(user.id)
        setUserData(data?.data)
      }
    }

    fetchData()
  }, [])

  const addOnsEnabled =
    process.env.NEXT_PUBLIC_ADD_ONS === 'true' &&
    selectedProduct?.name !== 'Expert'

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

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method)
  }
  const formPayments = ['card', 'installments']

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

  const handlePayment = () => {
    if (paymentMethod === formPayments?.[0]) {
      handleCardPayment({
        router,
        stripe,
        elements,
        userInfo,
        CardElement,
        billing_details,
        isAdditionalLetterCheckout: false,
        selectedProducts: [selectedProduct],
        addOn: addOnsEnabled ? addOn : null,
        onFailedPayment: () => setLoading(false),
        onPaymentProcessing: () => setLoading(true),
        isLoggedIn: userData !== null,
      })
    } else if (paymentMethod === formPayments?.[1]) {
      handleCardPayment({
        router,
        stripe,
        elements,
        userInfo,
        CardElement,
        billing_details,
        installmentSubscriptionId:
          selectedProduct?.metadata?.installmentSubscriptionId,
        // priceId: 'price_1QNxCuJxLu9kP7U0ZglGQ1g6',
        isAdditionalLetterCheckout: false,
        selectedProducts: [selectedProduct],
        addOn: addOnsEnabled ? addOn : null,
        onFailedPayment: () => setLoading(false),
        onPaymentProcessing: () => setLoading(true),
        isLoggedIn: userData != null,
      })
    }
  }
  return (
    <div className="container mx-auto p-4 mt-12 md:mt-28 mb-20">
      {/* web view */}
      <h3 className="block text-3xl md:text-5xl pageHeading leading-0 md:leading-[71px]">
        Checkout to Subscription
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 md:mt-10">
        <div className="lg:order-2 order-2">
          <OrderSummary
            {...{
              selectedProduct,
              addOn: addOnsEnabled ? addOn : null,
              installmentMethod: paymentMethod === formPayments?.[1],
            }}
          />
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
              onClick={handlePayment}
              disabled={isPayButtonDisabled}
            >
              {loading ? 'Loading...' : 'Confirm Order'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 lg:order-1 order-1">
          <PaymentMethod
            shouldShowInstallmentsOption={
              selectedProduct.metadata?.installmentSubscriptionId
            }
            {...{
              formId: '',
              setErrors,
              agreedToTerms,
              paymentMethod,
              applePaymentRequest,
              handlePaymentChange,
              setApplePaymentRequest,
              selectedProducts: [selectedProduct],
              addOn: addOnsEnabled ? addOn : null,
              isAdditionalLetterCheckout: false,
              installmentPerMonth: selectedProduct?.price / 100 / 4,
            }}
          />
          {formPayments.includes(paymentMethod) && (
            <ContactInformation
              {...{
                userData: userData,
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
    </div>
  )
}

interface UserInfo {
  email: string
  [key: string]: any
}

interface BillingInfo {
  address: {
    city: string
    line1: string
    postal_code: string
    state: string
  }
  phone: string
  [key: string]: any
}

interface HandleCardPaymentProps {
  router: any
  stripe: any
  elements: any
  formId?: string
  installmentSubscriptionId?: string
  priceId?: string
  CardElement: any
  userInfo: UserInfo
  addOn: PurchaseProduct | null
  allConditions?: any
  onFailedPayment: () => void
  selectedProducts: PurchaseProduct[]
  billing_details: BillingInfo
  onPaymentProcessing: () => void
  isAdditionalLetterCheckout: boolean
  isLoggedIn?: boolean
}

export const handleCardPayment = async ({
  addOn,
  formId,
  allConditions,
  router,
  stripe,
  elements,
  userInfo,
  CardElement,
  installmentSubscriptionId,
  billing_details,
  selectedProducts,
  onFailedPayment,
  onPaymentProcessing,
  isAdditionalLetterCheckout,
  isLoggedIn,
}: HandleCardPaymentProps) => {
  const selectedProduct = selectedProducts?.[0]
  if (!stripe || !elements) {
    console.error('Stripe has not initialized.')
    toast({
      title: 'Error Creating payment intent: ',
      description: 'Payment processing is not available at this moment.',
    })
    return
  }

  const cardElement = elements.getElement(CardElement)
  if (!cardElement) {
    console.error('Card element not found.')
    toast({
      title: 'Error Creating payment intent: ',
      description: 'Payment cannot be processed at this time.',
    })
    return
  }

  onPaymentProcessing()
  const paymentMethodResult = await stripe.createPaymentMethod({
    type: 'card',
    billing_details,
    card: cardElement,
  })

  if (paymentMethodResult.error) {
    console.error(paymentMethodResult.error.message)
    toast({
      title: 'Error Creating payment intent: ',
      description:
        paymentMethodResult.error.message || 'An unknown error occurred.',
    })
    onFailedPayment()
    return
  }
  const user = await getSupaUser()
  let response
  if (!isAdditionalLetterCheckout) {
    response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        addOn,
        userInfo,
        userId: user?.user?.id,
        productId: selectedProduct?.id,
        installmentSubscriptionId,
        // productId: selectedProduct?.productId,
        paymentMethodId: paymentMethodResult?.paymentMethod?.id,
      }),
    })
  } else {
    // const user = await getSupaUser()
    response = await fetch(
      '/api/stripe/create-payment-intent/additional-services/card',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          conditions: allConditions,
          userId: user?.user?.id,
          userInfo,
          selectedProducts: JSON.stringify(
            selectedProducts.map((product) => ({
              name: product?.name,
              price: product?.price,
              productId: product?.id,
            })),
          ),
          paymentMethodId: paymentMethodResult?.paymentMethod?.id,
        }),
      },
    )
  }

  const data = await response.json()

  if (!response.ok) {
    toast({
      title: 'Error Processing payment: ',
      description: data.error || 'Failed to process payment.',
    })
    onFailedPayment()
    return
  }

  if (data.requiresAction) {
    const { error: confirmationError } = await stripe.confirmCardPayment(
      data.clientSecret,
    )
    if (confirmationError) {
      console.error('Error confirming payment:', confirmationError.message)
      toast({
        title: 'Error Processing payment: ',
        description:
          confirmationError.message || 'Payment failed. Please try again.',
      })
      onFailedPayment()
    } else {
      toast({
        title: 'Payment Processed: ',
        description:
          'Payment successful! Please check your email for further instructions.',
      })
      isAdditionalLetterCheckout
        ? router?.push('/todos')
        : successNavigate({
            addOn,
            router,
            selectedProduct,
            installmentSubscriptionId: installmentSubscriptionId || null,
            isLoggedIn,
          })
    }
  } else if (data.success) {
    toast({
      title: 'Payment Processed: ',
      description:
        'Payment successful! Please check your email for further instructions.',
    })
    isAdditionalLetterCheckout
      ? router?.push('/todos')
      : successNavigate({
          addOn,
          router,
          selectedProduct,
          installmentSubscriptionId: installmentSubscriptionId || null,
          isLoggedIn,
        })
  } else {
    toast({
      title: 'Error Processing payment: ',
      description: data.error || 'Payment failed. Please try again.',
    })
    onFailedPayment()
  }
}

interface SuccessNavigateProps {
  addOn: PurchaseProduct | null
  selectedProduct: PurchaseProduct | null
  installmentSubscriptionId: string | null
  isLoggedIn?: boolean | null
  router: { push: (url: string) => void }
}

export const successNavigate = ({
  addOn,
  router,
  selectedProduct,
  installmentSubscriptionId,
  isLoggedIn = false,
}: SuccessNavigateProps) => {
  const qs =
    '?' +
    new URLSearchParams({
      success: 'true',
      productId: selectedProduct?.id || '',
      ...(addOn?.id && { addOnId: addOn?.id }),
      price: installmentSubscriptionId
        ? ((selectedProduct?.price ?? 0) / 100 / 4).toString()
        : ((selectedProduct?.price ?? 0) / 100).toString() || '',
      productName: selectedProduct?.name || '',
    }).toString()

  {
    isLoggedIn ? router?.push('/todos') : router?.push('/purchase-result' + qs)
  }
}
