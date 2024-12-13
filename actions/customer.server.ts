"use server";

import { CustomerUser } from "@/types/supabase.tables";
import { createClient } from "@/utils/supabase/server";

interface GetCustomers {
  error?: any;
  data: CustomerUser[];
  count: number;
}

export const getCustomers = async ({
  pageParam = 1,
  searchQuery = '',
  sortDirection,
}: {
  pageParam?: number;
  searchQuery?: string;
  sortDirection: { [key: string]: 'asc' | 'desc' };
}): Promise<GetCustomers> => {
  const supabase = await createClient();

  const itemsPerPage = 100;
  const sortedKey = Object.keys(sortDirection)[0];
  const isAscending = sortDirection[sortedKey];

  // Map the sortedKey to the expected sort_column in the SQL function
  const sortKeyMap: { [key: string]: string } = {
    'user(old_user_id)': 'old_user_id',
    'user(full_name)': 'full_name',
    'user(email)': 'email',
    'user(order_count)': 'order_count',
    'user(last_logged_in)': 'last_logged_in',
    'user(avatar_url)': 'avatar_url',
    'user(plan_name)': 'plan_name',
    'user(meta)': 'meta',
    'user(upcoming_event_start_time)': 'upcoming_event_start_time',
    // Add other mappings as needed
  };

  const sortColumn = sortKeyMap[sortedKey];

  if (!sortColumn) {
    console.error(`Invalid sort column: ${sortedKey}`);
    return { count: 0, error: new Error('Invalid sort column'), data: [] };
  }

  console.log({
    search_text: searchQuery,
    page_number: pageParam,
    page_size: itemsPerPage,
    sort_column: sortColumn,
    sort_direction: isAscending,
  })

  // Call the RPC function with the mapped sortColumn
  const { data, error } = await supabase.rpc('get_customers_with_count' as any, {
    search_text: searchQuery,
    page_number: pageParam,
    page_size: itemsPerPage,
    sort_column: sortColumn,
    sort_direction: isAscending,
  });

  if (error) {
    console.error('Error fetching customers:', error);
    return { count: 0, error, data: [] };
  }

  const result = data as {
    total_count: number;
    data: any[];
  };

  return {
    data: result.data,
    count: result.total_count,
  };
};



export const totalCustomers = async () => {
  const supabase = await createClient();

  const { count } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  return count;
};
