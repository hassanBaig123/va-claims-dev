import { changeReportsStatus } from '@/utils/data/reports/updateReportStatus'
import { createClient } from '@/utils/supabase/server'

export async function PUT(req: Request, res: Response) {
  const supabase = await createClient()

  // Get report from the request
  const { report_id, status } = await req.json()
  console.log('report_id:', report_id)
  console.log('status:', status)
  // Get user from cookies
  const user = await supabase.auth.getUser()

  const { data, error } = await changeReportsStatus({ report_id, status })

  if (error) {
    console.log('Route Error:' + error)
    return new Response(JSON.stringify(data), {
      status: error.status || 500,
    })
  }
  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
