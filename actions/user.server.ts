'use server'
import { createAdminClient } from '@/utils/supabase/index.initialize'
import { createClient } from '@/utils/supabase/server'

interface UpdateUser {
  userId: string
  payload: Partial<Users>
}

export const updateUser = async (data: UpdateUser) => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update(data.payload)
    .eq('id', data.userId)

  if (!error) {
    return { success: true }
  } else {
    return { success: false, error: error.message }
  }
}

export const getUser = async (userId: string) => {
  const supabase = await createClient()

  const { error, data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('error getting user', error)

  if (!error && data) {
    data.order_count = data.order_count ?? 0 // Ensure order_count is always a number
    data.old_user_id = data.old_user_id ?? null // Ensure old_user_id is always a string or null
    return { data }
  } else {
    return { data: null, error: error.message }
  }
}

export const resetPassword = async (email: string, origin: string) => {
  const supabase = createAdminClient()
  console.log('reset password redirectTo:', `${origin}/update-password?email=${encodeURIComponent(email)}`)
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/update-password?email=${encodeURIComponent(email)}`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
  }
}