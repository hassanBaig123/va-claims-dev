import { createClient } from "@/utils/supabase/server";

export async function getFormsBacklog() {
    const supabase = createClient();

    //Get user from cookies
    const { data: user, error: userError } = await supabase.auth.getUser();

    if(userError) {
        console.log("userError:", userError);
        return userError.message;
    }

    console.log(user);
    //Get user id
    const user_id = user?.user?.id;

    //Get all forms for the user
    const { data, error } = await supabase
    .schema("public")
    .from("forms")
    .select("id, title, status, type, users (id, full_name), created_at, updated_at")
    .neq("status", "submission_approved");
    
    //if (data) {
    //    const uniqueUsers: any[] = [];
    //    const usersMap = new Map();
    //
    //    data.forEach(form => {
    //        if (!usersMap.has(form.users.id)) {
    //            usersMap.set(form.users.id, {
    //                user: form.users,
    //                forms: [form]
    //            });
    //        } else {
    //            usersMap.get(form.users.id).forms.push(form);
    //        }
    //    });
    //
    //    usersMap.forEach(value => uniqueUsers.push(value));
    //    console.log("Unique Users: ", uniqueUsers);
    //}

    if(error) {
        console.log(error);
        throw new Error(error.message);
    }

    return data;
}
