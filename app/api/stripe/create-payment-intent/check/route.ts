import { NextResponse } from 'next/server'

import { checkUserPurchaseEligibility } from '@/utils/users/userManagement'
import { getProductDetails } from '@/utils/data/products/productUtils'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    // const { productId } = await req.json()
    const url = new URL(req.url)
    const email = url.searchParams.get('email') || ''
    const productId = url.searchParams.get('productId') || ''

    const product = await getProductDetails(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 },
      )
    }

    // const { error } = await checkUserPurchaseEligibility({ email, productId, product })
    // if (error) {
    //   return NextResponse.json(
    //     { error },
    //     { status: 400 },
    //   )
    // }

    const amount = product.prices[0]?.unit_amount
    if (amount === null || amount === undefined) {
      return NextResponse.json(
        { error: 'Product price is not available' },
        { status: 400 },
      )
    }


    return NextResponse.json({ msg: 'OK' }, { status: 200 })
  } catch (error) {
    console.error('Error in payment process:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
