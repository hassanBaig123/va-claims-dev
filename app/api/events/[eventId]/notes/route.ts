import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
    const supabase = createClient();

    await supabase.auth.getUser();

    const { data, error } = await supabase.schema('public').from('scheduled_events').select('id, decrypted_notes (id, decrypted_note, created_at), users (id, full_name, email)').eq('id', params.eventId).single();

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

export async function PUT(req: NextRequest, { params }: { params: { eventId: string } }) {
    const supabase = createClient();

    console.log("PUT /api/events/:eventId/notes", req.body);
    console.log("Params", params);

    await supabase.auth.getUser();

    const { data, error } = await supabase.schema('public').from('notes').update({status: "submission_approved"}).eq('id', params.eventId).single();

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

