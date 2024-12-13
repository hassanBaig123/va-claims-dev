import { getUniqueConditions } from './../../status-additional/route';
import { questionnaireDataset_Supplementary } from '@/constants'
import { createClient } from '@/utils/supabase/server'
import kafka, { ProduceRequest } from 'kafka-node'
import { DateTime } from 'luxon'

type FormData = {
  id: string
  status: string
  type: string
  user_id: string
}

export async function PUT(req: Request, res: Response) {
  const supabase = await createClient()

  // Get form from the request
  const { form_id, status, submit_type = '' } = await req.json()

  console.log(`PUT /api/form/${form_id}/status`, req.body)
  console.log('Form ID', form_id)

  await supabase.auth.getUser()

  // Check if the form exists
  const { data: existingForm, error: existingFormError } = await supabase
    .schema('public')
    .from('forms')
    .select('id')
    .eq('id', form_id)
    .single()

  if (existingFormError || !existingForm) {
    console.log('Form not found: ', existingFormError)
    return new Response('Form not found', { status: 404 })
  }

  // Proceed with the update
  const { data, error } = await supabase
    .schema('public')
    .from('forms')
    .update({ status: status, updated_at: DateTime.now().toUTC().toISO() })
    .eq('id', form_id)
    .select('id, status, type, user_id')
    .order('id', { ascending: true })
    .limit(1)
    .single()

  if (
    data?.status === 'submission_approved' &&
    submit_type === 'APPROVE_INTAKE_FORM'
  ) {
    // Fetch the approved intake form data
    const { data: intakeFormData, error: intakeFormError } = await supabase
      .schema('public')
      .from('decrypted_forms')
      .select('decrypted_form')
      .eq('id', form_id)
      .single()

    if (intakeFormError) {
      console.log('Error fetching intake form data:', intakeFormError)
      return new Response('Error fetching intake form data', { status: 500 })
    }

    if (intakeFormData && intakeFormData.decrypted_form) {
      const parsedIntakeForm = JSON.parse(intakeFormData.decrypted_form)

      // Find the diagnosed-conditions question and extract its answer
      const diagnosedConditionsQuestion = parsedIntakeForm.questions.find(
        (q: any) => q.question.id === 'diagnosed-conditions',
      )
      const conditions = diagnosedConditionsQuestion
        ? diagnosedConditionsQuestion.answer
        : []

      const uniqueConditions =
        await getUniqueConditions(conditions, data?.user_id, false)

      // Create a supplementary form for each condition
      for (const condition of uniqueConditions) {
        console.log('Processing condition:', condition)
        console.log('Condition category:', condition.category)
        const supplementaryFormPages =
          questionnaireDataset_Supplementary.pages.filter((page) => {
            if (!page.categories) return true
            return page.categories.includes(condition.category)
          })
        console.log('Supplementary form pages:', supplementaryFormPages)
        console.log('Condition category:', condition.category)

        const supplementaryForm = {
          questions: supplementaryFormPages.flatMap(
            (page: Page) =>
              page.questions.flatMap((question: Question) => question) || [],
          ),
          condition: condition,
          answers: {},
        }
        console.log('Creating supplementary form:', supplementaryForm)

        // Insert the new supplementary form
        const { data: newSupplementaryForm, error: supplementaryFormError } =
          await supabase
            .schema('public')
            .from('forms')
            .insert({
              type: 'supplemental',
              user_id: data.user_id,
              title: `Condition Detail Builder for ${condition.label}`,
              status: 'created',
              form: JSON.stringify(supplementaryForm),
            } as any)
            .select()
            .single()

        if (supplementaryFormError) {
          console.log(
            'Error creating supplementary form:',
            supplementaryFormError,
          )
          // Continue with the next condition even if there's an error
        } else {
          console.log('Created supplementary form:', newSupplementaryForm)
        }
      }
    }
  }
  if (error) {
    console.log('Error updating form status: ', error)
    return new Response('Error updating form status: ' + error.message, {
      status: 500,
    })
  }

  if (!data) {
    return new Response('No data returned after update', { status: 500 })
  }

  const { data: decrypted_form_data, error: decrypted_form_error } =
    await supabase
      .schema('public')
      .from('decrypted_forms')
      .select('id, title, status, type, decrypted_form')
      .eq('id', form_id)
      .single()

  if (!decrypted_form_data) return

  // console.log('Decrypted_forms Response ', decrypted_form_data)

  if (decrypted_form_error) {
    // console.log('Decrypted Form Error: ', decrypted_form_error)
  }

  // console.log('Decrypted Form Data: ', decrypted_form_data)

  if (data.status == 'submission_approved') {
    const client = new kafka.KafkaClient({
      kafkaHost: process.env.KAFKA_BROKER_URL,
    })
    const Producer = kafka.Producer
    const producer = new Producer(client)
    const topic = 'new_tasks'
    // console.log(data)
    console.log('Form approved, sending to Kafka')
    let description = ''
    let outcome_description = ''
    let output = {}
    switch (data.type) {
      case 'intake':
        description = `Extract the metadata from the form and save the metadata for the user. Finally, generate supplemental forms for each condition for this user.`
        outcome_description = `The metadata will be saved for the user and supplemental forms will be generated for each condition for this user.`
        output = { condition: '{condition}', details: '{details}' }
        break
      case 'supplemental':
        description = `Review supplemental. Save the output. Research the conditon by browsing the web and save the research into our condition section report.`
        outcome_description = `You will write the research to the condition section report for the user for that condition.`
        output = {
          condition: '{condition}',
          supplemental_review_form: [
            { question: '{question}', answer: '{answer}' },
          ],
        }
        break
    }

    const testmessage: ProduceRequest[] = [
      {
        messages: [
          JSON.stringify({
            description: description,
            context: {
              user_context: {
                user_id: data.user_id,
              },
              object_context: {
                object_id: data.id,
                type: 'forms',
                object_meta: decrypted_form_data,
              },
              input_description: 'We will utilize the user_context.user_id.',
              action_summary: description,
              outcome_description: outcome_description,
              output: output,
            },
          }),
        ],
        topic: topic,
      },
    ]
    producer.on('ready', function () {
      producer.send(testmessage, function (err, data) {
        // console.log(data)
      })
    })

    producer.on('error', function (err) { })
  }

  if (error) {
    console.log(error)

    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Error updating form status:'

    return new Response(errorMessage, {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
