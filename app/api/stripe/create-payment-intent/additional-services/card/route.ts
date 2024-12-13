import { Product } from '@/components/learn-more/pricing'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    let { paymentMethodId, selectedProducts, userInfo, conditions, userId } = await req.json()

    selectedProducts = JSON.parse(selectedProducts)
    const amount = selectedProducts.reduce((acc: number, curr: Product) => {
      acc += +curr?.price
      return acc
    }, 0) * 100
    if (amount === null || amount === undefined) {
      return NextResponse.json(
        { error: 'Product price is not available' },
        { status: 400 },
      )
    }


    // Create or retrieve Stripe customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: userInfo.email,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      address: {
        line1: userInfo.street,
        city: userInfo.city,
        state: userInfo.state,
        postal_code: userInfo.zip,
        country: 'US',
      },
      phone: userInfo.phone,
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethodId,
      description: `Payment for ${selectedProducts.map((product: Product) => product?.name || "").join(", ")}`,
      metadata: {
        selectedProducts: JSON.stringify(selectedProducts), conditions: JSON.stringify(conditions), userId
      },
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    })

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json(
        {
          userInfo,
          success: true,
          stripeCustomerId: customer.id,
          clientSecret: paymentIntent.client_secret,
        },
        { status: 200 },
      )
    } else
      if (paymentIntent.status === 'requires_action') {
        return NextResponse.json(
          {
            userInfo,
            requiresAction: true,
            stripeCustomerId: customer.id,
            clientSecret: paymentIntent.client_secret,
          },
          { status: 200 },
        )
      } else {
        throw new Error('Payment failed')
      }
  } catch (error) {
    console.error('Error in payment process:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
