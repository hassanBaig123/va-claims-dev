import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getProductDetails } from '@/utils/data/products/productUtils'
import { processUserUpgrade, sendEmailToUser, recordPurchaseAndSetUserState } from '@/utils/users/purchaseManagement'
import { createAndSendMagicLink, createNewUserWithPurchase, getUserDataByEmailAdmin, getUserDataById } from '@/utils/users/userManagement'
import { getUsersTierLevel } from '@/utils/users/tierManagement'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const request = await req.json()
  const { type, data } = request

  const handler: any = {
    "payment_intent.requires_action": async () => {
      // Just acknowledge the event, frontend handles the redirect
      return NextResponse.json({ msg: `Acknowledged: ${type}` }, { status: 200 });
    },

    "payment_intent.payment_failed": async () => {
      const paymentIntent = data.object;
      const errorMessage = paymentIntent.last_payment_error?.message || 'Payment failed';

      return NextResponse.json({ error: errorMessage }, { status: 200 });
    },

    "payment_intent.succeeded": async () => {
      try {
        const supabase = await createClient(
          process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
        )
        console.log('payment_intent.succeeded Triggered')
        const customer: any = await stripe.customers.retrieve(
          data.object.customer
        )
        const eventData = data?.object;
        const invoiceId = data?.object?.invoice;

        const invoice = invoiceId && await stripe.invoices.retrieve(invoiceId);
        const subscriptionId = invoice?.subscription || '';
        const subscription = subscriptionId && await stripe.subscriptions.retrieve(subscriptionId);
        const subsMetadata = subscription?.metadata || {};

        const { data: purchases, error } = await supabase
          .from('purchases')
          .select('*') // You can specify columns as needed
          .eq('metaData->>subscriptionId', subscriptionId);

        const purchaseIteration = purchases?.reduce((prev: any, current: any) => {
          return (prev > +current.metaData?.installmentNumber) ? prev : +current.metaData?.installmentNumber
        }, 0)

        const metadata = data?.object?.invoice === null ? data?.object?.metadata : subsMetadata;
        let user: any = metadata?.userId ? await getUserDataById(metadata?.userId) : await getUserDataByEmailAdmin(customer.email)
        let userTierLvel = user?.id ? await getUsersTierLevel(user.id) : null
        let isFreeTier = userTierLvel === null

        if (metadata?.conditions) {
          const conditionArray = JSON.parse(metadata?.conditions)
          const { url, error }: any = await handleCreateSupplementaryFormsAndRecordPurchases({ conditions: conditionArray, userId: metadata?.userId })
          if (error) {
            return NextResponse.json({ error }, { status: 500 });
          }
          const { error: emailError }: any = await sendEmailToUser(user)
          if (emailError) {
            return NextResponse.json({ error: emailError }, { status: 500 });
          }

          return NextResponse.json({ url }, { status: 200 });
        } else {
          const addOn = {
            id: metadata?.addOn_id,
            name: metadata?.addOn_name,
            price: metadata?.addOn_price,
            description: metadata?.addOn_description,
          }
          const product = await getProductDetails(metadata?.productId)
          if (!product) {
            return NextResponse.json({ error: 'Product not found or inactive' }, { status: 404 });
          }
          // Check if the user is a current user
          const isCurrentUser = !!user
          let userId = user?.id

          console.log(customer);

          const userInfo = {
            firstName: customer.name.split(" ")[0],
            lastName: customer.name.split(" ")[1],
            email: customer.email,
            street: customer?.address?.line1,
            city: customer?.address?.city,
            state: customer?.address?.state,
            zip: customer?.address?.postal_code,
            phone: customer.phone,
          }

          if (!isCurrentUser) {
            // Create new user and handle purchase
            userId = await createNewUserWithPurchase(
              userInfo,
              data.object.customer,
              metadata?.productId,
            )
            const origin = process.env.ALLOWED_ORIGIN || ''
            // Send magic link
            await createAndSendMagicLink(userInfo.email, origin)
            // Record purchase and set user state
            await recordPurchaseAndSetUserState({ userId, product, addOn, subscription, purchaseIteration })
          } else if (userId) {
            if (isFreeTier) { // free tier
              await recordPurchaseAndSetUserState({ userId, product, addOn, subscription, purchaseIteration })
            } else {
              // Process upgrade for existing user
              await processUserUpgrade(userId, product, metadata?.productId)
            }

            await supabase.from('users').update({
              billing_address: {
                street: customer?.address?.line1,
                city: customer?.address?.city,
                state: customer?.address?.state,
                zip: customer?.address?.postal_code,
                phone: customer?.phone
              },
            }).eq('id', user.id)

            if (!metadata?.userId) {
              // Send magic link
              await createAndSendMagicLink(user.email, origin)
            }

          } else {
            return NextResponse.json({ error: 'User ID is undefined for current user' }, { status: 400 });
          }
          console.log("product price: ", product.prices[0].unit_amount);
          return NextResponse.json({
            url: `${process.env.ALLOWED_ORIGIN || ''}/purchase-result?success=true&productId=${metadata?.productId}&price=${product.prices[0].unit_amount}&productName=${encodeURIComponent(product.name)}${addOn?.id ? `&addOnId=${addOn?.id}` : ""}`
          }, { status: 200 });
        }
      } catch (error) {
        console.error('Error in payment process:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    },

    "payment_intent.requires_payment_method": async () => {
      const paymentIntent = data.object;
      return NextResponse.json({
        error: paymentIntent.last_payment_error?.message || 'Payment method required',
        requiresNewPaymentMethod: true
      }, { status: 200 });
    },

    // Add a default handler for unhandled event types
    default: () => {
      console.log(`Unhandled event type: ${type} `);
      return NextResponse.json({ msg: `Unhandled event type: ${type} ` }, { status: 200 });
    }
  }

  const eventHandler = handler[type] || handler.default;
  const response = await eventHandler();

  return response;
}

const handleCreateSupplementaryFormsAndRecordPurchases = async ({ conditions, userId }: any) => {
  if (conditions) {
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/form/status-additional`, {
        method: 'PUT',
        body: JSON.stringify({
          conditions,
          user_id: userId,
          status: 'submitted',
          submit_type: 'NONE',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!result.ok) {
        throw new Error('Failed to supplement form')
      }

      return { url: `${process.env.ALLOWED_ORIGIN || ''}/todos` }
    } catch (error) {
      console.error('Error in payment process---:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      return { error: errorMessage }
    }
  }
}

