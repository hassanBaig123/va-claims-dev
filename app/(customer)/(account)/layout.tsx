'use client'

import { Separator } from '@/components/ui/separator'
import LayoutSidebar from './profile/LayoutSidebar'
import { useState } from 'react'
// import { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'Forms',
//   description: 'Advanced form example using react-hook-form and Zod.',
// }

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [userId, setUser] = useState<any>(null)
  return (
    <>
      <div className="space-y-6 p-10 pt-4 px-10 pb-16 md:block lg:min-h-[700px]">
        {!userId && (
          <>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
              <p className="text-muted-foreground">
                Manage your account settings and set e-mail preferences.
              </p>
            </div>
            <Separator className="my-6" />
          </>
        )}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <LayoutSidebar
            getUser={(userId: any) => {
              setUser(userId)
            }}
          />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
