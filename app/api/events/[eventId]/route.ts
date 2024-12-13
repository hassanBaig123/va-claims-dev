import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import kafka, { ProduceRequest } from "kafka-node";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { eventId: string } }) {
    const supabase = createClient();

    console.log(`PUT /api/events/${params.eventId}`, req.body);
    console.log("Params", params);

    await supabase.auth.getUser();

    const { data, error } = await supabase.schema('public').from('scheduled_events').update({status: "submission_approved", updated_at: DateTime.now().toUTC().toISO()}).eq('id', params.eventId).select('*').single();

    if(!data) return;

    const client = new kafka.KafkaClient({ kafkaHost: 'localhost:29092' });
  
    const Producer = kafka.Producer;
    
    const producer = new Producer(client);

    const topic = 'new_tasks';
    
    const testmessage: ProduceRequest[] = [{
        messages: [JSON.stringify({
        description: `Create a specific set of steps through a process of planning and breaking down tasks into the smallest possible units to create a consistent workflow that will generate quality research for our customer.`,
        context: {
            user_context:  {
                user_id: data.user_id,
                user_meta: data.user_meta
            },
            object_context: {
                object_id: data.object_id,
                "type": "forms",
                object_meta: data.object_meta
            },
            input_description: 'We will use the user_context to research customer conditions in order to use the GetIntake and GetSupplemental tools to generate a research report.',
            action_summary: 'With the customer id from the user_context, we will research the customer conditions by creating workflows and breaking down tasks into the smallest possible units to create a consistent workflow that will generate quality research for our customer.',
            outcome_description: 'A set of nodes created that will be used to generate a research report for the customer for their VA claims for benefits for their conditions.',
            output: {research_report: { user_id: "", report: {}}}
        }
        })],
    topic: topic
    }];
        producer.on('ready', function () {

            producer.send(testmessage, function (err, data) {
            
            console.log(data);
            
            });
            
        });
        
        producer.on('error', function (err) {})

    if(error) {
        console.log(error);
        return new Response(error.message, {
            status: 500,
        });
    }
    
    return new Response(JSON.stringify(data), {
        status: 200,
    });
}