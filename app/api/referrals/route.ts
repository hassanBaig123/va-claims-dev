import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const createRouteClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const supabase = createRouteClient()

  const { data, error } = await supabase
    .schema('public')
    .from('user_meta')
    .select('meta_value')
    .eq('user_id', params.userId)
    .eq('meta_key', 'referralCode')
    .single()

  if (error) {
    console.log(error)
    return new Response(error.message, {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}

export async function PUT(req: Request) {
  const supabase = createRouteClient()

  const { userId, action } = await req.json()

  let updateResult
  if (action === 'trackClick') {
    updateResult = await supabase
      .from('user_meta')
      .update({ meta_value: 'clicked' })
      .eq('user_id', userId)
      .eq('meta_key', 'referralResourceClick')
  }

  if (updateResult?.error) {
    console.log(updateResult.error)
    return new Response(updateResult.error.message, { status: 500 })
  }

  return new Response(JSON.stringify(updateResult?.data || {}), { status: 200 })
}

export async function POST(req: Request) {
  const supabase = createRouteClient()
  
  const { userId } = await req.json()

  const { data, error } = await supabase
    .from('user_meta')
    .select('meta_value')
    .eq('user_id', userId)
    .eq('meta_key', 'referralResourceClick')
    .limit(1)
    .single()

  if (error) {
    console.log(error)
    return new Response(error.message, { status: 500 })
  }

  return new Response(JSON.stringify({ clicked: data?.meta_value === 'clicked' }), {
    status: 200,
  })
}