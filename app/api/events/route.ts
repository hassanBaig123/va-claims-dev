import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request, res: Response) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('scheduled_events')
    .select('id, user_id, start_time')
    .order('start_time', { ascending: true })

  if (error) {
    console.log(error)
    return new Response(JSON.stringify(error), { status: 500 })
  }

  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req: Request, res: Response) {
  const authheader =
    req.headers.get('authorization') || req.headers.get('Authorization')
  const supabase = await createClient()
  let userData, authError

  if (!authheader) {
    const { data, error } = await supabase.auth.getUser()
    userData = data
    authError = error
  } else {
    const auth = Buffer.from(authheader.split(' ')[1], 'base64')
      .toString()
      .split(':')
    const user = auth[0]
    const pass = auth[1]

    if (user === 'zapier') {
      if (pass === 'vaClaimsasdpword1234!') {
        console.log('Authorized')

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: 'zapier@zapier.com',
            password: pass,
          })

        if (authError) {
          console.log(authError)
          return new Response(authError.message, { status: 500 })
        }
      } else {
        return new Response('Unauthorized', { status: 401 })
      }
    } else {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  if (authError) {
    console.log(authError)
    return new Response(authError.message, { status: 500 })
  }

  // Get form from the request
  const { email, name, start_time } = await req.json()

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (data) {
    const { data: scheduledEventData, error: scheduledEventError } =
      await supabase.from('scheduled_events').insert({
        created_at: new Date().toISOString(),
        user_id: data.id,
        start_time: start_time,
        updated_at: new Date().toISOString(),
      })

    if (scheduledEventError) {
      console.log(scheduledEventError)
      return new Response(scheduledEventError.message, { status: 500 })
    }

    return new Response('ok', { status: 200 })
  } else {
    return new Response('User not found', { status: 404 })
  }
}
