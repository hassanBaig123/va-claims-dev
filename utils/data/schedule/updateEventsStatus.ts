import { createClient } from "@/utils/supabase/server";

export async function changeEventsStatus({ event_id, status }: { event_id: string, status: FormsStatus }): Promise<{ data: any, error: any }> {
    const supabase = createClient();

    let data, error;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if(userError) {
        console.log(userError);
        error = userError;
    }
    else 
    {
        //Get user id
        const user_id = userData?.user?.id;

        // Update form in the forms table either an intake form or supplemental form
        // For an intake form, update the status to submission_approved
        const { data:eventData, error: approvedEventError } = await supabase
        .schema("public")
        .from("scheduled_events")
        .update({ status: status })
        .eq("id", event_id.toString())
        .select("id, type, status, users (id, full_name), created_at, updated_at")
        .single();

        data = eventData;

        if(approvedEventError) {
            error = approvedEventError;
        }
    }

    return { data, error };
}