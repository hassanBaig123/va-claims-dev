'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { buttonVariants } from './ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
  removeString?: string
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { inspectUserId, setAdminInspectUserId } = useSupabaseUser()

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 no-scrollbar',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </Link>
      ))}

      {inspectUserId && (
        <Link
          href="/profile"
          onClick={() => setAdminInspectUserId(null)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          Exit admin view
        </Link>
      )}
    </nav>
  )
}
