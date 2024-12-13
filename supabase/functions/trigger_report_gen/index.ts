import { Kafka } from "https://deno.land/x/kafkasaur@v0.0.7/index.ts";
import { Database } from "./supabase.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

console.log("Hello from Functions!")

type ScheduledEvent = Database['public']['Tables']['scheduled_events']
interface UpdatePayload {
  type: 'UPDATE'
  table: string
  schema: string
  record: ScheduledEvent
  old_record: ScheduledEvent
}

Deno.serve(async (req) => {
  const payload = await req.json() as UpdatePayload
  console.log('Received payload:', JSON.stringify(payload, null, 2))

  
  const kafka = new Kafka({
    clientId: 'deno-producer',
    brokers: ['localhost:29092']
  })
  
  const topic = 'new_tasks';
  
  const producer = kafka.producer();
  
  const testmessage = {
    id: "testtesttest",
    name: "Generate Initial Intake Form",
    description: "Generate the ResearchReport for our client.",
    assignee: "UniverseAgent",
    set_function_call: "GenerateQuestionnaire",
    status: 'pending',
    context: {
        instructions: 'Generate an initial partial intake form.',
        objective: "Generate the initial intake form",
        request: 'Generate an initial intake partial questionnaire.',
        user_id: '1234',
    }
  }
  
  const messages: object[] = [];
  messages.push(testmessage)
  
  const sendMessage = () => {
    producer.send({
      topic,
      messages
    })
  }
  
  const run = async() => {
    await producer.connect();
    sendMessage();
  }

  run().catch(console.error);
  
  return new Response(
    JSON.stringify(payload.record),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/trigger_report_gen' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.JIMpB9kb4AXyUvTSRQxGT8Mc-Iukk2jUpSe7UVGQX8s' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
