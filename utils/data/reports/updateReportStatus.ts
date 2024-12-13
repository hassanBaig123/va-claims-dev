import { createClient } from '@/utils/supabase/server'

export async function changeReportsStatus({
  report_id,
  status,
}: {
  report_id: string
  status: FormsStatus
}): Promise<{ data: any; error: any }> {
  const supabase = await createClient()

  let data, error

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log(userError)
    error = userError
  } else {
    //Get user id
    const user_id = userData?.user?.id

    // Check if the report exists before attempting to update
    const { data: existingReport, error: existingReportError } = await supabase
      .from('reports')
      .select('id')
      .eq('id', report_id.toString())
      .single()

    if (existingReportError || !existingReport) {
      console.log('No report found with the given ID before update:', report_id)
      return {
        data: null,
        error: { message: 'No report found with the given ID before update' },
      }
    }

    // Update form in the forms table either an intake form or supplemental form
    // For an intake form, update the status to submission_approved
    const { data: reportData, error: approvedReportError } = await supabase
      .from('reports')
      .update({ status: status })
      .eq('id', report_id.toString())
      .select('id, report, status, user_id, created_at, updated_at')
      .single()

    data = reportData

    if (approvedReportError) {
      console.log('Approving report error:', approvedReportError)
      error = approvedReportError
    }

    if (!reportData) {
      console.log('No report found with the given ID:', report_id)
      error = { message: 'No report found with the given ID' }
    }
  }

  return { data, error }
}
