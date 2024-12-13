import { Separator } from "@/components/ui/separator"
import CustomerPortalForm from "@/components/AccountForms/CustomerPortalForm"
import { createClient } from "@/utils/supabase/client";


export default async function PurchasesPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Purchases</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <CustomerPortalForm subscription={subscription} />

    </div>
  )
}
