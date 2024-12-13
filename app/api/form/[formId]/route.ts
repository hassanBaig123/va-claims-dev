import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import kafka, { ProduceRequest } from "kafka-node";

export async function GET(req: NextRequest, { params }: { params: { formId: string } }) {
    const supabase = createClient();

    console.log(params.formId);

    //Get user from cookies
    const { data: user, error: userError } = await supabase.auth.getUser();
    if(userError) {
        console.log(userError);
        return new Response(userError.message, {
            status: 500,
        });
    }

    //Get all forms for the user
    const { data, error } = await supabase
    .schema("public")
    .from("decrypted_forms")
    .select("id, title, decrypted_form, created_at, updated_at, user_id, status, type, users (id, full_name)")
    .eq("id", params.formId)
    .single();

    console.log("Returning data:", data);

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

export async function PUT(req: Request) {
    const supabase = createClient();

    // Get form from the request
    const { form } = await req.json();
    console.log(form);
    // Get user from cookies
    const user = await supabase.auth.getUser();
    // Get user id
    const user_id = user.data.user?.id;

    // Update form in the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("forms")
    .update({
        user_id: user_id,
        title: form["title"],
        form: form,
        status: form["status"],
        updated_at: new Date().toISOString(),
    }).eq("id", form.id).order("id", {ascending: true}).select().limit(1).single(); // Ensure the update is only applied to the form with the specified ID

    if(!data) {
        return new Response("Form not found", {
            status: 404,
        });
    }

    const client = new kafka.KafkaClient({ kafkaHost: 'localhost:29092' });
    const Producer = kafka.Producer;
    const producer = new Producer(client);
    const topic = 'new_tasks';
    console.log(data);
    
    if(data.status == "submission_approved") {
        console.log("Form approved, sending to Kafka");
        let description = "";
        let outcome_description = "";
        let output = {};
        switch(data.type) {
            case "intake":
                description = `Extract the metadata from the form and save the metadata for the user. Finally, generate supplemental forms for each condition for this user.`;
                outcome_description = `The metadata will be saved for the user and supplemental forms will be generated for each condition for this user.`;
                output = {conditions: [{condition: "{condition}", details: "{details}"}]};
                break;
            case "supplemental":
                description = `Process the supplemental intake form within the object_context and save the metadata for the user.`;
                outcome_description = `The metadata will be saved for the user.`;
                output = {condition: "{condition}", details: "{details}"};
                break;
        }
        data['form'] = form;
        const testmessage: ProduceRequest[] = [{
            messages: [JSON.stringify({
            description: description,
            context: {
                user_context:  {
                    user_id: data.user_id
                },
                object_context: {
                    "type": "forms",
                    object: data
                },
                input_description: 'We will utilize the user_context.user_id.',
                action_summary: description,
                outcome_description: outcome_description,
                output: {condition: "{condition}", details: "{details}"}
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

    if (error) {
        console.log(error);
        return new Response(error.message, {
            status: 500,
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
    });
}

export async function DELETE(req: Request, { params }: { params: { formId: string } }) {
    const supabase = createClient();

    const formId = params.formId;

    // Get user from cookies
    const user = await supabase.auth.getUser();

    // Get user id
    const user_id = user.data.user?.id;

    // Delete form from the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("forms")
    .delete()
    .eq("id", formId)

    if (error) {
        console.log(error);
        return new Response(error.message, {
            status: 500,
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
    });
}
