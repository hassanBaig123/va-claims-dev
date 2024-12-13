'use client'
import { Separator } from '@/components/ui/separator'
import { User } from '@/types/supabase.tables'
import { ProfilePageContextProvider } from '@/context/ProfilePageContext'
import { ProfileBillingForm } from './billing-form'

export default function ProfileBillingPage({ user }: { user: User }) {
  return (
    <ProfilePageContextProvider user={user}>
      <div className="space-y-6 w-full lg:w-[50%]">
        <div>
          <h3 className="text-lg font-medium">Billing</h3>
          <p className="text-sm text-muted-foreground"></p>
        </div>
        <Separator />
        <ProfileBillingForm />
      </div>
    </ProfilePageContextProvider>
  )
}
