import React, { useState } from 'react'
import ApplePay from '../learn-more/apple-pay'
import DebitCardIcon from '../icons/debit-card'
import { toast } from '@/components/ui/use-toast'
import PayPalComponent, { PurchaseProduct } from '../learn-more/paypal'

import './subscription-checkout.css'

interface PaymentMethodProps {
  formId: string
  allConditions?: any
  addOn: PurchaseProduct | null
  paymentMethod: string
  agreedToTerms: boolean
  applePaymentRequest: any
  selectedProducts: PurchaseProduct[]
  setErrors: React.Dispatch<any>
  isAdditionalLetterCheckout: boolean
  setApplePaymentRequest: React.Dispatch<any>
  handlePaymentChange: (method: string) => void
  installmentPerMonth: number
  shouldShowInstallmentsOption: boolean
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  addOn,
  formId,
  allConditions,
  setErrors,
  agreedToTerms,
  paymentMethod,
  selectedProducts,
  applePaymentRequest,
  handlePaymentChange,
  setApplePaymentRequest,
  isAdditionalLetterCheckout,
  installmentPerMonth,
  shouldShowInstallmentsOption = true,
}) => {
  const [showInstallments, setShowInstallments] = useState(false)

  const today = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  // Format today's date
  const formattedToday = today.toLocaleDateString('en-US', options)

  // Create a new date for the 2nd installment (next month)
  const nextMonth = new Date(today)
  nextMonth.setMonth(today.getMonth() + 1)
  const formattedNextMonth = nextMonth.toLocaleDateString('en-US', options)

  // Create a new date for the 3rd installment (next month from the 2nd)
  const nextMonthFromNext = new Date(nextMonth)
  nextMonthFromNext.setMonth(nextMonth.getMonth() + 1)
  const formattedNextFromNext = nextMonthFromNext.toLocaleDateString(
    'en-US',
    options,
  )
  const nextMonthFourthNext = new Date(nextMonthFromNext)
  nextMonthFourthNext.setMonth(nextMonthFourthNext.getMonth() + 1)
  const formattedFourthNext = nextMonthFourthNext.toLocaleDateString(
    'en-US',
    options,
  )

  const handleInstallmentButton = (method: string) => {
    handlePaymentChange(method)
    setShowInstallments(true)
  }

  return (
    <div className="mb-10">
      <h4 className="text-oxfordBlue font-semibold text-lg mb-2.5">
        Payment Method
      </h4>
      <div className="paymentBtnDiv">
        <div className="defaultMethodBtns">
          {paymentMethods({
            addOn,
            formId,
            allConditions,
            selectedProducts,
            applePaymentRequest,
            setApplePaymentRequest,
            isAdditionalLetterCheckout,
          }).map(({ title, icon, name = '', render, btnClasses = '' }) => (
            <>
              {render ? (
                render
              ) : (
                <button
                  key={name}
                  // className={`mb-[7px] min-w-fit min-h-[54px] flex justify-center items-center rounded-[10px] border pl-2 pr-3 border-gray-400 px-4 rounded-[10px] border ${
                  //   paymentMethod === name ? 'bg-yellow' : 'border-gray-400'
                  // }
                  className={`paymentBtn  ${
                    paymentMethod === name ? 'bg-yellow' : ''
                  } 
                transition-colors ${btnClasses}`}
                  style={{ border: paymentMethod === name ? 'none' : '' }}
                  onClick={() => {
                    if (!agreedToTerms) {
                      setErrors({
                        agreedToTerms: 'You must agree to the terms',
                      })
                      toast({
                        title: 'Error:',
                        description:
                          'You must agree to the terms and conditions.',
                      })
                    } else {
                      handlePaymentChange(name)
                      setShowInstallments(false)
                    }
                  }}
                >
                  {icon}
                  <span className="btnTitle">{title}</span>
                </button>
              )}
            </>
          ))}
        </div>
        {shouldShowInstallmentsOption && (
          <>
            {' '}
            <p>Or</p>
            <button
              className={`paymentBtnLast  ${
                paymentMethod === 'installments' ? 'bg-yellow' : ''
              } 
          transition-colors`}
              style={{ border: paymentMethod === 'installments' ? 'none' : '' }}
              onClick={() => {
                if (!agreedToTerms) {
                  setErrors({ agreedToTerms: 'You must agree to the terms' })
                  toast({
                    title: 'Error:',
                    description: 'You must agree to the terms and conditions.',
                  })
                } else {
                  handleInstallmentButton('installments')
                }
              }}
            >
              <DebitCardIcon />
              <span className="btnTitle">
                {'Pay in 4 Interest-Free Payments '}
              </span>
            </button>{' '}
          </>
        )}
      </div>
      {showInstallments && (
        <div className="installmentsPlansInfo">
          <p className="installmentHeading">Partial Payments Plan</p>
          <div className="planRow">
            <div className="planRowColumn">1st Payment</div>
            <div className="planRowColumn">${installmentPerMonth}</div>
            <div className="planRowColumn">on {formattedToday}</div>
          </div>
          <div className="planRow">
            <div className="planRowColumn">2nd Payment</div>
            <div className="planRowColumn">${installmentPerMonth}</div>
            <div className="planRowColumn">on {formattedNextMonth}</div>
          </div>
          <div className="planRow">
            <div className="planRowColumn">3rd Payment</div>
            <div className="planRowColumn">${installmentPerMonth}</div>
            <div className="planRowColumn">on {formattedNextFromNext}</div>
          </div>
          <div className="planRow">
            <div className="planRowColumn">4th Payment</div>
            <div className="planRowColumn">${installmentPerMonth}</div>
            <div className="planRowColumn">on {formattedFourthNext}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethod

interface PaymentMethodConfig {
  name?: string
  title?: string
  icon?: React.ReactNode
  render?: React.ReactNode
  btnClasses?: string
}

interface PaymentMethodType {
  formId: string
  allConditions?: any
  applePaymentRequest: any
  addOn: PurchaseProduct | null
  selectedProducts: PurchaseProduct[]
  isAdditionalLetterCheckout: boolean
  setApplePaymentRequest: React.Dispatch<any>
}

// Helper function to return payment methods array
const paymentMethods = ({
  addOn,
  formId,
  allConditions,
  selectedProducts,
  applePaymentRequest,
  setApplePaymentRequest,
  isAdditionalLetterCheckout,
}: PaymentMethodType): PaymentMethodConfig[] => [
  {
    name: 'card',
    title: 'Credit / Debit Card',
    icon: <DebitCardIcon />,
  },
  {
    render: (
      <PayPalComponent
        {...{
          addOn,
          formId,
          allConditions,
          selectedProducts,
          isAdditionalLetterCheckout,
        }}
      />
    ),
  },
  ...(applePaymentRequest
    ? [
        {
          render: (
            <div className="flex min-w-[200px]" style={{ flexGrow: '1' }}>
              <ApplePay
                {...{
                  addOn,
                  formId,
                  allConditions,
                  selectedProducts,
                  applePaymentRequest,
                  setApplePaymentRequest,
                  isAdditionalLetterCheckout,
                }}
              />
            </div>
          ),
        },
      ]
    : []),
]
