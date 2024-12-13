import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const supabase = await createClient()

  await supabase.auth.getUser()

  const { data, error } = await supabase
    .schema('public')
    .from('scheduled_events')
    .select(
      'id, decrypted_notes (id, decrypted_note, created_at), users (id, full_name, email)',
    )
    .eq('id', params.eventId)

  if (error) {
    console.log(error)
    return new Response(error.message, {
      status: 500,
    })
  }

  console.log("Notes data:::", data)

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const supabase = await createClient()

  try {
    // Read the stream
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    console.log('POST /api/events/:eventId/notes', body);
    console.log('Params', params);

    const { data: user } = await supabase.auth.getUser()

    const { note } = body;

    if (!note || typeof note !== 'string') {
      return new Response('Note text is required and must be a string', {
        status: 400,
      })
    }

    const user_id = user.user?.id

    if (!user_id) {
      return new Response('User is not authenticated', {
        status: 401,
      })
    }

    const { data, error } = await supabase
      .schema('public')
      .from('notes')
      .insert({ note: note, user_id: user_id, event_id: params.eventId })

    if (error) {
      console.log(error)
      return new Response(error.message, {
        status: 500,
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    })
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
