'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import { loadStripe } from '@stripe/stripe-js'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'
import Pricing from '../learn-more/pricing'
import { PurchaseProduct } from '../learn-more/paypal'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
)

const Upgrade: React.FC = () => {
  const router = useRouter()
  const [userTier, setUserTier] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [availableUpgrades, setAvailableUpgrades] = useState<PurchaseProduct[]>(
    [],
  )

  const getAvailableUpgrades = async (
    tier: string,
  ): Promise<PurchaseProduct[]> => {
    const products = await getPurchaseProducts('upgrade')
    let upgrades: PurchaseProduct[]
    switch (tier) {
      case 'prod_PnZM5ETN3s8bhn': // Bronze tier
        upgrades = products.filter((product) =>
          ['upgrade_bronze_to_silver', 'upgrade_bronze_to_gold'].includes(
            product.metadata.tier,
          ),
        )
        break
      case 'prod_PnZH9fc6oZl5V9': // Silver tier
      case 'prod_QMfaGsWd1YHtUJ': // Upgrade from Bronze to Silver
        upgrades = products.filter(
          (product) => product.metadata.tier === 'upgrade_silver_to_gold',
        )
        break
      default:
        upgrades = []
    }
    console.log(upgrades, 'upgrades')

    setAvailableUpgrades?.(upgrades)
    return upgrades
  }

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const response = await fetch('/api/user/userTier')
        if (!response.ok) {
          throw new Error('Failed to fetch user tier')
        }
        const data: { tier: string } = await response.json()
        await getAvailableUpgrades(data.tier)
        setUserTier(data.tier)
      } catch (error) {
        console.error('Error fetching user tier:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserTier()
  }, [])

  if (isLoading) {
    return <div className="text-center py-10">Loading upgrade options...</div>
  }

  if (!userTier) {
    return <Pricing />

    // return (
    //   <div className="text-center py-10">
    //     <h2 className="text-2xl font-bold mb-4">
    //       Get Complete VA Claims Support
    //     </h2>
    //     <p className="text-gray-600 mb-4">
    //       Access our comprehensive course, templates, and expert guidance to
    //       maximize your VA claim.
    //     </p>
    //     <a href="/" className="text-blue-600 hover:text-blue-800 underline">
    //       Learn More About What We Can Do For You
    //     </a>
    //   </div>
    // )
  }

  if (
    [
      'prod_PnZ9OixQFy8c6m',
      'prod_QMfdFlVPVId5n4',
      'prod_QMfkpdcsQYcvUG',
    ].includes(userTier)
  ) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">
          You have the highest tier package available.
        </h2>
        <p>Thank you for being a Grandmaster member!</p>
      </div>
    )
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Upgrade Your Package
        </h1>
        {availableUpgrades?.length > 0 ? (
          <div className="flex flex-col sm:flex-row justify-center items-stretch space-y-6 sm:space-y-0 sm:space-x-6">
            {availableUpgrades.map((product, index) => (
              <div
                key={index}
                className={`flex flex-col w-full sm:w-1/2 bg-white rounded-lg shadow-2xl p-6 ${
                  product.metadata.border
                } transform transition duration-500 ${
                  product.metadata.hoverScale
                } ${
                  product.metadata.isHighlighted
                    ? 'border-4 border-amber-400 sm:scale-[1.04]'
                    : ''
                }`}
              >
                <h2
                  className={`text-3xl font-bold text-center ${
                    product.metadata.isHighlighted
                      ? 'text-yellow-600'
                      : 'text-gray-800'
                  }`}
                >
                  {product.name}
                </h2>
                <span className="flex w-full justify-center my-[1.8rem]">
                  <span className="text-3xl font-bold text-gray-600 mt-4">
                    $
                  </span>
                  <span className="text-[2.5rem] font-bold text-gray-600 mt-2">
                    {+product?.price / 100}
                  </span>
                  <span className="text-xl font-bold text-gray-600 mt-4">
                    .00
                  </span>
                </span>
                <p className="text-center text-lg font-bold text-gray-600 mt-2">
                  {product.metadata.paymentType}
                </p>
                <ul className="mt-6 space-y-4 text-lg flex-grow">
                  {product.metadata.features.map(
                    (feature: string, featureIndex: number) => (
                      <li key={featureIndex}>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="inline mr-2 text-green-500 w-4 h-4"
                        />
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ),
                  )}
                </ul>
                <button
                  onClick={() => {
                    router?.push(`/checkout?selectedProductId=${product.id}`)
                  }}
                  className="cta-button text-xl mt-5 flex text-center justify-center items-center w-72 font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded mx-auto mb-5"
                >
                  Upgrade Now
                  <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-black"
                    />
                  </span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>No upgrade options are available for your current tier.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Upgrade
