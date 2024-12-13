import {
  Dialog,
  DialogTitle,
  DialogOverlay,
  DialogContent,
  DialogDescription,
} from '@radix-ui/react-dialog'
import Image from 'next/image'
import { X } from 'lucide-react'
import { PurchaseProduct } from './paypal'
import React, { useEffect, useState } from 'react'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

interface PaymentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}
interface TrustIcon {
  src: string
  alt: string
}

const SuccessFailureDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [error, setError] = useState<string>('')
  const [addOns, setAddOn] = useState<PurchaseProduct[] | []>([])
  const [products, setProducts] = useState<PurchaseProduct[] | []>([])
  const [productPrice, setProductPrice] = useState<number | null>(null)
  const [selectedAddOn, setSelectedAddOn] = useState<PurchaseProduct | null>(
    null,
  )
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      products?.length > 0 &&
      addOns?.length > 0
    ) {
      // Extract the search parameters from the URL
      const searchParams = new URLSearchParams(window.location.search)
      const err = searchParams.get('error') || ''
      const addOnId = searchParams.get('addOnId') || ''
      const productId = searchParams.get('productId') || ''
      const selectedProduct = products.find((y) => y?.id === productId)
      const selectedAddOn = addOns.find((y) => y?.id === addOnId)
      setProductPrice(+(selectedProduct?.price || 0))
      setSelectedProduct(selectedProduct?.name || '')
      selectedAddOn && setSelectedAddOn(selectedAddOn)

      setError(err)
    }
  }, [products?.length, addOns?.length]) // Only run once on component mount

  const trustIcons: TrustIcon[] = [
    { src: '/imgs/payment_icons/amex.svg', alt: 'Amex' },
    { src: '/imgs/payment_icons/discover.svg', alt: 'Discover' },
    { src: '/imgs/payment_icons/mastercard.svg', alt: 'Mastercard' },
    { src: '/imgs/payment_icons/visa.svg', alt: 'Visa' },
  ]
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  useEffect(() => {
    getPurchaseProducts('tier', setProducts)
    getPurchaseProducts('addOns', setAddOn)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <DialogContent className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <DialogTitle className="sr-only">Payment Dialog</DialogTitle>
        <DialogDescription className="sr-only">
          This dialog allows you to complete your purchase by entering payment
          details.
        </DialogDescription>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
          <div className="w-full md:w-2/3 order-2 md:order-1 overflow-y-auto p-4">
            <div className="text-center p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Payment Successful
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase! Your payment was successful.
              </p>
              <p className="text-gray-600 mb-6">
                Please check your email for further instructions on how to
                access your purchase and complete any necessary registration
                steps.
              </p>
              <p className="text-gray-600 mb-8">
                If you have any questions or need assistance, please don't
                hesitate to contact our support team.
              </p>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4 border-t md:border-t-0 md:border-l border-gray-300 order-1 md:order-2 overflow-y-auto bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div
              className={`${
                selectedAddOn ? 'mb-1' : 'mb-4'
              } flex justify-between`}
            >
              <div>
                <h3 className="font-semibold">Product</h3>
                <p>{selectedProduct}</p>
              </div>
              <div>
                <h3 className="font-semibold">Price</h3>
                <p>{formatCurrency(productPrice)}</p>
              </div>
            </div>

            {selectedAddOn && (
              <div className="mb-4 flex justify-between">
                <div>
                  <p>{selectedAddOn?.name}</p>
                </div>
                <div>
                  <p>{formatCurrency(+selectedAddOn?.price)}</p>
                </div>
              </div>
            )}

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
      </DialogContent>
    </Dialog>
  )
}

export default SuccessFailureDialog
