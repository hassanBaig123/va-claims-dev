'use server'

import { createClient } from '@/utils/supabase/server'
import {
  getUserByEmail,
  getOldUserByEmail,
  getOldUserCourses,
  getOldCustomerInfo,
  getOldUserProductId,
  getOldUserBillingInfo,
  createUserFromOldData,
} from '@/utils/users/oldUserUtils'

export const signInWithMagicLink = async (
  email: string,
  referralCode?: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const supabase = await createClient()

    if (typeof email !== 'string') {
      return { success: false, message: 'Invalid email' }
    }

    let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/todos`
    if (referralCode) {
      redirectUrl = `${redirectUrl}?referralCode=${referralCode}`
    }

    let data = {}
    if (referralCode) {
      data = {
        referralCode,
      }
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: referralCode ? true : false,
        data
      },
    })
    console.log('error:', error)
    if (error) {
      return { success: false, message: error?.message }
    } else {
      return { success: true }
    }
  } catch (e: any) {
    return { success: false, message: e?.message }
  }
}

export async function coreMigrateOldUser(email: string) {
  const oldUser = await getOldUserByEmail(email)
  const supabaseAdmin = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  if (!oldUser) {
    return { success: false, message: 'User not found' }
  }

  const newUser = await getUserByEmail(email)

  if (newUser?.old_user_id) {
    return { success: false, message: 'Migration already done.' }
  }

  let migrationErrors = []
  let oldUserData: any = {}

  // Migrate user purchase
  try {
    const oldUserPurchase = await getOldUserProductId(oldUser.id.toString())
    if (oldUserPurchase) {
      oldUserData.purchase = oldUserPurchase
    }
  } catch (error) {
    migrationErrors.push('Failed to migrate user purchase')
  }

  // Migrate user courses
  try {
    const oldUserCourses = await getOldUserCourses(oldUser.id.toString())
    if (oldUserCourses) {
      oldUserData.courses = oldUserCourses
    }
  } catch (error) {
    migrationErrors.push('Failed to migrate user courses')
  }

  // Migrate user courses
  try {
    const billingInfo = await getOldUserBillingInfo(oldUser.id.toString())
    if (billingInfo) {
      oldUserData.billingInfo = billingInfo
    }
  } catch (error) {
    migrationErrors.push('Failed to migrate user address')
  }

  // Migrate customer info
  try {
    const oldCustomerInfo = await getOldCustomerInfo(oldUser.id.toString())
    if (oldCustomerInfo) {
      oldUserData.customer = oldCustomerInfo
    }
  } catch (error) {
    migrationErrors.push('Failed to migrate customer info')
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 5000,
  })

  const authUser = data.users.find(
    (user: any) => user.email === oldUser.user_email,
  )

  console.log(oldUser.user_email, authUser)

  let userId

  if (authUser) {
    userId = authUser?.id
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: {
        full_name: oldUser.display_name,
        old_user_id: oldUser.id,
      },
    })

    if (error || !data.user) {
      console.log('create user error:', error)
      return {
        success: false,
        message: 'Failed to create new user',
        errors: migrationErrors,
      }
    }

    userId = data.user.id
  }

  // Migrate old user data to new user
  try {
    if (userId) {
      const createUserResult = await createUserFromOldData(userId, oldUserData)
      if (!createUserResult || !createUserResult.success) {
        console.log('create user result:', createUserResult)
        migrationErrors.push(
          createUserResult?.message || 'Failed to create user from old data',
        )
      }
    }
  } catch (error) {
    migrationErrors.push('Error occurred while creating user from old data')
  }

  const success = migrationErrors.length === 0
  const message = success
    ? 'User migration successful'
    : 'User migration partially successful'

  return {
    success,
    message,
    userId: userId,
    errors: migrationErrors.length > 0 ? migrationErrors : undefined,
  }
}

export async function doFullOldUserMigration() {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const { data, error }: any = await supabase
    .from('old_users')
    .select('user_email')

  if (error) {
    console.error('Error fetching data:', error)
  }

  for (const user of data) {
    await coreMigrateOldUser(user.user_email)
  }
}
