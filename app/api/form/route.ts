import { createClient } from "@/utils/supabase/server";
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: NextResponse) {
    const supabase = createClient();

    //Get form from the request
    const { form } = await req.json();
    console.log(form);
    //Get user from cookies
    const user = await supabase.auth.getUser();
    //Get user id
    const user_id = user.data.user?.id;
    const user_email = user.data.user?.email;

    if(form.type == "intake") {
        const { data: existingForm, error: queryError } = await supabase
            .schema("public")
            .from("decrypted_forms")
            .select()
            .eq("user_id", user_id)
            .eq("type", "intake")
            .limit(1)
            .single();

        if (existingForm) {
            console.log("existingForm", existingForm);
            existingForm.form = JSON.parse(existingForm.decrypted_form);
            // Existing intake form found, return it
            return NextResponse.json(existingForm, { status: 200 });
        }
    }

    //Upload form into the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("forms")
    .insert({
        user_email: user_email,
        type: form.type,
        user_id: user_id,
        title: form.title,
        status: form.status,
        form: JSON.stringify(form)
    }).select()
    .limit(1)
    .single();
    
    if(error) {
        console.log("POST error", error);
        return new Response(error.message, {
            status: 500,
        });
    }

    if(data) {
        data.form = form;
        return new Response(JSON.stringify(data), {
            status: 200,
        });
    } else {
        return new Response("Not Found", {
            status: 404,
        });
    }
}