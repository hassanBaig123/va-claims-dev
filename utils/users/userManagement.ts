import { createClient } from '@/utils/supabase/server'
import {
  getUserTierLevelAdmin,
  setInitialStateForGoldTierUserAdmin,
  setInitialStateForBronzeTierUserAdmin,
  setInitialStateForSilverTierUserAdmin,
} from './tierManagement'
import { getPurchaseCountAdmin } from './purchaseManagement'
import { getPurchaseProductsServer } from '../data/products/productUtils'

async function createNewUserWithPurchase(
  userInfo: {
    firstName?: string
    lastName?: string
    email?: string
    street?: string
    city?: string
    state?: string
    zip?: string
    phone?: string
  },
  stripeCustomerId: string,
  productId: string,
  paypalCustomerId?: string,
): Promise<string> {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  // Create user in auth.users
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email: userInfo.email,
      email_confirm: false,
    })

  if (authError)
    throw new Error(`Error creating auth user: ${authError.message}`)
  if (!authUser.user) throw new Error('User creation failed')

  const userId = authUser.user.id

  // Add user info to users table
  await addNewUserInfoToUserTableAdmin(
    userId,
    userInfo,
    stripeCustomerId,
    paypalCustomerId,
  )

  // Add customer to customers table
  await addCustomerToTableAdmin(userId, stripeCustomerId, paypalCustomerId)

  // Set initial state based on the product
  if (productId.includes('gold')) {
    await setInitialStateForGoldTierUserAdmin(userId)
  } else if (productId.includes('silver')) {
    await setInitialStateForSilverTierUserAdmin(userId)
  } else if (productId.includes('bronze')) {
    await setInitialStateForBronzeTierUserAdmin(userId)
  }

  return userId
}

async function addNewUserInfoToUserTableAdmin(
  id: string,
  userInfo: {
    firstName?: string
    lastName?: string
    email?: string
    street?: string
    city?: string
    state?: string
    zip?: string
    phone?: string
  },
  stripeCustomerId?: string,
  paypalCustomerId?: string,
): Promise<void> {
  console.log('Adding new user info to user table')
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const updates: { [key: string]: any } = {
    email: userInfo.email,
    full_name: `${userInfo.firstName} ${userInfo.lastName}`,
    billing_address: JSON.stringify({
      street: userInfo.street,
      city: userInfo.city,
      state: userInfo.state,
      zip: userInfo.zip,
      phone: userInfo.phone,
    }),
    payment_method: JSON.stringify({
      ...(stripeCustomerId && { stripeCustomerId }),
      ...(paypalCustomerId && { paypalCustomerId }),
    }),
    course_state: 'not_started',
    form_state: 'intake_not_started',
    last_notified: new Date().toISOString(),
    preferences: JSON.stringify({
      security_emails: true,
      marketing_emails: true,
      communication_emails: true,
    }),
  }

  const { error } = await supabase.from('users').update(updates).eq('id', id)

  if (error) {
    console.error('Error updating user info:', error)
    throw new Error(`Error updating user info: ${error.message}`)
  }
}

// Function to add a customer with their Stripe ID to the 'customers' table
async function addCustomerToTableAdmin(
  userId: string,
  stripeCustomerId: string,
  paypalCustomerId?: string,
): Promise<{ message: string }> {
  console.log(
    `Adding customer to table. User ID: ${userId}, Stripe Customer ID: ${stripeCustomerId}`,
  )
  console.log('Service Role Key:', process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY)
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  console.log('Supabase client created')

  try {
    console.log('Attempting to insert customer data into customers table')
    const { data, error } = await supabase
      .schema('public')
      .from('customers')
      .insert({ id: userId, stripe_customer_id: stripeCustomerId, paypal_customer_id: paypalCustomerId })

    if (error) {
      console.error('Error inserting customer data:', error)
      throw new Error(`Failed to add customer: ${error.message}`)
    }

    console.log('Customer data inserted successfully:', data)
    return { message: 'success' }
  } catch (error) {
    console.error('Unexpected error in addCustomerToTableAdmin:', error)
    throw error
  } finally {
    console.log('addCustomerToTableAdmin operation completed')
  }
}

const getUserDataByEmailAdmin = async (email: string): Promise<User | null> => {
  try {
    const supabase = await createClient(
      process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
    )
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('email', email)
      .single()

    if (error && error.code === 'PGRST116') {
      // No rows found
      console.log('No rows found')
      return null
    }

    if (error) {
      console.error('Error from getUserDataByEmailAdmin:', error)
      throw new Error(error.message)
    }

    if (count !== null && count > 1) {
      throw new Error('Multiple rows returned')
    }

    console.log('User Data from getUserDataByEmailAdmin:', data)

    return data
  } catch (error) {
    console.error('Error in getUserDataByEmail:', error)
    throw error
  }
}

const getUserDataById = async (id: string): Promise<User | null> => {
  try {
    const supabase = await createClient(
      process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
    )
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('id', id)
      .single()

    if (error && error.code === 'PGRST116') {
      // No rows found
      console.log('No rows found')
      return null
    }

    if (error) {
      console.error('Error from getUserDataById:', error)
      throw new Error(error.message)
    }

    if (count !== null && count > 1) {
      throw new Error('Multiple rows returned')
    }

    console.log('User Data from getUserDataById:', data)

    return data
  } catch (error) {
    console.error('Error in getUserDataById:', error)
    throw error
  }
}



async function createAndSendMagicLink(
  email: string,
  origin: string
): Promise<{ message: string | null }> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${origin}/todos`
      },
    })

    if (error) {
      throw new Error(`Error sending magic link: ${error.message}`)
    }
    console.log('Magic link sent successfully')

    return {
      message: 'success',
    }
  } catch (error) {
    console.error('Error in createAndSendMagicLink:', error)
    return {
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

const checkUserPurchaseEligibility = async ({ email, productId, product }: any) => {

  let user = await getUserDataByEmailAdmin(email)
  const isCurrentUser = !!user
  let userId = user?.id

  if (isCurrentUser && userId) {
    // Get user's tier level
    const userTierLevel = await getUserTierLevelAdmin(userId)

    // Check purchase eligibility
    const purchaseCount = await getPurchaseCountAdmin(userId, productId)

    // Check if the product is active
    if (product.metadata.active === false) {
      const error =
        product.metadata.messages.product_paused || 'Product is inactive'
      return { error }
    }

    // Check if the user is eligible to purchase
    if (product.metadata.purchase_rules.user_can_purchase === false) {
      const error =
        product.metadata.messages.not_eligible ||
        'You are not eligible to purchase this product'
      return { error }
    }

    // Check max purchases
    if (product.metadata.purchase_rules.max_purchases) {
      const purchaseLimit = parseInt(
        product.metadata.purchase_rules.max_purchases,
      )
      if (purchaseCount >= purchaseLimit) {
        const error =
          product.metadata.messages.max_purchases_reached ||
          'Maximum purchases reached'
        return { error }
      }
    }

    // Check tier level eligibility
    const packagesThatCanPurchase =
      product.metadata.purchase_rules.packages_that_can_purchase
    if (packagesThatCanPurchase && packagesThatCanPurchase.length > 0) {
      let userCanPurchase = userTierLevel
        ? packagesThatCanPurchase.includes(userTierLevel)
        : false
      if (packagesThatCanPurchase[0] === 'any') {
        userCanPurchase = true
      }
      if (!userCanPurchase) {
        const error =
          product.metadata.messages.not_eligible ||
          'You are not eligible to purchase this product'
        return { error }
      }
    }

    // Check if the product is an upgrade
    const tierPackageIds = await getPurchaseProductsServer('old-products')
    const tierPackage = tierPackageIds.find((pkg) => pkg.id === productId)
    console.log('Tier package found:', tierPackage)
    if (
      !tierPackage ||
      !tierPackage.metadata.tier ||
      ![
        'upgrade_bronze_to_silver',
        'upgrade_bronze_to_gold',
        'upgrade_silver_to_gold',
      ].includes(tierPackage.metadata.tier)
    ) {
      console.log(
        'Invalid upgrade package or user not eligible for this upgrade:',
        tierPackage,
      )
      return { error: 'Current users can only purchase upgrades' }
    }
  } else {
    // Check if new users can purchase
    if (product.metadata.purchase_rules.new_user_can_purchase === false) {
      const error =
        product.metadata.messages.not_eligible ||
        'You are not eligible to purchase this product'
      return { error }

    }
  }
  return { success: true }


}

// Add this function to the existing userManagement.ts file

async function getAllUserEmails(): Promise<string[]> {
  const supabase = await createClient(process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY);

  // Fetch emails from users table
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('email');

  if (usersError) {
    console.error('Error fetching user emails:', usersError);
    throw new Error('Failed to fetch user emails');
  }

  // Fetch emails from old_users table
  const { data: oldUsersData, error: oldUsersError } = await supabase
    .from('old_users')
    .select('user_email');

  if (oldUsersError) {
    console.error('Error fetching old user emails:', oldUsersError);
    throw new Error('Failed to fetch old user emails');
  }

  // Combine emails
  const allEmails = [
    ...usersData.map(user => user.email),
    ...oldUsersData.map(user => user.user_email)
  ];

  // Remove duplicates and filter out any null or undefined values
  const uniqueEmails = Array.from(new Set(allEmails.filter(Boolean)));

  console.log('Unique emails:', uniqueEmails)

  return uniqueEmails as string[];
}

async function hasUserMadePurchase(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient(process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY)

    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (error) {
      console.error('Error checking user purchases:', error)
      throw new Error(`Failed to check user purchases: ${error.message}`)
    }

    return data.length > 0
  } catch (error) {
    console.error('Error in hasUserMadePurchase:', error)
    throw error
  }
}

async function getUserCourseData(userId: string): Promise<{ displayMessage: string }> {
  const supabase = await createClient(process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('user_courses')
    .select(`
      courses(
          name
        )`)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user courses:', error);
    throw new Error(`Failed to fetch user courses: ${error.message}`);
  }

  const courseNames = data.map(item => item.courses?.name).filter(Boolean);

  const displayMessage = courseNames.length === 1
    ? `Your Course: ${courseNames[0]}`
    : 'Complete Your Training';

  return { displayMessage };
}


export const getIntroVideoStatus = async (userId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .schema('public')
    .from('user_meta')
    .select('*')
    .eq('user_id', userId)
    .eq('meta_key', 'intro_video_done')

  return data?.[0]?.meta_value ? Boolean(data?.[0]?.meta_value) : false
}


export {
  checkUserPurchaseEligibility,
  createNewUserWithPurchase,
  addNewUserInfoToUserTableAdmin,
  addCustomerToTableAdmin,
  getUserDataByEmailAdmin,
  createAndSendMagicLink,
  getAllUserEmails,
  getUserDataById,
  hasUserMadePurchase,
  getUserCourseData,
}
