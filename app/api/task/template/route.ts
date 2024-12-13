import { createClient } from '@/utils/supabase/server'
import { DateTime } from 'luxon'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const supabase = await createClient()

  // Get form from the request
  const { task } = await req.json()

  console.log(`POST /api/task/template`, req.body)

  await supabase.auth.getUser()

  const { data, error } = await supabase
    .schema('public')
    .from('task_templates' as any)
    .insert({
      name: task.name,
      task: JSON.stringify(task.task),
      updated_at: DateTime.now().toUTC().toISO(),
    })
    .select('*')
    .single()

  if (!data) return

  if (error) {
    console.log(error)
    const errorMessage =
      (error as { message?: string }).message || 'An unexpected error occurred'
    return new Response(errorMessage, {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
