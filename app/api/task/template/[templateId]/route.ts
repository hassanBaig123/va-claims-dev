import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } },
) {
  const supabase = await createClient()

  console.log(params.templateId)

  //Get user from cookies
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log(userError)
    return new Response(userError.message, {
      status: 500,
    })
  }

  //Get the node template
  const { data, error } = await supabase
    .from('node_templates')
    .select('id, name, type, description, context_info, process_item_level')
    .eq('id', params.templateId)
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

  // Get node template from the request
  const { nodeTemplate } = await req.json()
  console.log(nodeTemplate)
  // Get user from cookies
  const user = await supabase.auth.getUser()
  // Get user id
  const user_id = user.data.user?.id

  let data, error: any
  if (nodeTemplate.id) {
    // Update node template in the node_templates table
    const { data, error } = await supabase
      .from('node_templates')
      .update({
        name: nodeTemplate.name,
        type: nodeTemplate.type,
        description: nodeTemplate.description,
        context_info: nodeTemplate.context_info,
        process_item_level: nodeTemplate.process_item_level,
        updated_at: new Date().toISOString(),
      })
      .eq('id', nodeTemplate.id)
      .select()
      .single()
  } else {
    // Insert node template into the node_templates table
    const { data, error } = await supabase
      .from('node_templates')
      .insert({
        name: nodeTemplate.name,
        type: nodeTemplate.type,
        description: nodeTemplate.description,
        context_info: nodeTemplate.context_info,
        process_item_level: nodeTemplate.process_item_level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
  }

  if (!data) {
    return new Response('Node template not found', {
      status: 404,
    })
  }

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
  { params }: { params: { templateId: string } },
) {
  const supabase = await createClient()

  const templateId = params.templateId

  // Get user from cookies
  const user = await supabase.auth.getUser()

  // Get user id
  const user_id = user.data.user?.id

  // Delete node template from the node_templates table
  const { data, error } = await supabase
    .from('node_templates')
    .delete()
    .eq('id', templateId)

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
