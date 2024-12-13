import { createClient} from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();

    //Get form from the request
    const { report } = await req.json();
    console.log(report);
    //Get user from cookies
    const user = await supabase.auth.getUser();
    //Get user id
    const user_id = user.data.user?.id;
    
    //Upload form into the forms table
    const { data, error } = await supabase
    .schema("public")
    .from("reports")
    .insert({
        user_id: user_id,
        report: JSON.stringify(report)
    });
    
    if(error) {
        console.log("POST error", error);
        return new Response(error.message, {
            status: 500,
        });
    }

    if(data) {
        return new Response(JSON.stringify(data), {
            status: 200,
        });
    } else {
        return new Response("Not Found", {
            status: 404,
        });
    }
}