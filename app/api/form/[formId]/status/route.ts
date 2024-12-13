import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import kafka, { ProduceRequest } from "kafka-node";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

export async function PUT(req: Request, res: Response) {
    const supabase = createClient();

    // Get form from the request
    const { form_id, status } = await req.json();

    console.log(`PUT /api/form/${form_id}/status`, req.body);
    console.log("Form ID", form_id);    

    await supabase.auth.getUser();

    const { data, error } = await supabase.schema('public').from('forms').update({status: status, updated_at: DateTime.now().toUTC().toISO()}).eq('id', form_id).select('*').single();

    if(!data) return;

    const {data: decrypted_form_data, error: decrypted_form_error } = await supabase.schema('public').from('decrypted_forms').select('id, title, status, type, decrypted_form').eq('id', form_id).single();

    if(!decrypted_form_data) return;

    console.log("Decrypted_forms Response ", decrypted_form_data);

    if(decrypted_form_error) {
        console.log("Decrypted Form Error: ", decrypted_form_error);
    }
    

    if(data.status == "submission_approved") {
        const client = new kafka.KafkaClient({ kafkaHost: 'localhost:29092' });
        const Producer = kafka.Producer;
        const producer = new Producer(client);
        const topic = 'new_tasks';
        console.log(data);
        console.log("Form approved, sending to Kafka");
        let description = "";
        let outcome_description = "";
        let output = {};
        switch(data.type) {
            case "intake":
                description = `Extract the metadata from the form and save the metadata for the user. Finally, generate supplemental forms for each condition for this user.`;
                outcome_description = `The metadata will be saved for the user and supplemental forms will be generated for each condition for this user.`;
                output = {condition: "{condition}", details: "{details}"};
                break;
            case "supplemental":
                description = `Review the supplemental intake form within the object_context and save the metadata for the user.`;
                outcome_description = `The metadata will be saved for the user.`;
                output = {condition: "{condition}", supplemental_review_form: [{question: "{question}", answer: "{answer}"}]};
                break;
        }

        const testmessage: ProduceRequest[] = [{
            messages: [JSON.stringify({
            description: description,
            context: {
                user_context:  {
                    user_id: data.user_id
                },
                object_context: {
                    object_id: data.id,
                    "type": "forms",
                    object_meta: decrypted_form_data
                },
                input_description: 'We will utilize the user_context.user_id.',
                action_summary: description,
                outcome_description: outcome_description,
                output: output
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
    }

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