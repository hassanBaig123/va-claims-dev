import { createClient } from '@/utils/supabase/server'
import { DateTime } from 'luxon'

export async function changeFormStatus({
  form_id,
  status,
}: {
  form_id: string
  status: FormsStatus
}): Promise<{ data: any; error: any }> {
  const supabase = await createClient()

  let data, error, updated_form

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log('UserError:' + userError)
    error = userError
  } else {
    // Update form in the forms table either an intake form or supplemental form
    // For an intake form, update the status to submission_approved
    const { data: formData, error: approvedFormError } = await supabase
      .schema('public')
      .from('forms')
      .update({ status: status, updated_at: DateTime.now().toISO() })
      .eq('id', form_id.toString())
      .select('id, type, status, users (id, full_name), created_at')
      .single()

    updated_form = formData

    if (approvedFormError) {
      console.log('approvedFormError:' + approvedFormError)
      error = approvedFormError
    }

    if (formData && formData.type == 'intake') {
      data = formData
    } else if (formData && formData.type == 'supplemental') {
      data = formData
    }
  }

  if (updated_form) {
    if (status == 'submission_approved') {
      if (updated_form.users) {
        const { data: unapprovedFormsData, error: formsError } = await supabase
          .from('forms')
          .select('id, type, status')
          .eq('user_id', updated_form.users.id)
          .neq('status', 'submission_approved')

        if (formsError) {
          error = error + ' ' + formsError
          console.log('formsError:' + formsError)
        }

        if (!unapprovedFormsData && !formsError) {
          console.log('All forms are approved')
          console.log('Updating scheduled_events table')
          // Update the scheduled_events table
          const { data: scheduledEventData, error: scheduledEventError } =
            await supabase.from('scheduled_events').insert({
              user_id: updated_form.users.id,
            })
        }
      }
    }
  }

  return { data, error }
}
