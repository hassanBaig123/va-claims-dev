'use client'
import { Separator } from '@/components/ui/separator'
import { ProfileForm } from '@/app/(customer)/(account)/profile/profile-form'
import { User } from '@/types/supabase.tables'
import { ProfilePageContextProvider } from '@/context/ProfilePageContext'

export default function ProfileClientPage({ user }: { user: User }) {
  return (
    <ProfilePageContextProvider user={user}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground"></p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </ProfilePageContextProvider>
  )
}
