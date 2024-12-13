'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { PurchaseProduct } from '../learn-more/paypal'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

const trustIcons = [
  { src: '/imgs/trust_icons/veteran_owned.svg', alt: 'Veteran Owned' },
  { src: '/imgs/trust_icons/Trust_The_Elixir.png', alt: 'Guarantee' },
  { src: '/imgs/trust_icons/ssl_shield.svg', alt: 'SSL Security' },
  { src: '/imgs/trust_icons/verified_reviews.svg', alt: 'Verified Reviews' },
]

const paymentIcons = [
  { src: '/imgs/payment_icons/visa.svg', alt: 'Visa' },
  { src: '/imgs/payment_icons/mastercard.svg', alt: 'Mastercard' },
  { src: '/imgs/payment_icons/discover.svg', alt: 'Discover' },
  { src: '/imgs/payment_icons/amex.svg', alt: 'American Express' },
  { src: '/imgs/payment_icons/paypal.svg', alt: 'PayPal' },
  { src: '/imgs/payment_icons/apple_pay.svg', alt: 'Apple Pay' },
]

interface OrderSummaryProps {
  addOn: PurchaseProduct | null
  selectedProduct: PurchaseProduct | null
  installmentMethod: Boolean | null
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  addOn,
  selectedProduct,
  installmentMethod,
}) => {
  const searchParams = useSearchParams()
  const selectedProductId = searchParams.get('selectedProductId')

  const [addOns, setAddOn] = useState<PurchaseProduct[] | []>([])

  const addOnsEnabled =
    process.env.NEXT_PUBLIC_ADD_ONS === 'true' &&
    selectedProduct?.name !== 'Expert'

  const totalPrice =
    (+(selectedProduct?.price || 0) / 100 || 0) + +(addOn?.price || 0)

  const totalPriceInstallments =
    (+((selectedProduct?.price || 0) / 100) / 4 || 0) + +(addOn?.price || 0)

  // Handle the selection of add-ons
  const handleAddOnSelect = async (addOnEl: PurchaseProduct | null) => {
    const addOnId = addOnEl?.id ? addOnEl.id : 'none'
    // Force a full page reload
    const path = window?.location?.href?.split?.('?')?.[0]
    if (window) {
      window.location.href = `${path}?selectedProductId=${selectedProductId}&addOnId=${addOnId}`
    }
  }

  useEffect(() => {
    getPurchaseProducts('addOns', setAddOn)
  }, [])

  const parsePrice = (price: any) => `$${+(price || 0) / 100}.00`

  return (
    <>
      <div className="p-7 border border-gray-300 rounded-[20px] shadow-md bg-cardBackground">
        <h4 className="text-oxfordBlue font-semibold font-opsan text-[17px] md:text-[24px] mb-3">
          Order Summary
        </h4>
        <div className="flex justify-between">
          <div className="w-1/2">
            <p className="mt-1 text-crimsonNew font-semibold text-[22px]">
              {selectedProduct?.name?.replace?.('Tier', '')}
            </p>
          </div>
          <div className="w-1/2">
            <p className="mt-1 text-crimsonNew font-semibold text-[17px] text-right">
              {installmentMethod
                ? `$${(selectedProduct?.price ?? 0) / 100 / 4}`
                : parsePrice(selectedProduct?.price)}
            </p>
          </div>
        </div>

        <p className="mt-4 font-opsan font-light">Date</p>
        <p className="mt-1 font-opsan font-semibold text-platinum_950 text-base">
          {format(new Date(), 'PPP')}
        </p>

        {/* Add-ons Section */}
        {addOnsEnabled ? (
          <>
            <p className="mt-4 font-opsan font-light">Add-ons</p>
            <div className="mt-1">
              {addOns?.length > 0 &&
                addOns.map((addOnEl) => (
                  <div key={addOnEl?.id} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="addon"
                      value={+addOnEl?.price}
                      id={`addon-${addOnEl?.id}`}
                      checked={+(addOn?.price || 0) === +addOnEl?.price}
                      onChange={() => handleAddOnSelect(addOnEl)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`addon-${addOnEl.id}`}
                      className="font-opsan font-normal text-platinum_950"
                    >
                      {addOnEl?.name} - {addOnEl?.description} ($
                      {addOnEl?.price})
                    </label>
                  </div>
                ))}
              {/* Option to remove add-ons */}
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="addon-none"
                  name="addon"
                  value="none"
                  checked={addOn === null}
                  onChange={() => handleAddOnSelect(null)}
                  className="mr-2"
                />
                <label
                  htmlFor="addon-none"
                  className="font-opsan font-normal text-platinum_950"
                >
                  No Add-ons
                </label>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        <p className="mt-4 font-opsan font-light">Amount Detail</p>
        <div className="mt-1 flex justify-between">
          <span className="font-opsan font-normal">Product Price</span>
          <span className="font-opsan font-semibold text-platinum_950 text-base">
            {parsePrice(selectedProduct?.price)}
          </span>
        </div>
        {addOnsEnabled && (
          <div className="mt-1 flex justify-between">
            <span className="font-opsan font-normal">Add-on Price</span>
            <span className="font-opsan font-semibold text-platinum_950 text-base">
              {addOn?.price ? `$${addOn.price}.00` : '-'}
            </span>
          </div>
        )}
        {installmentMethod && (
          <div className="mt-1 flex justify-between">
            <span className="font-opsan font-normal">
              Paying Today (1st payment)
            </span>
            <span className="font-opsan font-semibold text-platinum_950 text-base">
              {`$${(selectedProduct?.price ?? 0) / 100 / 4}`}
            </span>
          </div>
        )}
        {/* <div className="mt-1 flex justify-between">
          <span className="font-opsan font-normal">Discount</span>
          <span className="font-opsan font-semibold text-platinum_950 text-base">
            -
          </span>
        </div> */}
        <hr className="my-2" />
        <div className="mt-1 flex justify-between">
          <span className="font-opsan font-normal">Total Amount</span>
          <span className="font-opsan font-semibold text-platinum_950 text-base">
            {installmentMethod
              ? `$${totalPriceInstallments}`
              : `$${totalPrice}.00`}
          </span>
        </div>
        {/* <div className="mt-8 flex justify-evenly">
          {paymentIcons.map((icon, index) => (
            <Image
              key={index}
              src={icon.src}
              alt={icon.alt}
              width={50}
              height={50}
            />
          ))}
        </div> */}
      </div>

      {/* <div className="mt-8 flex justify-evenly">
        {trustIcons.map((icon, index) => (
          <Image
            key={index}
            src={icon.src}
            alt={icon.alt}
            width={70}
            height={70}
          />
        ))}
      </div> */}
    </>
  )
}

export default OrderSummary
