import { NextResponse } from 'next/server'
import {
  createAndSendMagicLink,
  getUserDataByEmailAdmin,
  createNewUserWithPurchase,
  getUserDataById,
} from '@/utils/users/userManagement'
import { getProductDetails } from '@/utils/data/products/productUtils'
import {
  processUserUpgrade,
  recordPurchaseAndSetUserState,
} from '@/utils/users/purchaseManagement'
import { getUsersTierLevel } from '@/utils/users/tierManagement'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const origin = process.env.ALLOWED_ORIGIN || ''
    const { addOn, details, productId, user_id, paypalProduct } = await req.json()
    const product = await getProductDetails(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 },
      )
    }
    // Check if the user is a current user
    let user: any = user_id ? await getUserDataById(user_id) : await getUserDataByEmailAdmin(details?.payer?.email_address);
    let userTierLvel = user?.id ? await getUsersTierLevel(user.id) : null
    let userId = user?.id
    const isCurrentUser = !!user
    let isFreeTier = userTierLvel === null

    console.log("api/paypal user", user)

    const userInfo = {
      firstName: details?.payer?.name?.given_name,
      lastName: details?.payer?.name?.surname,
      email: details.payer.email_address,
      street: details?.purchase_units?.[0]?.shipping?.address?.address_line_1,
      city: '',
      state: '',
    }

    if (!isCurrentUser) {
      // Create new user and handle purchase
      userId = await createNewUserWithPurchase(
        userInfo,
        '',
        productId,
        details?.payer?.payer_id,
      )

      // Send magic link
      await createAndSendMagicLink(userInfo?.email, origin)

      // Record purchase and set user state
      await recordPurchaseAndSetUserState({ userId, product, addOn })
    } else if (userId) {
      if (isFreeTier) { // free tier
        await recordPurchaseAndSetUserState({ userId, product, addOn })
      } else {
        // Process upgrade for existing user
        await processUserUpgrade(userId, product)
      }
      if (user_id) {
        console.log('user_id', user_id)
        await createAndSendMagicLink(user.email, origin)
      }
    } else {
      throw new Error('User ID is undefined for current user')
    }

    return NextResponse.json(
      {
        url:
          `${process.env.ALLOWED_ORIGIN || ''}/purchase-result?success=true&productId=${productId}&price=${paypalProduct?.price}&productName=${product.name}${addOn?.id ? `&addOnId=${addOn?.id}` : ""}`
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in payment process:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json(
      {
        error: errorMessage,
        url: `${process.env.ALLOWED_ORIGIN || ''}?failed=true&error=${errorMessage}`,
      },
      { status: 400 },
    )
  }
}
