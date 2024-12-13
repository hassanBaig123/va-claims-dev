import { NextRequest } from "next/server";
import kafka, { ProduceRequest } from 'kafka-node';
type ScheduledEvent = Database['public']['Tables']['scheduled_events']

interface UpdatePayload {
  type: 'UPDATE'
  table: string
  schema: string
  record: ScheduledEvent
  old_record: ScheduledEvent
}

export async function POST(req: NextRequest) {
  const payload = await req.json() as UpdatePayload
  console.log('Received payload:', JSON.stringify(payload, null, 2))

  
    
    
    return new Response(
        JSON.stringify(payload.record),
        { headers: { "Content-Type": "application/json" } },
    )
}