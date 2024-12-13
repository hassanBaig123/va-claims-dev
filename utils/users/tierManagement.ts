
import { getPurchaseProductsServer } from '../data/products/productUtils'
import { createClient } from '../supabase/server'
// import { tierPackageIds } from '@/utils/users/tierLevels'

//Function to set the initial state for a gold tier user
async function setInitialStateForGoldTierUserAdmin(
  userId: string,
): Promise<void> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  //set user_courses
  //get the product id for gold tier from tierPackageIds
  const tierPackageIds = await getPurchaseProductsServer('old-products')
  const goldTierProductId = tierPackageIds.find(
    (pkg) => pkg.metadata.tier === 'gold',
  )?.id
  if (!goldTierProductId) {
    console.error('No new grandmaster tier product ID found')
    return
  }

  console.log(goldTierProductId, "goldTierProductId");


  //right now the course ids are hardcoded in tierLevels.ts
  //in the future we will want to get the course ids from the courses table but the problem is
  //the product_id column is type text and has one product_id for a course even though different product ids can
  //be associated with the same course

  //get the course_ids for the gold tier from tierPackageIds
  const goldTierCourseIds = tierPackageIds.find(
    (pkg) => pkg.metadata.tier === 'gold',
  )?.metadata?.course_ids
  console.log("Gold Tier Course Ids: ", goldTierCourseIds);
  //insert each course_id into the user_courses table for the user_id
  if (!goldTierCourseIds || goldTierCourseIds.length === 0) {
    console.error('No new grandmaster tier course IDs found')
    return
  }
  for (const courseId of goldTierCourseIds) {
    console.log("courseId to insert", courseId);

    const { error } = await supabase
      .from('user_courses')
      .insert({ user_id: userId, course_id: courseId })
    if (error) throw new Error(error.message)
  }
}

async function setInitialStateForBronzeTierUserAdmin(
  userId: string,
): Promise<void> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  const tierPackageIds = await getPurchaseProductsServer('old-products')

  const bronzeTierProductId = tierPackageIds.find(
    (pkg) => pkg.metadata.tier === 'bronze',
  )?.id
  if (!bronzeTierProductId) {
    console.error('No expert tier product ID found')
    return
  }

  const bronzeTierCourseIds = tierPackageIds.find(
    (pkg) => pkg.metadata.tier === 'bronze',
  )?.metadata?.course_ids
  if (!bronzeTierCourseIds || bronzeTierCourseIds.length === 0) {
    console.error('No expert tier course IDs found')
    return
  }

  console.log('New Expert Tier Course IDs:', bronzeTierCourseIds)
  for (const courseId of bronzeTierCourseIds) {
    const { error } = await supabase
      .from('user_courses')
      .insert({ user_id: userId, course_id: courseId })
    if (error) {
      console.error(
        `Error inserting course ${courseId} for user ${userId}:`,
        error,
      )
      throw new Error(`Error setting up new expert tier course: ${error.message}`)
    }
  }

  console.log(`New Expert tier courses set up successfully for user ${userId}`)
}

//Function to set the initial state for a silver tier user
async function setInitialStateForSilverTierUserAdmin(
  userId: string,
): Promise<void> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const tierPackageIds = await getPurchaseProductsServer('old-products')
  //set user_courses
  //get the product id for silver tier from tierPackageIds
  const silverTierProductId = tierPackageIds.find(
    (pkg) => pkg.metadata.tier === 'silver',
  )?.id
  if (!silverTierProductId) {
    console.error('No new master tier product ID found')
    return
  }

  //right now the course ids are hardcoded in tierLevels.ts
  //in the future we will want to get the course ids from the courses table but the problem is
  //the product_id column is type text and has one product_id for a course even though different product ids can
  //be associated with the same course

  //get the course_ids for the gold tier from tierPackageIds
  const silverTierCourseIds = tierPackageIds.find(
    (pkg) => pkg.metadata.tier === 'silver',
  )?.metadata?.course_ids
  //insert each course_id into the user_courses table for the user_id
  if (!silverTierCourseIds || silverTierCourseIds.length === 0) {
    console.error('No new master tier course IDs found')
    return
  }
  console.log('Master Tier Course IDs:', silverTierCourseIds)
  for (const courseId of silverTierCourseIds) {
    const { error } = await supabase
      .from('user_courses')
      .insert({ user_id: userId, course_id: courseId })
    if (error) throw new Error(error.message)
  }
}

async function upgradeUserTier(userId: string, tier: string): Promise<void> {
  try {
    const supabase = await createClient(
      process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
    )
    let upgradeCourseIds: string[] = []
    const tierPackageIds = await getPurchaseProductsServer('old-products')
    switch (tier) {
      case 'upgrade_bronze_to_silver':
        console.log('User is upgrading from new expert to new master')
        upgradeCourseIds =
          tierPackageIds.find((pkg) => pkg.metadata.tier === 'upgrade_bronze_to_silver')
            ?.metadata?.course_ids || []
        if (!upgradeCourseIds || upgradeCourseIds.length === 0) {
          console.error('No new expert to new master tier course IDs found')
          break
        }
        console.log('New Expert to New Master Tier Course IDs:', upgradeCourseIds)
        break
      case 'upgrade_bronze_to_gold':
        console.log('User is upgrading from new expert to new grandmaster')
        upgradeCourseIds =
          tierPackageIds.find((pkg) => pkg.metadata.tier === 'upgrade_bronze_to_gold')
            ?.metadata?.course_ids || []
        if (!upgradeCourseIds || upgradeCourseIds.length === 0) {
          console.error('No new expert to new grandmaster tier course IDs found')
          break
        }
        console.log('New Expert to New Grandmaster Tier Course IDs:', upgradeCourseIds)
        break
      case 'upgrade_silver_to_gold':
        console.log('User is upgrading from master to gold')
        upgradeCourseIds =
          tierPackageIds.find((pkg) => pkg.metadata.tier === 'upgrade_silver_to_gold')
            ?.metadata?.course_ids || []
        if (!upgradeCourseIds || upgradeCourseIds.length === 0) {
          console.error('No new master to new grandmaster tier course IDs found')
          break
        }
        console.log('New Master to Gold Tier Course IDs:', upgradeCourseIds)
        break
    }
    if (upgradeCourseIds.length > 0) {
      for (const courseId of upgradeCourseIds) {
        const { data, error: selectError } = await supabase
          .from('user_courses')
          .select('user_id, course_id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .single()

        if (!selectError && data) {
          console.log(`User ${userId} already enrolled in course ${courseId}`)
          continue
        }

        const { error } = await supabase
          .from('user_courses')
          .insert({ user_id: userId, course_id: courseId })

        if (error)
          throw new Error(`Error upgrading user tier: ${error.message}`)
      }
    }
  } catch (error) {
    console.error('Error upgrading user tier:', error)
    throw new Error(
      `Error upgrading user tier: ${(error as unknown as Error).message}`,
    )
  }
}

// Function to get the user's current tier level based on their most recent purchase
async function getUserTierLevelAdmin(userId: string): Promise<string | null> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const tierPackageIds = await getPurchaseProductsServer('old-products')

  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('package_id, purchase_date')
    .eq('user_id', userId)
    .in(
      'package_id',
      tierPackageIds.map((pkg) => pkg.id),
    )
    .order('purchase_date', { ascending: false })
    .limit(1)

  if (purchasesError) {
    console.error('Error fetching user tier level:', purchasesError.message)
    throw new Error('Error fetching user tier level')
  }
  console.log('From Purchases: User tier level:', purchases)

  if (!purchases || purchases.length === 0) {
    console.error('No purchases found for user')
    return null
  }
  console.log('From Purchases: User tier level:', purchases[0].package_id)
  return purchases[0].package_id
}

async function getUsersTierLevel(userId: string): Promise<string | null> {
  const tierPackageIds = await getPurchaseProductsServer('old-products')
  const supabase = await createClient()
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('package_id, purchase_date')
    .eq('user_id', userId)
    .in(
      'package_id',
      tierPackageIds.map((pkg) => pkg.id),
    )
    .order('purchase_date', { ascending: false })
    .limit(1)

  if (purchasesError) {
    console.error('Error fetching user tier level:', purchasesError.message)
    throw new Error('Error fetching user tier level')
  }
  //console.log("From Purchases: User tier level:", purchases);

  if (!purchases || purchases.length === 0) {
    console.error('No purchases found for user')
    return null
  }
  //console.log("From Purchases: User tier level:", purchases[0].package_id);
  return purchases[0].package_id
}

export {
  getUserTierLevelAdmin,
  getUsersTierLevel,
  upgradeUserTier,
  setInitialStateForGoldTierUserAdmin,
  setInitialStateForSilverTierUserAdmin,
  setInitialStateForBronzeTierUserAdmin,
}
