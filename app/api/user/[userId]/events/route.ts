import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest | Request,
  { params }: { params: { userId: string } },
) {
  try {
    const supabase = await createClient()

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error(`Auth error: ${userError.message}`)

    const { data, error } = await supabase
      .schema('public')
      .from('scheduled_events')
      .select('id, user_id, start_time, users (id, full_name, email)')
      .eq('user_id', params.userId)
      .order('start_time', { ascending: true })

    if (error) throw new Error(`Database error: ${error.message}`)

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in GET /api/user/[userId]/events:', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
