import { createClient } from '@/utils/supabase/server';
import { getReportsBacklog } from "@/utils/data/reports/getReportsBacklog";

export const groupByUserAndAppendUserMeta = async (items: any[]) => {
  const groupedData = items.reduce((acc, item) => {
    const userId = item.users?.id || item.user_id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(item);
    return acc;
  }, {});

  const userIds = Object.keys(groupedData)
  await Promise.all(userIds.map(async (userId) => {
    const metaData = await getUserMetaData(userId)
    if (metaData) {
      groupedData[userId] = groupedData[userId].map((x: any) => ({ ...x, meta: metaData }))
    }
  }));

  return groupedData
};

interface GetFormsOptions {
  type: 'intake' | 'supplemental' | 'additional';
  status: 'created' | 'submitted';
  query?: string;
  groupByUserAndAppendUserMeta?: boolean;
}

export async function getForms({ type, status, query = '', }: GetFormsOptions) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('forms')
    .select('id, title, status, type, created_at, updated_at, users!inner(id, full_name, email)')
    .eq('status', status)
    .eq('type', type)
    .ilike('users.full_name', `%${query}%`);

  if (error) throw error;

  return await groupByUserAndAppendUserMeta(data || []);
}

export async function getData(query = "") {
  const [
    intakesNotCompleted,
    intakesSubmitted,
    supplementalsNotCompleted,
    supplementalsNeedingApproval,
  ] = await Promise.all([
    getForms({
      type: 'intake',
      status: 'created',
      query,
    }),
    getForms({
      type: 'intake',
      status: 'submitted',
      query
    }),
    getForms({
      type: 'supplemental',
      status: 'created',
      query
    }),
    getForms({
      type: 'supplemental',
      status: 'submitted',
      query,
    }),
  ]);
  const reports = await getReportsBacklog(query);

  if (!intakesNotCompleted) {
    throw new Error('Failed to fetch data');
  }
  return {
    forms: {
      intakesNotCompleted,
      intakesSubmitted,
      supplementalsNotCompleted,
      supplementalsNeedingApproval,
    },
    reports,
  };
}


const getUserMetaData = async (userId: string) => {
  const supabase = await createClient();
  const { data: metaData, error: metaError } = await supabase
    .from('user_meta')
    .select('*')
    .eq('user_id', userId)
    .eq('meta_key', 'planPurchasePromotion');

  if (metaError) {
    console.error(`Error fetching user_meta for user_id: ${userId}`, metaError);
    return;
  }
  if (metaData?.length > 0) {
    return metaData
  }
  return false;
}