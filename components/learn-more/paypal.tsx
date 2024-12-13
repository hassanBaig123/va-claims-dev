'use client'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { getSupaUser } from '@/utils'
import { generateSignedUrl } from '@/utils/auth'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

interface PayPalProps {
  formId: string
  addOn: PurchaseProduct | null
  allConditions?: any
  selectedProducts: PurchaseProduct[]
  isAdditionalLetterCheckout: boolean
}

export interface PurchaseProduct {
  id: string
  name: string
  price: number
  description: string
  metadata: any
}

const PayPalComponent: React.FC<PayPalProps> = ({
  addOn,
  formId,
  allConditions,
  selectedProducts,
  isAdditionalLetterCheckout,
}) => {
  return (
    <>
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}
      >
        <div style={{ flexGrow: '1' }}>
          <PayPalButtonsComp
            {...{
              addOn,
              formId,
              allConditions,
              selectedProducts,
              fundingSource: 'paypal',
              isAdditionalLetterCheckout,
            }}
          />
        </div>
        <div style={{ flexGrow: '1' }}>
          <PayPalButtonsComp
            {...{
              addOn,
              formId,
              allConditions,
              selectedProducts,
              fundingSource: 'paylater',
              isAdditionalLetterCheckout,
            }}
          />
        </div>
      </PayPalScriptProvider>
    </>
  )
}

export default PayPalComponent

interface PayPalButtonsCompProps {
  formId: string
  fundingSource: any
  allConditions?: any
  addOn: PurchaseProduct | null
  selectedProducts: PurchaseProduct[]
  isAdditionalLetterCheckout: boolean
}
const PayPalButtonsComp = ({
  addOn,
  formId,
  allConditions,
  fundingSource,
  selectedProducts,
  isAdditionalLetterCheckout,
}: PayPalButtonsCompProps) => {
  const router = useRouter()
  const [key, setKey] = useState(0)
  const [products, setProducts] = useState<PurchaseProduct[] | []>([])

  // Keep this Re-render when addOn or selectedProduct changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
    getPurchaseProducts('paypal', setProducts)
  }, [addOn?.price, selectedProducts?.[0]?.price])

  return (
    <>
      {products?.length > 0 ? (
        <PayPalButtons
          key={key} 
          fundingSource={fundingSource}
          style={{ height: 48, borderRadius: 10 }}
          createOrder={(data, actions) => {
            let items: any = []
            items = selectedProducts.map((sp) => {
              const paypalProduct = products?.find((product) => {
                return product?.metadata?.productId === sp?.id
              })
              return {
                quantity: '1',
                sku: paypalProduct?.id,
                name: paypalProduct?.name || '',
                description: paypalProduct?.description,
                unit_amount: {
                  currency_code: 'USD',
                  value: (paypalProduct?.price || 0).toString(),
                },
              }
            })
            const selectedAddOn = products.find(
              (product) => product?.id === addOn?.id,
            )
            selectedAddOn &&
              items.push({
                quantity: '1',
                sku: selectedAddOn?.id,
                name: selectedAddOn?.name || '',
                description: selectedAddOn?.description,
                unit_amount: {
                  currency_code: 'USD',
                  value: (selectedAddOn?.price || 0).toString(),
                },
              })

            const total = items.reduce(
              (total: number, item: any) => total + +item?.unit_amount?.value,
              0,
            )
            const item_total = +(total || 0)

            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  items,
                  amount: {
                    currency_code: 'USD',
                    value: item_total.toFixed(2),
                    breakdown: {
                      item_total: {
                        currency_code: 'USD',
                        value: item_total.toFixed(2),
                      },
                    },
                  },
                },
              ],
            })
          }}
          onApprove={(data, actions) => {
            return actions?.order!.capture().then(async (details) => {
              try {
                console.log('approved paypal')
                console.log(
                  isAdditionalLetterCheckout,
                  'isAdditionalLetterCheckout',
                )
                const paypalProduct = products?.find((product) => {
                  return (
                    product?.metadata?.productId === selectedProducts?.[0]?.id
                  )
                })
                const user = await getSupaUser()
                let response
                if (!isAdditionalLetterCheckout) {
                  console.log('approved paypal-1111')
                  try {
                    response = await fetch('/api/paypal', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        user_id: user?.user?.id,
                        addOn,
                        details,
                        paypalProduct,
                        productId: selectedProducts?.[0]?.id,
                      }),
                    })
                      .then((r) => r.json())
                      .catch((e) => {
                        console.error('Fetch error:', e) // Additional error logging for debugging
                        toast({
                          title: 'Paypal Payment Failed.',
                        })
                      })
                  } catch (e) {
                    console.error('Error in non-additional letter checkout:', e)
                  }
                } else {
                  try {
                    await fetch(`/api/form/status-additional`, {
                      method: 'PUT',
                      body: JSON.stringify({
                        form_id: formId,
                        conditions: allConditions,
                        user_id: user?.user?.id,
                        status: 'submitted',
                        submit_type: 'NONE',
                      }),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    // Send Email
                    // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
                    const contactUserResponse = await fetch(`/api/email`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: user?.user?.email,
                        templateName: 'additionalFormPurchased',
                        templateData: {
                          name: user?.user?.email || '',
                          formLink: generateSignedUrl(`/`),
                          subject: 'Additional Letter Purchased Successfully',
                          message: '',
                        },
                      }),
                    })
                    if (contactUserResponse.ok) {
                      console.log('email sent')
                    } else {
                      console.log('email Error')
                    }
                  } catch (e) {
                    console.error('Error sendEmailToUser:', e)
                    toast({
                      title: 'Paypal Payment Failed: ',
                      description: e?.toString() || 'Something went wrong!',
                    })
                  }
                }
                router?.push?.(response?.url || '/todos')
              } catch (e) {
                console.error('Paypal onApprove error:', e)
              }
            })
          }}
          onError={(err) => {
            console.error(err)
            toast({
              title: 'Paypal Payment Failed: ',
              description: err?.toString() || 'Something went wrong!',
            })
          }}
        />
      ) : (
        ''
      )}
    </>
  )
}
