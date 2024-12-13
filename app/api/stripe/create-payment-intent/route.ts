import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import { getProductDetails } from '@/utils/data/products/productUtils'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const {
      paymentMethodId,
      productId,
      userInfo,
      addOn,
      userId,
      installmentSubscriptionId,
    } = await req.json();

    const product = await getProductDetails(productId);

    let amount = product?.prices[0]?.unit_amount;

    // Fetch product or subscription details based on the provided ID
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    // Handle one-time payment scenario
    if (!installmentSubscriptionId) {
      if (amount === null || amount === undefined) {
        return NextResponse.json(
          { error: 'Product price is not available' },
          { status: 400 }
        );
      }

      // Add add-on price if applicable
      if (addOn?.price) {
        amount += addOn?.price * 100;
      }
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
    });

    // Handle subscription logic with 4 billing cycles 
    if (installmentSubscriptionId) {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: installmentSubscriptionId || '',
          },
        ],
        default_payment_method: paymentMethodId,
        metadata: {
          productId: product.id,
          productName: product.name,
          addOn_id: addOn?.id,
          addOn_name: addOn?.name,
          addOn_price: addOn?.price,
          addOn_description: addOn?.description,
          userId,
        },
        // cancels after 4 months
        cancel_at: Math.floor(Date.now() / 1000) + (4 * 30 * 24 * 60 * 60),
      });

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        productDetails: {
          name: product.name,
          price: ((amount ?? 0) / 100) / 4,
          productId: product.id,
        },
        userInfo,
        stripeCustomerId: customer.id,
      });
    } else {
      // Handle one-time payment scenario
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount ?? 0,
        currency: 'usd',
        customer: customer.id,
        payment_method: paymentMethodId,
        description: `Payment for ${product.name}`,
        metadata: {
          productId: product.id,
          productName: product.name,
          addOn_id: addOn?.id,
          addOn_name: addOn?.name,
          addOn_price: addOn?.price,
          addOn_description: addOn?.description,
          userId,
        },
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });

      if (paymentIntent.status === 'succeeded') {
        return NextResponse.json(
          {
            success: true,
            clientSecret: paymentIntent.client_secret,
            productDetails: {
              name: product.name,
              price: installmentSubscriptionId ? ((amount ?? 0) / 100) / 4 : amount,
              productId: product.id,
            },
            userInfo,
            stripeCustomerId: customer.id,
          },
          { status: 200 }
        );
      } else if (paymentIntent.status === 'requires_action') {
        return NextResponse.json(
          {
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            productDetails: {
              name: product.name,
              price: installmentSubscriptionId ? ((amount ?? 0) / 100) / 4 : amount,
              productId: product.id,
            },
            userInfo,
            stripeCustomerId: customer.id,
          },
          { status: 200 }
        );
      } else {
        throw new Error('Payment failed');
      }
    }
  } catch (error) {
    console.error('Error in payment process:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

