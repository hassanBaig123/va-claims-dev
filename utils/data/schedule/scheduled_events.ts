import { DateTime } from "luxon";
import { createClient } from "@/utils/supabase/server";
import { groupByUserAndAppendUserMeta } from "@/utils/data/forms/getFormsIndividualBacklog";

export const getEventWithNotesById = async (id: string) => {
    const supabase = await createClient();
    supabase.auth.getUser();

    const { data, error } = await supabase
        .from("scheduled_events")
        .select("id, users (id, full_name), start_time, decrypted_notes (id, decrypted_note, users (id, full_name), created_at, updated_at), created_at, updated_at")
        .eq("event_id", id)
        .single();

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    if (data) {
        return data;
    }
}

interface DiscoveryCallOptions {
    status?: string;
    query?: string;
    timeFilter?: boolean;
    not?: boolean;
}

export const discoveryCalls = async ({ status, query = '', timeFilter = false, not = false }: DiscoveryCallOptions) => {
    const supabase = await createClient();

    const queryBuilder = supabase
        .from("scheduled_events")
        .select("id, users!inner(id, full_name), start_time, created_at, updated_at, decrypted_notes (id, decrypted_note, users(id, full_name), created_at, updated_at)")

    if (status) {
        if (not) {
            queryBuilder.neq("status", status);
        } else {
            queryBuilder.eq("status", status);
        }
    }

    if (timeFilter) {
        const now = DateTime.now().plus({ minutes: 30 }).toISO({ includeOffset: false }) + '000Z';
        queryBuilder.lte("start_time", now);
    }

    if (query) {
        queryBuilder.ilike("users.full_name", `%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return await groupByUserAndAppendUserMeta(data || null);
};


