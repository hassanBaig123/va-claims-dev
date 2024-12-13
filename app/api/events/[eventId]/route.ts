import { createClient } from '@/utils/supabase/server'
import { randomUUID } from 'crypto'
import kafka, { ProduceRequest } from 'kafka-node'
import { DateTime } from 'luxon'
import { NextRequest } from 'next/server'


export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('scheduled_events')
    .select(`
      *,
      users (
        id,
        full_name,
        email
      )
    `)
    .eq('id', params.eventId)
    .single()

  if (error) {
    console.log(error)
    return new Response(JSON.stringify(error), { status: 500 })
  }

  return new Response(JSON.stringify(data), { status: 200 })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const supabase = await createClient()

  console.log(`PUT /api/events/${params.eventId}`, req.body)
  console.log('Params', params)

  await supabase.auth.getUser()

  const { data, error } = await supabase
    .schema('public')
    .from('scheduled_events')
    .update({
      status: 'submission_approved',
      updated_at: DateTime.now().toUTC().toISO(),
    })
    .eq('id', params.eventId)
    .select('*')
    .single()

  if (!data) return

  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BROKER_URL,
  })

  const Producer = kafka.Producer

  const producer = new Producer(client)

  const topic = 'new_tasks'

  const testmessage: ProduceRequest[] = [
    {
      messages: [
        JSON.stringify({
          description: `Create a customer report for this customer's conditions.`,
          context: {
            user_context: {
              user_id: data.user_id,
            },
            object_context: {
              object_id: data.id,
              type: 'scheduled_events',
              object_meta: data,
            },
            input_description:
              'We will use the user_context to research customer conditions.',
            action_summary:
              'With the customer id from the user_context, we will research the customer conditions by gather the conditions, then we will review supplemental intakes and discovery call notes and research each condition.',
            outcome_description:
              'A research report based on the customer conditions and needs.',
            output: { research_report: { user_id: '', report: {} } },
          },
        }),
      ],
      topic: topic,
    },
  ]
  producer.on('ready', function () {
    producer.send(testmessage, function (err, data) {
      console.log(data)
    })
  })

  producer.on('error', function (err) {})

  if (error) {
    console.log(error)
    return new Response((error as any).message, {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
