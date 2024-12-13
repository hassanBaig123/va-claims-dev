import { createClient } from '@/utils/supabase/server'
import { DateTime } from 'luxon'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  console.log(req)
  //Get form from the request
  const formData = await req.json()

  const forms = formData.getAll('forms')
  const user_id = formData.get('user_id')

  //Get user from cookies
  const user = await supabase.auth.getUser()

  //Upload form into the forms table
  const { data, error } = await supabase
    .schema('public')
    .from('forms')
    .insert([
      forms.map((form: any) => {
        return {
          title: form.title,
          form: form.form,
          user_id: user_id,
        }
      }),
    ])

  if (error) {
    console.log('POST error', error)
    return new Response(error.message, {
      status: 500,
    })
  }

  return new Response(data, {
    status: 200,
  })
}

export async function GET(req: Request) {
  const supabase = await createClient()

  //Get user from cookies
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log(userError)
    return new Response(userError.message, {
      status: 500,
    })
  }

  console.log(user)

  const user_id = user?.user?.id

  //Get all forms for the user
  const { data, error } = await supabase
    .schema('public')
    .from('forms')
    .select('id, title, created_at, updated_at, users (id, full_name), status')

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

  const { form } = await req.json()

  const user = await supabase.auth.getUser()
  const user_id = user.data.user?.id

  const { data, error } = await supabase.schema('public').from('forms').update({
    user_id: user_id,
    title: form.title,
    form: form.form,
    status: form.status,
    updated_at: DateTime.now().toSQL(),
  })

  if (error) {
    console.log(error)
    return new Response(error.message, {
      status: 500,
    })
  }

  return new Response(data, {
    status: 200,
  })
}
