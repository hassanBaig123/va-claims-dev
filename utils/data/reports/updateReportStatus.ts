import { createClient } from "@/utils/supabase/server";

export async function changeReportsStatus({ report_id, status }: { report_id: string, status: FormsStatus }): Promise<{ data: any, error: any }> {
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
        const { data:reportData, error: approvedFormError } = await supabase
        .schema("public")
        .from("reports")
        .update({ status: status })
        .eq("id", report_id.toString())
        .select("id, type, status, users (id, full_name), created_at")
        .single();

        data = reportData;

        if(approvedFormError) {
            error = approvedFormError;
        }
    }

    return { data, error };
}