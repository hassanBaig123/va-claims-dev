'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'
import { PurchaseProduct } from '@/components/learn-more/paypal'

interface TrustIcon {
  src: string
  alt: string
}

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [productPrice, setProductPrice] = useState<string>('')
  const [productName, setProductName] = useState<string>('')
  const [productId, setProductId] = useState<string>('')
  const [addOn, setAddOn] = useState<PurchaseProduct>()
  const [transactionId, setTransactionId] = useState<string>('')

  const isProd =
    process.env.NEXT_PUBLIC_BASE_URL === 'https://www.vaclaims-academy.com'

  const isDev =
    process.env.NEXT_PUBLIC_BASE_URL === 'https://dev.vaclaims-academy.com'

  const isLocal = process.env.NEXT_PUBLIC_BASE_URL === 'http://localhost:3000'

  const [pageLoaded, setPageLoaded] = useState(false)

  const handleAddOn = async (addOnId: string) => {
    const products: PurchaseProduct[] = (await getPurchaseProducts('all')) || []
    const addOn = products.find((product) => product?.id === addOnId)
    setAddOn(addOn)
  }

  useEffect(() => {
    const success = searchParams.get('success') === 'true'
    const price = searchParams.get('price') || ''
    const id = searchParams.get('productId') || ''
    const productName = searchParams.get('productName') || ''
    const addOnId = searchParams.get('addOnId') || ''
    const timestamp = Date.now() // Get current timestamp
    const uniqueTransactionId = `${id}_${timestamp}` // Combine product_id and timestamp

    setPaymentSuccess(success)
    setProductPrice(price)
    setProductId(id)
    setProductName(productName)
    setTransactionId(uniqueTransactionId)
    handleAddOn(addOnId)
  }, [searchParams])

  useEffect(() => {
    // Set pageLoaded to true when the component mounts
    setPageLoaded(true)
  }, [])

  const trustIcons: TrustIcon[] = [
    { src: '/imgs/payment_icons/amex.svg', alt: 'Amex' },
    { src: '/imgs/payment_icons/discover.svg', alt: 'Discover' },
    { src: '/imgs/payment_icons/mastercard.svg', alt: 'Mastercard' },
    { src: '/imgs/payment_icons/visa.svg', alt: 'Visa' },
  ]

  useEffect(() => {
    if (
      pageLoaded &&
      paymentSuccess &&
      typeof window !== 'undefined' &&
      (window as any).gtag
    ) {
      if (isProd) {
        console.log('Sending Production Google Analytics Event')
        ;(window as any).gtag('event', 'conversion', {
          send_to: 'AW-11167342395/pOwTCOqA5uUYELu-gM0p',
          value: parseFloat(productPrice) / 100,
          currency: 'USD',
          transaction_id: transactionId,
        })
      } else if (isDev || isLocal) {
        ;(window as any).gtag('event', 'conversion', {
          send_to: 'AW-11167342395/ILiaCN6n8NsZELu-gM0p',
          value: parseFloat(productPrice) / 100,
          currency: 'USD',
          transaction_id: transactionId,
        })
      }
      ;(window as any).gtag('event', 'user_purchase', {
        currency: 'USD',
        value: parseFloat(productPrice) / 100,
        items: [
          {
            item_id: productId,
            item_name: productName,
            price: parseFloat(productPrice) / 100,
          },
        ],
        transaction_id: transactionId,
      })
    }
  }, [
    pageLoaded,
    paymentSuccess,
    productPrice,
    transactionId,
    isProd,
    isDev,
    isLocal,
    productId,
    productName,
  ])

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-oxfordBlue mb-6">
                Payment Successful
              </h1>
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Congratulations on taking a big step in providing the benefits
                  you deserve for your household.
                </p>
                <p className="text-lg text-gray-700">
                  Check your email inbox now to activate your account and begin
                  your journey with us.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-gray-50 p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <h2 className="text-2xl font-semibold text-oxfordBlue mb-6">
                Order Summary
              </h2>
              {paymentSuccess && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Product</span>
                    <span className="text-oxfordBlue">Price</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-gray-600">
                      {productName?.replace?.('Tier', '')}
                    </span>
                    <span className="text-xl font-bold text-crimson">
                      ${Number(productPrice).toFixed(2) || 0}
                    </span>
                  </div>
                  {addOn && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">
                        {addOn.name}
                      </span>
                      <span className="text-xl font-bold text-crimson">
                        ${Number(addOn.price).toFixed(2) || 0}
                      </span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="mt-4 flex justify-center space-x-2 md:space-x-4">
                      {trustIcons.map((icon, index) => (
                        <Image
                          key={index}
                          src={icon.src}
                          alt={icon.alt}
                          width={50}
                          height={50}
                          className="w-12 h-12"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
