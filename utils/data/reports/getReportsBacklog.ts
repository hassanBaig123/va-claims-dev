import { createClient } from '@/utils/supabase/server'
import { groupByUserAndAppendUserMeta } from "@/utils/data/forms/getFormsIndividualBacklog";

export const getReportsBacklog = async (query: string = '') => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id;
  const { data, error } = await supabase
    .from('decrypted_reports')
    .select(`
      id,
      status,
      users!inner(id, full_name),
      decrypted_report,
      created_at,
      updated_at
    `)
    .neq('status', 'submission_approved')
    .ilike('users.full_name', `%${query}%`);

  if (error) {
    console.log('POST error', error);
    return new Response(error.message, {
      status: 500,
    });
  }

  return await groupByUserAndAppendUserMeta(data || [])
};
