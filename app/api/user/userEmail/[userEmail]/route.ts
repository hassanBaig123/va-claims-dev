import { createClient } from '@/utils/supabase/server'
import { DateTime } from 'luxon'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { userEmail: string } },
) {
  const supabase = await createClient()

  // Decode the email parameter
  const decodedEmail = decodeURIComponent(params.userEmail)
  console.log('Fetching user details for email:', decodedEmail)

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', decodedEmail)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('User not found:', decodedEmail)
        return NextResponse.json({ user: null }, { status: 200 })
      } else {
        console.error('Error fetching user details:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    if (!data) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log('Fetched User details:', data)
    return NextResponse.json({ user: data }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userEmail: string } },
) {
  const supabase = await createClient()

  const userEmail = params.userEmail
  // Get user from cookies
  const user = await supabase.auth.getUser()

  // Update form in the forms table
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('email', userEmail)

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
