import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function getTools(search?: string) {
    let query = supabase.from('tools').select('*');
    if (search) {
        query = query.ilike('name', `%${search}%`);
    }
    const { data, error } = await query;
    if (error) {
        console.error('Error fetching tools:', error);
        return null;
    }

    return data;
}


export async function updateTool(
    id: number,
    payload: { name: string; description: string; result_keys: string[] }
) {
    const { name, description, result_keys } = payload;

    const { data, error } = await supabase
        .from('tools')
        .update({
            name,
            description,
            result_keys: result_keys || [],
        })
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error updating tool:', error);
        return { success: false, error };
    }

    return { success: true, data };
}


export async function addTool(
    payload: { name: string; description?: string; result_keys?: string[] }
) {
    const { name, description, result_keys } = payload;

    const { data, error } = await supabase
        .from('tools')
        .insert({
            name,
            description: description || '',
            result_keys: result_keys || [],
        })
        .single();

    if (error) {
        console.error('Error adding tool:', error);
        return { success: false, error };
    }

    return { success: true, data };
}

export async function deleteTool(id: number) {
    const { data, error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error deleting tool:', error);
        return { success: false, error };
    }

    return { success: true, data };
}