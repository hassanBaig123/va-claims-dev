import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest | Request,
  { params }: { params: { userId: string } },
) {
    const supabase = await createClient()
    console.log(params.userId + " forms being called")
    const { data, error } = await supabase
        .from('forms')
        .select('id, title, status, created_at')
        .eq('user_id', params.userId)
    
    console.log("Forms retreieved for user: " + params.userId)
    console.log(data)

    return new Response(JSON.stringify(data), { status: 200 })
}