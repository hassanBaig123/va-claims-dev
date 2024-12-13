import { changeFormStatus } from "@/utils/data/forms/updateFormStatus";
import { createClient } from "@/utils/supabase/server";

export async function PUT(req: Request, res: Response) {
    const supabase = createClient();

    // Get form from the request
    const { form_id, status } = await req.json();
    // Get user from cookies
    const user = await supabase.auth.getUser();

    const { data, error } = await changeFormStatus({ form_id, status });

    if (error) {
        console.log("Route Error:" + error);
        return new Response(JSON.stringify(data), {
            status: error.status || 500,
        });
    }
    return new Response(JSON.stringify(data), {
        status: 200,
    });
}