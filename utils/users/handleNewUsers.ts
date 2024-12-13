import { createClient } from "@/utils/supabase/client";

// Function to create a new user and send a magic link
async function createAndSendMagicLink(email: string): Promise<string | null> {
    const supabase = createClient();
    console.log('Magic link redirecting to:', `${process.env.ALLOWED_ORIGIN}/set-password?email=${encodeURIComponent(email)}`);
    const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: `${process.env.ALLOWED_ORIGIN}/set-password`
        }
    });
    if (error) {
        console.error("Error sending magic link:", error.message);
        return null;
    }
    return "success"; 
}

// Function to add a customer with their Stripe ID to the 'customers' table
async function addCustomerToTable(userId: string, stripeCustomerId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('customers')
        .insert([{ user_id: userId, stripe_id: stripeCustomerId }]);
    if (error) throw new Error(error.message);
}

// Function to record a purchase in the 'purchases' table
async function recordPurchase(userId: string, productId: string, amount: number): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('purchases')
        .insert([{ user_id: userId, package_id: productId, purchase_date: new Date(), amount }]);
    if (error) throw new Error(error.message);
}

export { createAndSendMagicLink, addCustomerToTable, recordPurchase };