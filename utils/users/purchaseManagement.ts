import { createClient } from '../supabase/server'
import { generateSignedUrl } from '@/utils/auth'
import {
  upgradeUserTier,
  getUserTierLevelAdmin,
  setInitialStateForGoldTierUserAdmin,
  setInitialStateForBronzeTierUserAdmin,
  setInitialStateForSilverTierUserAdmin,
} from './tierManagement'
import { getPurchaseProductsServer } from '../data/products/productUtils'


export interface AddOn {
  id: string
  name: string
  price: number
  description: string
}

// Function to record a purchase in the 'purchases' tablelet intervalCounter = 1
async function recordPurchaseAdmin(
  { userId,
    amount,
    productId,
    subscription,
    purchaseIteration = 0
  }:
    {
      userId: string,
      amount: number,
      productId: string,
      subscription?: any
      purchaseIteration?: number
    }
): Promise<{ message: string }> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  const { error } = await supabase.from('purchases').insert([
    {
      user_id: userId,
      package_id: productId,
      purchase_date: new Date().toISOString(),
      amount,
      metaData: subscription?.id ? { subscriptionId: subscription?.id, installmentNumber: purchaseIteration + 1 } : {}
    },
  ])

  console.log({
    user_id: userId,
    package_id: productId,
    purchase_date: new Date().toISOString(),
    amount,
    metaData: subscription?.id ? { subscriptionId: subscription?.id } : {}
  }, 'record purchase objet--------------------')
  if (error) {
    console.error('Error inserting purchase in purchases table', error)
    throw new Error(error.message)
  }
  return { message: 'success' }
}
async function sendEmailToUser(
  user: any,

): Promise<{ message?: string, error?: any }> {
  try {
    console.log('sending mail')
    const contactUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        templateName: 'additionalFormPurchased',
        templateData: {
          name: user?.full_name,
          formLink: generateSignedUrl(`/`),
          subject: 'Additional Letter Purchased Successfully',
          message: ''
        },
      }),
    })

    if (contactUserResponse.ok) {
      console.log('email sent')

      return { message: 'success' }

    }
  } catch (error) {
    console.error('Error sendEmailToUser:', error)
    return { error }

  } finally {
    return { message: 'Unhandled sendEmailToUser' }

  }
}

// Function to get the purchase count of a specific product for a user
async function getPurchaseCountAdmin(
  userId: string,
  productId: string,
): Promise<number> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('package_id', productId)

  if (error) {
    console.error('Error fetching purchase count:', error.message)
    throw new Error('Error fetching purchase count')
  }

  return purchases.length
}

interface RecordUserPurchases {
  addOn?: AddOn,
  userId: string,
  subscription?: any
  product: ProductDetails,
  purchaseIteration?: number

}

async function recordPurchaseAndSetUserState(
  { userId,
    product,
    addOn,
    subscription,
    purchaseIteration
  }
    : RecordUserPurchases
) {

  const price = subscription?.id ? (product.prices[0]?.unit_amount ?? 0 / 100) / 4 : product.prices[0]?.unit_amount ?? 0
  await recordPurchaseAdmin({
    userId,
    subscription,
    amount: price,
    purchaseIteration,
    productId: product.id,
  })
  console.log('Purchase recorded')
  await sendEmailToUser({ email: 'user@example.com', full_name: 'User Name' })
  if (addOn && addOn.id) {
    await recordPurchaseAdmin({
      userId,
      subscription,
      purchaseIteration,
      amount: addOn?.price,
      productId: addOn?.id,
    })
    console.log('Add-on Purchase recorded')
  }

  const tierPackageIds = await getPurchaseProductsServer('old-products')
  const tierPackage = tierPackageIds.find((pkg) => pkg.id === product.id)

  if (purchaseIteration === 0) {
    if (tierPackage) {
      switch (tierPackage.metadata.tier) {
        case 'gold':
          await setInitialStateForGoldTierUserAdmin(userId)
          break
        case 'silver':
          await setInitialStateForSilverTierUserAdmin(userId)
          break
        case 'bronze':
          await setInitialStateForBronzeTierUserAdmin(userId)
          break
      }
      await handlePurchasePromotion(userId)
    } else {
      await setInitialStateForBronzeTierUserAdmin(userId)
    }
  }
}


type TierLevel = 'bronze' | 'silver' | 'gold'

async function processUserUpgrade(userId: string, product: ProductDetails, addOn?: AddOn) {
  try {
    console.log('Processing upgrade for user ID:', userId)

    const currentTierLevel = (await getUserTierLevelAdmin(userId)) as TierLevel
    console.log('Current tier level:', currentTierLevel)
    if (!currentTierLevel) {
      throw new Error('User does not have a current tier level')
    }

    const validUpgrades: Record<TierLevel, string[]> = {
      bronze: ['upgrade_bronze_to_silver', 'upgrade_bronze_to_gold'],
      silver: ['upgrade_silver_to_gold'],
      gold: [],
    }

    const tierPackageIds = await getPurchaseProductsServer('old-products')
    console.log(tierPackageIds, "tierPackageIds");


    const currentTierPackage = tierPackageIds.find(
      (pkg) => pkg.id === currentTierLevel,
    )

    console.log('Current tier package:', currentTierPackage)
    if (!currentTierPackage || !currentTierPackage.metadata.tier) {
      throw new Error('Invalid current tier package')
    }

    const upgradeTierPackage = tierPackageIds.find(
      (pkg) => pkg.id === product.id,
    )
    console.log('Upgrade tier package:', upgradeTierPackage)
    if (!upgradeTierPackage || !upgradeTierPackage.metadata.tier) {
      throw new Error('Invalid upgrade tier package')
    }
    const tierKey = (currentTierPackage?.metadata?.tierKey || currentTierPackage?.metadata?.tier)
    if (
      !validUpgrades[tierKey as TierLevel].includes(
        upgradeTierPackage.metadata.tier,
      )
    ) {
      console.log('User not eligible for this upgrade:', upgradeTierPackage)
      throw new Error('User not eligible for this upgrade')
    }

    // Record purchase and set user state
    await recordPurchaseAndSetUserState({
      userId,
      product,
      addOn,
    })

    // Perform the upgrade
    await upgradeUserTier(userId, upgradeTierPackage.metadata.tier)
    console.log('User tier upgraded')

    console.log('User upgrade processing completed for user ID:', userId)
    return true
  } catch (error) {
    console.error('Error in user upgrade processing:', error)
    throw error
  }
}


const handlePurchasePromotion = async (userId: string) => {
  const now = new Date()
  const blackFridayDate = new Date('2024-12-01T23:59:59')

  const isBlackFridayYetToPass = (now: Date) => {
    return now < blackFridayDate
  }

  if (isBlackFridayYetToPass(now)) {
    console.info('Added Black Friday promotion for user: ' + userId)
    const supabase = await createClient()
    const { error } = await supabase
      .from('user_meta')
      .insert([{
        user_id: userId,
        meta_key: 'planPurchasePromotion',
        meta_value: "BLACK FRIDAY PROMO",
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }])
    if (error) {
      console.error('Error in handling purchase promotion---:', error)
    }
  }
}

export {
  processUserUpgrade,
  recordPurchaseAdmin,
  sendEmailToUser,
  getPurchaseCountAdmin,
  recordPurchaseAndSetUserState,
}
