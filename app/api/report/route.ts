import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  //Get form from the request
  const { report } = await req.json()
  console.log(report)
  //Get user from cookies
  const user = await supabase.auth.getUser()
  //Get user id
  const user_id = user.data.user?.id

  //Upload form into the forms table
  const { data, error } = await supabase
    .schema('public')
    .from('reports')
    .insert({
      user_id: user_id || '',
      report: JSON.stringify(report),
    })

  if (error) {
    console.log('POST error', error)
    return new Response(error.message, {
      status: 500,
    })
  }

  if (data) {
    return new Response(JSON.stringify(data), {
      status: 200,
    })
  } else {
    return new Response('Not Found', {
      status: 404,
    })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient()

    // Get userId from query parameter
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    let user_id: string | undefined

    if (userId) {
      // If userId is provided in the query, use it
      user_id = userId
    } else {
      // If no userId is provided, get the current user's id
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error)
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      user_id = user?.id
    }

    if (!user_id) {
      return Response.json({ error: 'User ID not found' }, { status: 400 })
    }

    // Fetch decrypted report from the decrypted_reports table
    const { data, error } = await supabase
      .from('decrypted_reports')
      .select('decrypted_report')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('GET error', error)
      return Response.json({ error: error.message }, { status: 500 })
    }
    console.log('ReportGET data', data)
    if (data) {
      return Response.json(data)
    } else {
      return Response.json({ error: 'Not Found' }, { status: 404 })
    }
  } catch (error) {
    console.error('GET Catch error', error)
    return Response.json({ error }, { status: 500 })
  }
}
