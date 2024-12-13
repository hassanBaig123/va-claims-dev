import React from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { PurchaseProduct } from '@/components/learn-more/paypal'

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
  selectedProducts: PurchaseProduct[] | null
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedProducts }) => {
  const searchParams = useSearchParams()
  const selectedProductId = searchParams.get('selectedProductId')

  const totalPrice = selectedProducts?.reduce((accumulator, product) => {
    return accumulator + (parseFloat(product.price.toString()) || 0)
  }, 0)

  const productCounts = selectedProducts?.reduce<any[]>(
    (acc: any[], product: any) => {
      // Use the product ID as the key to track counts
      const existingProduct: any = acc.find(
        (item: any) => item.id === product.id,
      )

      if (existingProduct) {
        // If product exists, increment the count
        existingProduct.count += 1
      } else {
        // If product doesn't exist, add it with count of 1
        acc.push({ ...product, count: 1 })
      }

      return acc
    },
    [],
  )

  return (
    <>
      <div className="p-7 border border-gray-300 rounded-[20px] shadow-md bg-cardBackground">
        <h4 className="text-oxfordBlue font-semibold font-opsan text-[17px] md:text-[24px] mb-3">
          Order Summary
        </h4>
        <div className="flex justify-between mb-2">
          <div className="w-1/2">
            <p className="mt-1 text-crimsonNew font-light text-[20px]">
              Product Name
            </p>
          </div>
          <div className="w-1/2">
            <p className="mt-1 text-crimsonNew font-light text-[20px] text-right">
              Product Price
            </p>
          </div>
        </div>
        {productCounts?.map((product) => (
          <div key={product.productId} className="flex justify-between mb-2">
            <div className="w-2/3">
              <p className="mt-1 text-platinum_950 font-normal text-[17px]">
                {product.name} X {product.count}
              </p>
            </div>
            <div className="w-1/3">
              <p className="mt-1 text-platinum_950 font-normal text-[17px] text-right">
                $
                {parseFloat((product.price * product.count).toString()).toFixed(
                  2,
                )}
              </p>
            </div>
          </div>
        ))}

        <p className="mt-4 font-opsan font-light">Date</p>
        <p className="mt-1 font-opsan font-semibold text-platinum_950 text-base">
          {format(new Date(), 'PPP')}
        </p>

        {/* Add-ons Section */}

        <p className="mt-4 font-opsan font-light">Amount Detail</p>

        <hr className="my-2" />
        <div className="mt-1 flex justify-between">
          <span className="font-opsan font-normal">Total Amount</span>
          <span className="font-opsan font-semibold text-platinum_950 text-base">
            ${totalPrice}.00
          </span>
        </div>
        <div className="mt-8 flex justify-evenly">
          {paymentIcons.map((icon, index) => (
            <Image
              key={index}
              src={icon.src}
              alt={icon.alt}
              width={50}
              height={50}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-evenly">
        {trustIcons.map((icon, index) => (
          <Image
            key={index}
            src={icon.src}
            alt={icon.alt}
            width={70}
            height={70}
          />
        ))}
      </div>
    </>
  )
}

export default OrderSummary
