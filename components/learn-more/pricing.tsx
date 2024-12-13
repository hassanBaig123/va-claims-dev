'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import ErrorDialog from '@/components/learn-more/ErrorDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GoldAvailability from '@/components/learn-more/goldavailability'
import { faCheckCircle, faCrown } from '@fortawesome/pro-solid-svg-icons'
import { faArrowRight, IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import Countdown from '@/components/home/countdown'
import { PurchaseProduct } from './paypal'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
)

interface Feature {
  text: string
  icon: IconDefinition
  iconColor: string
  textColor: string
  outline?: string
}

export interface Product {
  name: string
  price: string
  originalPrice?: string
  tier: string
  paymentType: string
  description: string
  productId: string
  features: Feature[]
  desktopOrder: number
  mobileOrder: number
  border: string
  hoverScale: string
  isHighlighted?: boolean
  ctaText: string
}

const supabase: SupabaseClient = createClient()

interface Purchase {
  product_id: string
  created_at: string
}

// Line 114-118: Update the Supabase query handling
let goldPurchasesToday: number = 0
supabase
  .from('purchases')
  .select('*')
  .then(({ data, error }) => {
    if (error) {
      console.error('Error fetching purchases:', error)
      return
    }
    const today = new Date().toISOString().split('T')[0]
    goldPurchasesToday =
      data?.filter(
        (purchase) =>
          purchase.product_id === 'prod_PnZ9OixQFy8c6m' &&
          purchase.created_at.split('T')[0] === today,
      ).length || 0
  })

const MAX_GOLD_DAILY_PURCHASES = 10 - goldPurchasesToday

const Pricing: React.FC = () => {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [products, setProducts] = useState<PurchaseProduct[] | []>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false)

  const onError = (message: string) => {
    setErrorMessage(message)
    setIsErrorDialogOpen(true)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const openDialog = (product: string, productId: string, price: number) => {
    const params = { selectedProductId: productId }
    const qs = '?' + new URLSearchParams(params).toString()
    router.push('/checkout' + qs)
  }

  const sortedProducts =
    products?.length > 0
      ? [...products].sort((a: PurchaseProduct, b: PurchaseProduct) =>
          isDesktop && a && b
            ? a?.metadata.desktopOrder - b?.metadata.desktopOrder
            : a?.metadata.mobileOrder - b?.metadata.mobileOrder,
        )
      : []

  useEffect(() => {
    getPurchaseProducts('tier', setProducts)
  }, [])

  return (
    <>
      <style jsx>{`
        .ribbon {
          position: absolute;
          top: -3px;
          left: -3px;
          width: 100px;
          height: 100px;
          background: url('/imgs/POPULAR2.svg') no-repeat;
          background-size: cover;
          transform-origin: 0 0;
        }
      `}</style>
      <section id="pricing-section" className="bg-[#F3F4F6] py-20 lg:px-20">
        <ErrorDialog
          isOpen={isErrorDialogOpen}
          onOpenChange={setIsErrorDialogOpen}
          message={errorMessage || ''}
        />
        <div className="container mx-auto sm:px-20">
          <Countdown />
          <div className="flex flex-col gap-2 mb-10 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-center">
              Unlock Your Max VA Benefits for Life
            </h1>
          </div>
          <div className="flex flex-col sm:grid grid-cols-1 xl:grid-cols-3 gap-6">
            {sortedProducts?.length > 0 &&
              sortedProducts.map((product: PurchaseProduct, index) => (
                <div
                  key={index}
                  className={`flex flex-col bg-white rounded-lg shadow-2xl ${
                    product.metadata.border
                  } transform transition duration-500 ${
                    product.metadata.hoverScale
                  } ${
                    product.metadata.isHighlighted
                      ? 'border-4 sm:scale-105 z-10'
                      : ''
                  }`}
                >
                  {product.metadata.isHighlighted && (
                    <div className="ribbon"></div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl uppercase font-semibold text-center text-crimsonNew">
                      {product.name?.replace?.('Tier', '')}
                    </h2>
                    <div className="flex flex-col items-center mt-4 space-y-2">
                      {product.metadata.originalPrice && (
                        <span className="text-gray-400 line-through text-lg">
                          ${product.metadata.originalPrice}.00
                        </span>
                      )}
                      <span className="flex items-baseline">
                        <span className="text-3xl font-bold text-green-500">
                          $
                        </span>
                        <span className="text-[2.5rem] font-bold text-green-500">
                          {product?.price / 100}
                        </span>
                        <span className="text-xl font-bold text-green-500">
                          .00
                        </span>
                      </span>
                      <p className="text-sm font-light text-gray-600">
                        {product.metadata.paymentType}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-center mb-4">
                          {(product.metadata.tier === 'silver' ||
                            product.metadata.tier === 'gold') && (
                            <>
                              <div className="flex flex-col items-center space-y-4">
                                <p className="text-center font-black text-green-500">
                                  <span className="text-sm">or</span>
                                </p>
                                <p className="text-center text-sm font-light text-black">
                                  Payment Plans Available
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {product.metadata.tier === 'gold' && (
                        <GoldAvailability
                          className="text-center text-sm font-semibold text-red-600 mt-2"
                          maxDailyPurchases={MAX_GOLD_DAILY_PURCHASES}
                        />
                      )}
                    </div>
                    {product.metadata.tier === 'bronze' && (
                      <p className="text-center text-sm font-normal">
                        Perfect For Transitioning Military Members
                      </p>
                    )}
                    <ul className="text-sm font-normal flex-grow p-6 space-y-4">
                      {product.metadata.features.map(
                        (feature: any, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-start">
                            <span
                              className={`inline-flex items-center justify-center w-6 -mt-1 h-6 mr-2 ${
                                feature.outline ? 'relative' : ''
                              }`}
                            >
                              {feature.outline && (
                                <FontAwesomeIcon
                                  icon={
                                    feature.icon === 'faCrown'
                                      ? faCrown
                                      : faCheckCircle
                                  }
                                  className={`w-5 h-5 ${feature.outline} absolute`}
                                />
                              )}
                              <FontAwesomeIcon
                                icon={
                                  feature.icon === 'faCrown'
                                    ? faCrown
                                    : faCheckCircle
                                }
                                className={`w-4 h-4 ${feature.iconColor} relative z-10`}
                              />
                            </span>
                            <span
                              className={`${feature.textColor} flex-1 text-md sm:text-sm text-gray-600 font-lexendDeca`}
                            >
                              {feature.text}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>

                    <button
                      onClick={() =>
                        openDialog(product.name, product.id, product.price)
                      }
                      className="cta-button text-lg mt-5 flex text-center justify-center items-center w-[75%] font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded mx-auto mb-5"
                    >
                      {product.metadata.ctaText}
                      <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-black"
                        />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Pricing
