import { createClient } from '@/utils/supabase/server'
import { DateTime } from 'luxon'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { reportId: string } },
) {
  const supabase = await createClient()

  //Get user from cookies
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log(userError)
    return new Response(userError.message, {
      status: 500,
    })
  }

  const { data, error } = await supabase
    .schema('public')
    .from('decrypted_reports')
    .select(
      'id, title, decrypted_report, created_at, updated_at, user_id, status, type, users (id, full_name)',
    )
    .eq('id', params.reportId)
    .single()

  console.log('Returning data:', data)

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
  const supabase = await createClient()

  // Get form from the request
  const { report } = await req.json()

  // Get user from cookies
  const user = await supabase.auth.getUser()

  // Update form in the forms table
  const { data, error } = await supabase
    .schema('public')
    .from('reports')
    .update({
      title: report['title'],
      report: JSON.stringify(report),
      updated_at: DateTime.now().toSQL(),
    })
    .eq('id', report['id'])

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

export async function DELETE(
  req: Request,
  { params }: { params: { reportId: string } },
) {
  const supabase = await createClient()

  const reportId = params.reportId
  // Get user from cookies
  const user = await supabase.auth.getUser()

  // Update form in the forms table
  const { data, error } = await supabase
    .schema('public')
    .from('reports')
    .delete()
    .eq('id', reportId)

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
