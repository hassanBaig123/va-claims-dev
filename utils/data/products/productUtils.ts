import { createClient } from '@/utils/supabase/server'
import { PurchaseProduct } from "@/components/learn-more/paypal";


export async function getProductDetails(
  productId: string,
): Promise<ProductDetails | null> {
  console.log('Fetching product details for ID (in utils):', productId)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, prices (unit_amount), metadata')
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Failed to fetch product details:', error)
    return null
  }

  return data as ProductDetails
}

export const getPurchaseProductsServer = async (
  type: "all" | 'paypal' | 'stripe' | 'paypal-additional' | 'stripe-additional' | 'tier' | 'upgrade' | "addOns" | 'others' | "old-products",
): Promise<PurchaseProduct[]> => {
  try {
    const supabase = await createClient()
    // Define base query
    let query = supabase
      .from('products')
      .select(
        `id,
        name,
        metadata,
        description,
        prices!inner (unit_amount)`
      );

    // Apply filters based on type
    switch (type) {
      case 'all':
        break;
      case 'paypal':
        // Numeric ID 
        query = query
          .not('id', 'like', 'prod_%');
        break;
      case 'stripe':
        // ID starting with 'prod_'
        query = query
          .like('id', 'prod_%');
        break;
      case 'paypal-additional':
        // Numeric ID and specific price
        query = query
          .eq('prices.unit_amount', 97)
          .not('id', 'like', 'prod_%');
        break;

      case 'stripe-additional':
        // ID starting with 'prod_' and specific price
        query = query
          .eq('prices.unit_amount', 97)
          .like('id', 'prod_%');
        break;

      case 'tier':
        // Filter by names for Tier products
        query = query
          .in('name', ['Expert Tier', 'Master Tier', 'Grandmaster Tier']);
        break;

      case 'upgrade':
        // Filter by specific name for Upgrade products
        query = query
          .ilike('name', '%Upgrade%');
        break;

      case 'addOns':
        // Numeric ID 
        query = query
          .not('id', 'like', 'prod_%')
          .in('name', ['Expedite Service', 'Rush Service']);
        break;

      case 'others':
        // Exclude all other categories
        query = query
          .not('prices.unit_amount', 'eq', 9700)
          .not('name', 'in', ['Silver Tier', 'Master Tier', 'Grandmaster Tier'])
          .not('name', 'ilike', '%Upgrade%');
        break;

      case 'old-products':
        query = query
          .not('metadata->course_ids', 'is', null); // Check if 'course_ids' key exists in metadata
        break;


      default:
        console.warn(`Unknown product type: ${type}`);
    }

    // Execute the query
    let { data, error } = await query;

    if (error) throw error;

    // Map and set products
    const products: PurchaseProduct[] = data?.map((product) => ({
      id: product?.id,
      name: product?.name || "",
      metadata: product?.metadata,
      description: product?.description || "",
      price: +(product?.prices?.[0]?.unit_amount || 0),
    })) || [];

    return products || []
  } catch (e) {
    console.error('Error fetching products:', e);
    return []
  }
};
