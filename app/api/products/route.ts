import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { reportId: string } },
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('products').select(
    `
            id,
            name,
            active,
            description,
            metadata,
            prices:prices(product_id, unit_amount, currency, type, interval, trial_period_days, metadata)
          `,
  )

  console.log('Returning products:', data)

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    console.log(error)
    return new Response(errorMessage, {
      status: 500,
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
