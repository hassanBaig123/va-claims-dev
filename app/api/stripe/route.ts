import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'

import { getUserTierLevelAdmin } from '@/utils/users/tierManagement'

import { getPurchaseCountAdmin } from '@/utils/users/purchaseManagement'

async function getProductDetails(productId: string) {
  console.log('Fetching product details for ID:', productId) // Log the product ID being queried
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      prices (
        unit_amount
      )
    `,
    )
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Failed to fetch product details:', error)
    return null
  }

  if (!data) {
    console.log('No data returned for product ID:', productId)
    return null
  }
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~Product details:', data) // Log the product details being returned
  return data
}

// Remove the existing config export
// Replace with the new format
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (req.body instanceof ReadableStream) {
    try {
      const reader = req.body.getReader()
      let received = ''
      let done, value
      while (({ done, value } = await reader.read()) && !done) {
        received += new TextDecoder().decode(value)
      }
      const body = JSON.parse(received)

      const { paymentMethodId, productId, userInfo } = body

      const product = await getProductDetails(productId)
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found or inactive' },
          { status: 404 },
        )
      }

      const user = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/userEmail/${userInfo.email}`,
      )
      let userResponse
      try {
        userResponse = await user.json()
      } catch (error) {
        console.error('Error parsing user response JSON:', error)
        return NextResponse.json(
          { error: 'Failed to parse user response' },
          { status: 500 },
        )
      }
      console.log('User details response~~~~~~~~~~~~~~~:', userResponse)
      if (userResponse.user === null) {
        console.log('User not found, proceeding as a new user.')
      } else if (user.status !== 200) {
        return NextResponse.json(
          { error: 'Failed to fetch user details' },
          { status: 500 },
        )
      }
      const userId = userResponse?.id
      console.log('User ID:', userId)

      if (userId) {
        const userTierLevel = await getUserTierLevelAdmin(userId)
        console.log('User tier level:', userTierLevel)

        // Logic to handle purchase based on user tier level and product purchase rules
        try {
          const purchaseCount = await getPurchaseCountAdmin(userId, productId)
          console.log('Purchase count for product:', purchaseCount)

          // Fetch product details again using the product route
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
          const productDetailsResponse = await fetch(
            `${baseUrl}/api/products/product?id=${productId}`,
          )
          const productDetails = await productDetailsResponse.json()

          if (productDetails.error) {
            return NextResponse.json(
              { error: 'Failed to fetch product details' },
              { status: 500 },
            )
          }

          console.log('Product details from product route:', productDetails)
          console.log('Product metadata:', productDetails.metadata)

          // Check if the product is inactive
          if (productDetails.active === false) {
            const error =
              productDetails.metadata.messages.product_paused ||
              'Product is inactive'
            return NextResponse.json({ error: error }, { status: 400 })
          }

          // Check if the user is eligible to purchase the product
          if (
            productDetails.metadata.purchase_rules.user_can_purchase === false
          ) {
            const error =
              productDetails.metadata.messages.not_eligible ||
              'You are not eligible to purchase this product'
            return NextResponse.json({ error: error }, { status: 400 })
          }

          // Check if the user has reached the maximum purchase limit for the product
          if (productDetails.metadata.purchase_rules.max_purchases) {
            const purchaseLimit = parseInt(
              productDetails.metadata.purchase_rules.max_purchases,
            )
            if (purchaseCount >= purchaseLimit) {
              const error =
                productDetails.metadata.messages.max_purchases_reached ||
                'Maximum purchases reached'
              return NextResponse.json({ error: error }, { status: 400 })
            }
          }

          // Check if the user's tier level is allowed to purchase the product
          const packagesThatCanPurchase =
            productDetails.metadata.purchase_rules.packages_that_can_purchase
          if (packagesThatCanPurchase && packagesThatCanPurchase.length > 0) {
            let userCanPurchase =
              packagesThatCanPurchase.includes(userTierLevel)
            console.log(
              'User can purchase:',
              userCanPurchase,
              'Packages that can purchase:',
              packagesThatCanPurchase,
            )
            if (packagesThatCanPurchase[0] === 'any') {
              userCanPurchase = true
              console.log('User can purchase any package')
            }
            if (!userCanPurchase) {
              const error =
                productDetails.metadata.messages.not_eligible ||
                'You are not eligible to purchase this product'
              return NextResponse.json({ error: error }, { status: 400 })
            }
          }
        } catch (error) {
          console.error(
            'Error fetching purchase count:',
            (error as Error).message,
          )
          return NextResponse.json(
            { error: 'Error fetching purchase count' },
            { status: 500 },
          )
        }
      } else {
        console.log(
          'New user, proceeding without tier level and purchase count checks.',
        )
      }

      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: userInfo.email,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        address: { line1: userInfo.address },
        phone: userInfo.phone,
      })

      const amount = product.prices[0].unit_amount
      if (amount === null) {
        return NextResponse.json(
          { error: 'Product price is not available' },
          { status: 400 },
        )
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        customer: customer.id,
        payment_method: paymentMethodId,
        description: `Payment for ${product.name}`,
        metadata: { productId: product.id, productName: product.name },
      })

      // console.log("Payment intent created:", paymentIntent);

      if (paymentIntent.status === 'requires_confirmation') {
        console.log('Payment requires confirmation')
        return NextResponse.json(
          {
            requiresConfirmation: true,
            productDetails: {
              name: product.name,
              price: product.prices[0].unit_amount,
              productId: product.id,
            },
            clientSecret: paymentIntent.client_secret,
            userInfo,
            stripeCustomerId: customer.id,
          },
          { status: 200 },
        )
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded')

        //right here we could do a lot of the user processing.

        return NextResponse.json(
          {
            success: true,
            productDetails: {
              name: product.name,
              price: product.prices[0].unit_amount,
              productId: product.id,
            },
            userInfo,
            stripeCustomerId: customer.id,
          },
          { status: 200 },
        )
      } else {
        console.log('Payment failed')
        return NextResponse.json({ success: false }, { status: 400 })
      }
    } catch (error) {
      console.error('Stripe API error:', (error as Error).message)
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 },
      )
    }
  } else {
    console.log('Body is not a stream, current body:', req.body)
    return NextResponse.json(
      { error: 'Expected a stream in request body' },
      { status: 400 },
    )
  }
}
