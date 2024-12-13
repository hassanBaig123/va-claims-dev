import { createClient } from "@/utils/supabase/server";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const supabase = createClient();

    //Get user from cookies
    const { data: callerUser, error: callerUserError } = await supabase.auth.getUser();
    if(callerUserError) {
        console.log(callerUserError);
        return new Response(callerUserError.message, {
            status: 500,
        });
    }

    const { data, error } = await supabase
    .schema("public")
    .from("users")
    .select("id, full_name, avatar_url, billing_address, payment_method, email")
    .eq("id", params.userId)
    .single();

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
    const { user } = await req.json();

    // Get user from cookies
    const callerUser = await supabase.auth.getUser();

    let user_record: any = {};
    for(let key in user) {
        if(user[key]) {
            user_record[key] = user[key];
        }
    }

    // Update form in the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("users")
    .update({
        full_name: user["full_name"],
    avatar_url: user["avatar_url"],
    billing_address: user["billing_address"],
    payment_method: user["payment_method"],
    email: user["email"],
    }).eq("id", user["id"]);

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

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    const supabase = createClient();

    const userId = params.userId;
    // Get user from cookies
    const user = await supabase.auth.getUser();

    // Update form in the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("users")
    .delete()
    .eq("id", userId);

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