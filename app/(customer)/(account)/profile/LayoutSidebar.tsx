'use client'

import { SidebarNav } from '@/components/sidebar-nav'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { getValidID } from '@/utils/helpers'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const LayoutSidebar = ({ getUser }: any) => {
  const pathname = usePathname()
  const { user, inspectUserId } = useSupabaseUser()
  const dataContext = useSupabaseUser()
  const [userId, setUserId] = useState<string | null>(null)
  const isAdmin = user?.app_metadata?.userlevel >= 500 || false

  useEffect(() => {
    if (inspectUserId) {
      setUserId(inspectUserId)
      if (getUser) {
        getUser(inspectUserId)
      }
      return
    }
    const validatedUserId = getValidID(pathname)
    if (validatedUserId) {
      setUserId(validatedUserId)
    } else if (user?.id) {
      setUserId(user.id)
    }
  }, [pathname, user, inspectUserId])

  const sidebarNavItems = isAdmin
    ? [
        {
          title: 'Profile',
          href: `/profile/${userId}`,
        },
        {
          title: 'Billing Info',
          href: `/profile/billing-info/${userId}`,
        },
        {
          title: 'Courses',
          href: `/profile/courses/${userId}`,
        },
        {
          title: 'Order History',
          href: `/profile/order-history/${userId}`,
        },
      ]
    : [
        {
          title: 'Profile',
          href: `/profile/${userId}`,
        },
        {
          title: 'Notifications',
          href: '/notifications',
        },
        {
          title: 'Account',
          href: '/account',
        },

        {
          title: 'Order History',
          href: `/profile/order-history/${userId}`,
        },
      ]

  return (
    <aside className="-mx-4 lg:w-1/5">
      <SidebarNav items={sidebarNavItems} />
    </aside>
  )
}

export default LayoutSidebar
