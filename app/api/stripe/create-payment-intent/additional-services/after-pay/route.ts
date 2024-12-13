import { Product } from '@/components/learn-more/pricing'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { currency, payment_method, userInfo, selectedProducts, conditions, userId } = await req.json()

    const amount = selectedProducts.reduce((acc: number, curr: Product) => {
      acc += +curr.price
      return acc
    }, 0) * 100

    if (amount === null || amount === undefined) {
      return NextResponse.json(
        { error: 'Product price is not available' },
        { status: 400 },
      )
    }

    const customer = await stripe.customers.create({
      email: userInfo.email,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      address: {
        country: 'US',
        city: userInfo.city,
        state: userInfo.state,
        line1: userInfo.street,
        postal_code: userInfo.zip,
      },
      phone: userInfo.phone,
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency,
      customer: customer.id,
      metadata: { selectedProducts: JSON.stringify(selectedProducts), conditions: JSON.stringify(conditions), userId },
      payment_method_types: [payment_method],
      description: `Payment for ${selectedProducts?.map((product: Product) => product?.name || "").join(", ")}`,
    })

    return NextResponse.json(
      {
        paymentIntent,
        customerId: customer?.id,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in payment process:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const payment_intent = url.searchParams.get('payment_intent') || ''


    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
    const intentSucceeded = paymentIntent.status === 'succeeded'

    if (intentSucceeded) {
      return NextResponse.redirect(
        `${process.env.ALLOWED_ORIGIN || ''}/todos`
      )
    } else {
      return NextResponse.redirect(
        `${process.env.ALLOWED_ORIGIN || ''
        }?failed=true&error=Something Went Wrong!`,
      )
    }
  } catch (error) {
    console.error('Error in payment process:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.redirect(
      `${process.env.ALLOWED_ORIGIN || ''}?failed=true&error=${errorMessage}`,
    )
  }
}
