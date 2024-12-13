import { createClient } from "@/utils/supabase/server";

export const getReportsBacklog = async () => {
    const supabase = createClient();
    //Get user from cookies
    const user = await supabase.auth.getUser();
    //Get user id
    const user_id = user.data.user?.id;
    
    //Upload form into the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("reports")
    .select("id, status, users (id, full_name), created_at, updated_at")
    .neq("status", "submission_approved");

    if(error) {
        console.log("POST error", error);
        return new Response(error.message, {
            status: 500,
        });
    }

    if(data) {
        return data;
    }
}

