'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Product } from '@/components/learn-more/pricing'
import { PurchaseProduct } from '@/components/learn-more/paypal'
import Checkout from '@/components/subscription-checkout'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'
import AdditionalCheckout from '@/components/subscription-checkout/additional-checkout'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
)

export default function CheckoutPage() {
  const router = useRouter()
  const [addOn, setAddOn] = useState<PurchaseProduct | null>(null)
  const [allConditions, setAllConditions] = useState<any>('')
  const [selectedProduct, setSelectedProduct] =
    useState<PurchaseProduct | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<PurchaseProduct[]>(
    [],
  )
  const [isAdditionalLetterCheckout, setIsAdditionalLetterCheckout] =
    useState<boolean>(false)

  const handleCheckoutProducts = async () => {
    const products = await getPurchaseProducts('all')
    if (products?.length) {
      const searchParams = new URLSearchParams(window?.location?.search)
      const isAdditionalLetterCheckoutParam = searchParams.get(
        'isAdditionalLetterCheckout',
      )
      setIsAdditionalLetterCheckout(
        isAdditionalLetterCheckoutParam === 'true' ? true : false,
      )
      if (
        typeof window !== 'undefined' &&
        isAdditionalLetterCheckoutParam !== 'true'
      ) {
        // Extract the search parameters from the URL
        const addOnId = searchParams.get('addOnId') || 'none'
        const selectedProductId = searchParams.get('selectedProductId') || ''
        const purchaseProduct = products.find(
          ({ id }) => id === selectedProductId,
        )
        const selectedAddOn =
          addOnId !== 'none'
            ? products.find(({ id }) => id === addOnId) || null
            : null

        if (!purchaseProduct) {
          router?.push('/')
          return
        }
        setSelectedProduct(purchaseProduct)
        setAddOn(selectedAddOn)
      } else if (
        typeof window !== 'undefined' &&
        isAdditionalLetterCheckoutParam == 'true'
      ) {
        if (searchParams) {
          const productsParam = searchParams.get('products')
          const conditionPar = searchParams.get('conditions')
          const selectedProductIds = productsParam
            ? JSON.parse(productsParam)
            : []
          const conditionParam = conditionPar ? JSON.parse(conditionPar) : []
          const purchaseProducts = selectedProductIds
            .map((id: string) => products.find((product) => product?.id === id))
            .filter((product: any): product is Product => product !== undefined)
          setAllConditions(conditionParam)
          setSelectedProducts(purchaseProducts)
          if (!purchaseProducts) {
            router?.push('/')
            return
          }
        }
      }
    }
  }

  useEffect(() => {
    handleCheckoutProducts()
  }, [])

  return (
    <>
      <Elements stripe={stripePromise}>
        {isAdditionalLetterCheckout ? (
          <AdditionalCheckout
            {...{ selectedProducts, isAdditionalLetterCheckout, allConditions }}
          />
        ) : selectedProduct ? (
          <Checkout {...{ selectedProduct, addOn }} />
        ) : (
          'Product not selected!'
        )}
      </Elements>
    </>
  )
}
