import { createClient } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { generateSignedUrl } from '@/utils/auth'
import { custom } from 'zod'




interface User {
  id: string
  full_name: string
  email: string
}

export const handleEmailClick = async (
  users: User,
  type: string,
  form_id: string,
  message: string,
  setLoading: (loading: boolean) => void,
): Promise<void> => {
  let signedFormUrl: string
  let templateName: string
  let emailSubject: string

  switch (type) {
    case 'intake_not_completed':
      signedFormUrl = generateSignedUrl(`/todos`)
      templateName = 'intakeReminder'
      emailSubject = 'VA Claims Academy Intake Form Reminder'
      break
    case 'supplemental_not_completed':
      signedFormUrl = generateSignedUrl(`/todos`)
      templateName = 'supplementalReminder'
      emailSubject = 'VA Claims Academy Supplemental Form Reminder'
      break
    case 'discovery_not_scheduled':
      signedFormUrl = generateSignedUrl(`/todos`)
      templateName = 'discoveryCallReminder'
      emailSubject = 'VA Claims Academy Discovery Call Reminder'
      break
    case 'intake_form_approved':
      signedFormUrl = generateSignedUrl(`/todos`)
      templateName = 'intakeApproved'
      emailSubject = 'Good News! Your Intake Form Has Been Approved'
      break
    case 'intake_form_reset':
      signedFormUrl = generateSignedUrl(`/todos`)
      templateName = 'intakeReset'
      emailSubject = 'Please resubmit your intake form'
      break
    default:
      throw new Error('Invalid type')
  }

  try {
    setLoading(true)
    if (type == 'intake_form_reset') {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('forms')
        .update({ status: 'created' })
        .eq('id', form_id)
      if (updateError) {
        throw new Error('Error updating form status')
      }
    }
    const contactUserResponse = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: users.email,
        templateName: templateName,
        templateData: {
          name: users.full_name,
          formLink: signedFormUrl,
          subject: emailSubject,
          message: message
        },
      }),
    })

    if (contactUserResponse.ok) {
      toast({
        title: 'Success',
        description: `${type == 'intake_form_reset' ? "Form has been reset and Your message has been sent successfully!" : "Your message has been sent successfully!"} `,
      })
    }
  } catch (error) {
    console.error('Error:', error)
    toast({
      title: 'Error',
      description:
        'There was a problem sending your message. Please try again later.',
      variant: 'destructive',
    })
  } finally {
    setLoading(false)
  }
}

export const handleUpdateNotes = async (users: User, type: string, form_id: string, notes: string, setLoading: (loading: boolean) => void) => {
  try {
    setLoading(true)
    const updateNotesResponse = await fetch(`/api/events/${form_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: form_id,
        notes: notes,
      }),
    })

    if (updateNotesResponse.ok) {
      toast({
        title: 'Success',
        description: 'Your notes have been updated successfully!',
      })
    }
  } catch (error) {
    console.error('Error:', error)
    toast({
      title: 'Error',
      description:
        'There was a problem updating your notes. Please try again later.',
      variant: 'destructive',
    })
  } finally {
    setLoading(false)
  }
}

export const handleViewClick = ({ customer_id }: { customer_id: string }) => {
  viewCustomer(customer_id)
}

export const viewCustomer = (customer_id: string) => {
  console.log(`Viewing customer ${customer_id}`)
}

export const approveForm = async (form_id: string, isSupplementApprove = false, userId = "") => {
  console.log(`Approving form ${form_id}`)
  const status: FormsStatus = 'submission_approved'
  const result = await fetch(`/api/form/${form_id}/status`, {
    method: 'PUT',
    body: JSON.stringify({
      form_id: form_id,
      status: status,
      submit_type: 'APPROVE_INTAKE_FORM',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (result && isSupplementApprove && userId) {
    await checkReportAndRunTaskApi(form_id, userId)
  }
}

export const checkReportAndRunTaskApi = async (form_id: string, userId: string) => {
  const reportResponse = await fetch(`/api/report?userId=${userId}`).then((res) => res.json()).catch((err) => console.error(err))
  const report = JSON.parse(reportResponse?.decrypted_report)

  if (report) {
    const form: any = await fetch(`/api/form/${form_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json()).catch((err) => console.error(err))

    const parsedForm = JSON.parse(form.decrypted_form)

    const reportTypeTemplates: any = {
      nexus_letter: "WriteNexusLetter",
      personal_statement: "PersonalStatement"
    }

    const task = {
      node_template_name: reportTypeTemplates[form?.report_type],
      task: {
        description: "Process this form by creating a report for the customer based on the conditions selected.",
        output: JSON.stringify({
          report: {
            conditions: [parsedForm?.condition],
            customer_report: {
              condition_sections: {
                condition_name: "",
                condition_details: {},
                sections: [{
                  section_id: 'section_id',
                  section_details: {}
                }]
              }
            }
          }
        })
      },
      contexts: [
        {
          type: 'users',
          object_id: userId || ''
        },
        {
          type: 'forms',
          object_id: form_id
        }
      ]
    }
    const response = await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to process form in task');
    }
  }
}

export const updateNotes = (event_id: string, notes: string) => {
  console.log(`Updating notes for event ${event_id}`)
  const result = fetch(`/api/events/${event_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      eventId: event_id,
      notes: notes,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const approveReport = (report_id: string) => {
  console.log(`Approving report ${report_id}`)
  const status: FormsStatus = 'submission_approved'
  const result = fetch('/api/updateReportStatus', {
    method: 'PUT',
    body: JSON.stringify({
      report_id: report_id,
      status: status,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const approveNotes = (event_id: string) => {
  console.log(`Approving form ${event_id}`)
  const status: FormsStatus = 'submission_approved'
  const result = fetch(`/api/events/${event_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      eventId: event_id,
      status: status,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const sendReminder = (userId: string) => {
  console.log(`Sending reminder for user ${userId}`)
  const result = fetch('/api/sendReminder', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}



