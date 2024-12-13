import { createClient } from "@/utils/supabase/server";

export async function getFormById(obj_id: string) {
    const supabase = createClient();

    //Get user from cookies
    const { data: user, error: userError } = await supabase.auth.getUser();

    if(userError) {
        console.log("userError:", userError);
        throw new Error(userError.message);
    }

    console.log(user);
    //Get user id
    const user_id = user?.user?.id;

    //Get all forms for the user
    const { data, error } = await supabase
    .schema("public")
    .from("decrypted_forms")
    .select("id, title, status, type, decrypted_form, users (id, full_name), created_at, updated_at")
    .eq("id", obj_id)
    .single();

    if(error) {
        throw new Error(error.message);
    }

    return data;
}