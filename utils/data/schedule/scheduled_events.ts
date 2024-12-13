import { createClient } from "@/utils/supabase/server";
import { DateTime } from "luxon";
import { inspect } from "util";

export const getEventWithNotesById = async (id: string) => {
    const supabase = await createClient();
    supabase.auth.getUser();

    const { data, error } = await supabase
        .from("scheduled_events")
        .select("id, users (id, full_name), start_time, decrypted_notes (id, decrypted_note, users (id, full_name), created_at, updated_at), created_at, updated_at")
        .eq("event_id", id)
        .single();
    
    if(error) {
        console.log(error);
        throw new Error(error.message);
    }

    if(data) {
        return data;
    }
}

export const discoveryCalls = async () => {
    const supabase = await createClient();
    supabase.auth.getUser();

    const now = DateTime.now().plus({minutes: 30}).toISO({ includeOffset: false }) + '000Z';

    const { data, error } = await supabase
        .from("scheduled_events")
        .select("id, users (id, full_name), start_time, created_at, updated_at, decrypted_notes (id, decrypted_note, users(id, full_name), created_at, updated_at)")
        .neq("status", "submission_approved");
    
    if(error) {
        console.log(error);
        throw new Error(error.message);
    }

    if(data) {
        return data;
    } else {
        return null;
    }
}

