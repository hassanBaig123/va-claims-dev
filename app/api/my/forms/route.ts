import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const supabase = createClient();

    //Get user from cookies
    const { data: user, error: userError } = await supabase.auth.getUser();
    if(userError) {
        console.log(userError);
        return new Response(userError.message, {
            status: 500,
        });
    }

    console.log(user);
    //Get user id
    const user_id = user?.user?.id;

    //Get all forms for the user
    const { data, error } = await supabase
    .schema("public")
    .from("decrypted_forms")
    .select("id, title, decrypted_form")
    .eq("user_id", user_id);

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