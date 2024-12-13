import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'

type Product = {
  id: string
  active: boolean
  name: string
  description: string
  image: string
  metadata: any
}

type Price = {
  product_id: string
  active: boolean
  description: string
  unit_amount: number
  currency: string
  type: string
  interval?: string
  interval_count?: number
  trial_period_days?: number
  metadata: any
}

type SupabaseProductResponse = {
  data: Product | null
  error: any
}

type SupabasePriceResponse = {
  error: any
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('id')

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 },
    )
  }

  const { data: product, error }: SupabaseProductResponse = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 },
    )
  }

  return NextResponse.json(product, { status: 200 })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const {
      name,
      description,
      price,
      currency,
      type,
      interval,
      interval_count,
      trial_period_days,
      metadata,
      image,
      active,
    } = body

    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name,
      description,
      images: [image],
      metadata,
    })

    // Create price in Stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price,
      currency,
      recurring:
        type === 'recurring'
          ? { interval, interval_count, trial_period_days }
          : undefined,
    })

    // Insert into products table
    const { data: product, error: productError }: SupabaseProductResponse =
      await supabase
        .from('products')
        .insert([
          {
            id: stripeProduct.id,
            name,
            description,
            metadata,
            image,
            active,
          } as Product,
        ])
        .single()

    if (productError) {
      throw productError
    }

    if (!product) {
      throw new Error('Product creation failed')
    }

    // Insert into prices table
    const { error: priceError }: SupabasePriceResponse = await supabase
      .from('prices')
      .insert([
        {
          product_id: product.id,
          active: true,
          description,
          unit_amount: price,
          currency,
          type,
          interval,
          interval_count,
          trial_period_days,
          metadata,
        } as any,
      ])

    if (priceError) {
      throw priceError
    }

    return NextResponse.json(
      { message: 'Product added successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { id, active, name, description, image, metadata } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      )
    }

    const { data: product, error: productError }: SupabaseProductResponse =
      await supabase
        .from('products')
        .update({ active, name, description, image, metadata })
        .eq('id', id)
        .single()

    if (productError) {
      throw productError
    }

    return NextResponse.json(
      { message: 'Product updated successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()

  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      )
    }

    const { error: productError }: SupabasePriceResponse = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (productError) {
      throw productError
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    )
  }
}
