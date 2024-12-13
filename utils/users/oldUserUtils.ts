import { createClient } from '@/utils/supabase/server'


export async function getOldUserByEmail(email: string) {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  console.log('Searching for email:', email)
  const { data, error } = await supabase
    .from('old_users')
    .select('*')
    .ilike('user_email', email)
    .single()

  if (error) {
    console.error('Error fetching old user:', error)
    return null
  }

  return data
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .single()

  if (error) {
    console.error('Error fetching old user:', error)
    return null
  }

  return data
}


export async function getOldUserProductId(userId: string) {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  console.log(userId)

  const { data, error } = await supabase
    .from('old_purchases')
    .select('package_id, purchase_date, amount')
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false })
    .limit(1)
    .single()

  console.log(data, '----', error)

  if (error) {
    console.error('Error fetching old user product ID:', error)
    return null
  }
  if (!data) {
    return null
  }
  return data
}

export async function getOldUserCourses(userId: string) {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  const { data, error } = await supabase
    .from('old_user_courses')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching old user courses:', error)
    return null
  }

  return data
}

export async function getOldUserBillingInfo(userId: string) {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  const { data, error } = await supabase
    .from('old_user_meta')
    .select('*')
    .eq('user_id', userId)



  let billingInfo: any = {
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  }

  data?.forEach((key) => {
    console.log(key.meta_key)
    if (key.meta_key === 'billing_address_1') {
      billingInfo.street = key.meta_value
    }
    if (key.meta_key === 'billing_city') {
      billingInfo.city = key.meta_value
    }
    if (key.meta_key === 'billing_state') {
      billingInfo.state = key.meta_value
    }
    if (key.meta_key === 'billing_postcode') {
      billingInfo.zip = key.meta_value
    }
    if (key.meta_key === 'billing_phone') {
      billingInfo.phone = key.meta_value
    }

  })


  if (error) {
    console.error('Error fetching old user courses:', error)
    return null
  }

  return billingInfo
}

export async function getOldCustomerInfo(userId: string) {
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )

  const { data, error } = await supabase
    .from('old_customers')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching old customer info:', error)
    return null
  }

  return data
}

export async function createUserFromOldData(
  id: string,
  oldUserData: any,
  // {
  //   purchase: {
  //     package_id: string | null
  //     purchase_date: string | null
  //     amount: number | null
  //   }
  //   courses: {
  //     id: string
  //     watched_videos: Json | null
  //     course_id: string | null
  //     user_id: number | null
  //   }[]
  //   customer: {
  //     id: string
  //     stripe_customer_id: string | null
  //     paypal_id: string | null
  //     user_id: number | null
  //   }[]
  // },
): Promise<{ success: boolean; message?: string }> {
  console.log('Creating new user from old user data')
  const supabase = await createClient(
    process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
  )
  const errors: string[] = []

  // Record the purchase
  if (
    oldUserData.purchase.package_id &&
    oldUserData.purchase.purchase_date &&
    oldUserData.purchase.amount !== null
  ) {
    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: id,
      package_id: oldUserData.purchase.package_id,
      purchase_date: oldUserData.purchase.purchase_date,
      amount: oldUserData.purchase.amount,
    })
    if (purchaseError) {
      errors.push(`Error inserting purchase: ${purchaseError.message}`)
    }
  } else {
    errors.push('Skipping purchase insert due to missing data')
  }

  // Insert courses
  for (const course of oldUserData.courses) {
    if (course.course_id) {
      const { error: courseError } = await supabase
        .from('user_courses')
        .insert({
          user_id: id,
          course_id: course.course_id,
          watched_videos: course.watched_videos,
        })
      if (courseError) {
        errors.push(`Error inserting course: ${courseError.message}`)
      }
    } else {
      errors.push('Skipping course insert due to missing course_id')
    }
  }

  // Insert customer
  if (oldUserData.customer && oldUserData.customer.length > 0) {
    const { error: customerError } = await supabase.from('customers').insert({
      id: id,
      stripe_customer_id: oldUserData.customer[0].stripe_customer_id,
      paypal_customer_id: oldUserData.customer[0].paypal_id,
    })
    if (customerError) {
      errors.push(`Error inserting customer: ${customerError.message}`)
    }
  }

  // Insert Billing Info
  if (oldUserData.billingInfo) {
    const { error: billingInfoError } = await supabase.from('users').update({
      billing_address: oldUserData.billingInfo,
    }).eq('id', id)
    if (billingInfoError) {
      errors.push(`Error inserting billing info: ${billingInfoError.message}`)
    }
  }



  if (errors.length > 0) {
    console.log('Errors:', errors)
    return { success: false, message: errors.join('; ') }
  }

  return {
    success: true,
    message: 'User data migration completed successfully',
  }
}