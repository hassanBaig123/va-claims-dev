'use server'
import { createClient } from '@/utils/supabase/server'

// Function to get order history for a specific user
export const getOrderHistory = async (userId: string) => {
  const supabase = await createClient()

  try {
    // Fetch purchases for the user from the 'purchases' table
    const { data: purchasesData, error: purchasesError } = await supabase
      .from('purchases')
      .select('* , user:user_id(*)')
      .eq('user_id', userId)

    if (purchasesError) {
      throw new Error(purchasesError.message)
    }

    // Extract package IDs from the purchases data
    const packageIds = purchasesData?.map(purchase => purchase?.package_id);
    // Fetch product details for the extracted package IDs from the 'products' table
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', packageIds);

    if (productsError) {
      throw new Error(productsError.message)
    }

    // Merge purchases data with corresponding product details
    const mergedData = purchasesData.map(purchase => ({
      ...purchase,
      product: productsData.find(product => product.id === purchase.package_id) || null,
    }));

    return {
      data: mergedData,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
    }
  }
}