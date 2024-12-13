import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  const { email, current_url } = await req.json()

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('remote-addr') ||
    'Unknown IP'

  const { data, error } = await supabase.from('user_submissions').insert({
    email: email || '',
    ip_address: ip,
    current_url,
  })

  if (error) {
    console.error('POST error:', error)
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Record inserted successfully',
    data
  }), { status: 200 })
}
