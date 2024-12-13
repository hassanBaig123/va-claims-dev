import { createClient } from '@/utils/supabase/server'

export const getReportById = async (id: string) => {
  const supabase = await createClient()
  //Get user from cookies
  const user = await supabase.auth.getUser()
  //Get user id
  const user_id = user.data.user?.id

  //Upload form into the forms table
  const { data, error } = await supabase
    .schema('public')
    .from('decrypted_reports')
    .select(
      'id, status, users (id, full_name), decrypted_report, created_at, updated_at',
    )
    .eq('id', id)
    .single()

  if (error) {
    console.log('POST error', error)
    throw new Error(error.message)
  }

  if (data) {
    return data
  }
}
