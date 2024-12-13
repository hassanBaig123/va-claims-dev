import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe'

const fetchPrices = async (productId: string) => {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
  });

  return prices.data.length > 0 ? prices.data[0].id : null;
};
export async function POST(req: Request) {
  try {
    const { products, formId } = await req.json();

    const productCounts = products.reduce((acc: Record<string, number>, productId: string) => {
      if (acc[productId]) {
        acc[productId] += 1;
      } else {
        acc[productId] = 1;
      }
      return acc;
    }, {});

    const priceIds = await Promise.all(
      Object.keys(productCounts).map((productId) => fetchPrices(productId))
    );

    const validPriceItems = Object.keys(productCounts)
      .map((productId, index) => {
        const priceId = priceIds[index];
        if (priceId) {
          return {
            price: priceId,
            quantity: productCounts[productId],
          };
        }
        return {
          price: "",
          quantity: 0,
        };
      })
      .filter((item) => item?.quantity !== 0);

    if (validPriceItems.length === 0) {
      return NextResponse.json({ error: 'No valid products available.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validPriceItems,
      mode: 'payment',
      payment_intent_data: {
        metadata: {
          formId: formId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/todos`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/todos`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
