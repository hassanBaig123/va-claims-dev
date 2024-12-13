import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import { getProductDetails } from '@/utils/data/products/productUtils'
import { checkUserPurchaseEligibility } from '@/utils/users/userManagement'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { currency, payment_method, userInfo, productId, addOn, } = await req.json()

    const product = await getProductDetails(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 },
      )
    }

    // const { error } = await checkUserPurchaseEligibility({ email: userInfo.email, productId, product })
    // if (error) {
    //   return NextResponse.json(
    //     { error },
    //     { status: 400 },
    //   )
    // }

    let amount = product.prices[0]?.unit_amount
    if (amount === null || amount === undefined) {
      return NextResponse.json(
        { error: 'Product price is not available' },
        { status: 400 },
      )
    }
    if (addOn?.price)
      amount += addOn?.price * 100

    const customer = await stripe.customers.create({
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
      customer: customer.id,
      amount,
      currency: currency,
      payment_method_types: [payment_method],
      description: `Payment for ${product.name}`,
      metadata: {
        productId: product.id, productName: product.name,
        addOn_id: addOn?.id,
        addOn_name: addOn?.name,
        addOn_price: addOn?.price,
        addOn_description: addOn?.description,
      },
    })

    console.log('Payment Intent:', paymentIntent)

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        customerId: customer?.id,
        paymentIntent: paymentIntent,
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
    const addOnId = url.searchParams.get('addOnId') || ''
    const productId = url.searchParams.get('productId') || ''
    const payment_intent = url.searchParams.get('payment_intent') || ''

    const product = await getProductDetails(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 },
      )
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
    const intentSucceeded = paymentIntent.status === 'succeeded'

    if (intentSucceeded) {
      const unitAmount = product.prices[0]?.unit_amount
      if (!unitAmount) {
        return NextResponse.redirect(
          `${process.env.ALLOWED_ORIGIN || ''}?failed=true&error=Product price is not available`,
        )
      }
      
      const formattedPrice = (unitAmount / 100).toFixed(2)
      return NextResponse.redirect(
        `${process.env.ALLOWED_ORIGIN || ''}/purchase-result?success=true&productId=${productId}&price=${formattedPrice}&productName=${product.name}${addOnId ? `&addOnId=${addOnId}` : ""}`
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
