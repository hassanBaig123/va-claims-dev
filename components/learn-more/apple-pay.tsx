import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import React, { SetStateAction, useEffect, useState } from 'react'
import { successNavigate } from '../subscription-checkout'
import StatusMessages, { useMessages } from './status-message'
import { getSupaUser } from '@/utils'
import { PurchaseProduct } from './paypal'

interface ApplePayProps {
  formId: string
  addOn: PurchaseProduct | null
  applePaymentRequest: any
  allConditions?: any
  selectedProducts: PurchaseProduct[]
  isAdditionalLetterCheckout: boolean
  setApplePaymentRequest: SetStateAction<any>
}

const ApplePay: React.FC<ApplePayProps> = ({
  addOn,
  formId,
  allConditions,
  selectedProducts,
  applePaymentRequest,
  setApplePaymentRequest,
  isAdditionalLetterCheckout,
}) => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [messages, addMessage] = useMessages()
  const [paymentRequestCreated, setPaymentRequestCreated] = useState(false)

  useEffect(() => {
    // Reset the payment request if prices change to update the total amount
    setPaymentRequestCreated(false)
  }, [addOn?.price, selectedProducts?.[0]?.price])

  useEffect(() => {
    if (!stripe || !elements || paymentRequestCreated) {
      return
    }
    const amountSum =
      selectedProducts.reduce((acc, curr) => {
        acc += +curr?.price
        return acc
      }, 0) * 100

    const amount = isAdditionalLetterCheckout
      ? amountSum
      : (+(selectedProducts?.[0]?.price || 0) + +(addOn?.price || 0)) * 100

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: selectedProducts
          .map((product: PurchaseProduct) => product?.name || '')
          .join(', '),
        amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    // Check the availability of the Payment Request API
    pr.canMakePayment().then((result) => {
      if (result) {
        setApplePaymentRequest(pr)
        setPaymentRequestCreated(true) // Mark it as created to avoid recreating unless prices change
      }
    })

    pr.on('paymentmethod', async (e) => {
      try {
        let response
        if (!isAdditionalLetterCheckout) {
          response = await fetch('/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              addOn,
              productId: selectedProducts?.[0]?.id,
              paymentMethodId: e.paymentMethod.id,
              userInfo: {
                email: e.payerEmail,
                firstName: e.payerName?.split(' ')?.[0] || '',
                lastName: e.payerName?.split(' ')?.[1] || '',
              },
            }),
          }).then((r) => r?.json())
        } else {
          const user = await getSupaUser()
          response = await fetch(
            '/api/stripe/create-payment-intent/additional-services/card',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                formId,
                conditions: allConditions,
                userId: user?.user?.id,
                selectedProducts: JSON.stringify(
                  selectedProducts.map((product: PurchaseProduct) => ({
                    name: product?.name,
                    price: product?.price,
                    productId: product?.id,
                  })),
                ),
                paymentMethodId: e.paymentMethod.id,
                userInfo: {
                  email: e.payerEmail,
                  firstName: e.payerName?.split(' ')?.[0] || '',
                  lastName: e.payerName?.split(' ')?.[1] || '',
                },
              }),
            },
          ).then((r) => r?.json())
        }

        if (response?.error) {
          addMessage(response?.error)
          toast({
            title: 'Payment Failed: ',
            description: response?.error,
          })
          e.complete('fail')
          return
        }

        addMessage('Payment Succeeded')
        e.complete('success')
        isAdditionalLetterCheckout
          ? router?.push('/todos')
          : successNavigate({
              addOn,
              router,
              selectedProduct: selectedProducts?.[0],
              installmentSubscriptionId: '',
            })
      } catch (err) {
        console.error(err)
        toast({
          title: 'Payment Failed: ',
          description: err?.toString() || 'An error occurred',
        })
        e.complete('fail')
      }
    })
  }, [
    addOn,
    stripe,
    elements,
    addMessage,
    selectedProducts?.[0],
    setApplePaymentRequest,
    paymentRequestCreated,
  ])

  return (
    <>
      {applePaymentRequest && (
        <PaymentRequestButtonElement
          className="min-w-[200px] rounded-lg overflow-hidden"
          options={{
            paymentRequest: applePaymentRequest,
            style: { paymentRequestButton: { height: '48px' } },
          }}
        />
      )}
      <StatusMessages messages={messages} />
    </>
  )
}

export default ApplePay
