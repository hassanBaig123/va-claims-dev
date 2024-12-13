import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@/utils/supabase/server";


export async function GET(req: NextApiRequest, { params }: { params: { userId: string } }) {
    const supabase = createClient();

    supabase.auth.getUser();

    const { data, error } = await 
    supabase.schema('public')
    .from('scheduled_events')
    .select('id, user_id, start_time, users (id, full_name)')
    .eq('user_id', params.userId)
    .order('start_time', { ascending: true });

    if(error) {
        return new Response(error.message, {
            status: 500,
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

