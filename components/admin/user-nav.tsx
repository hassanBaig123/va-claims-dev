'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import { useEffect } from 'react'
import { cn } from '@/utils'

export function UserNav() {
  const { user, isLoading, refreshUser } = useSupabaseUser()
  const isAdmin = user?.app_metadata.userlevel >= 500 || false
  const router = useRouter()

  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      refreshUser()
      if (window.location.pathname === '/') {
        router.refresh()
      }
      router.push('/login')
    } else {
      console.error('Error logging out:', error.message)
    }
  }

  useEffect(() => {
    refreshUser() // Run once when the component is loaded
  }, [])

  if (isLoading) {
    return <div>Loading...</div> // Or any other loading indicator
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user && (
          <Avatar className="h-14 w-14 dropdown-trigger">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
            />
            <AvatarFallback className={cn('bg-oxfordBlue text-white')}>
              Menu
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      {user && (
        <DropdownMenuContent
          className="w-56 dropdown-content"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata.full_name || ' '}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email || ' '}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem asChild>
              <Link href="/todos" className="pointer-cursor">
                To-dos
                <DropdownMenuShortcut>
                  <FontAwesomeIcon icon={faArrowRight} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Link href="/todos" className="pointer-cursor">
                Dashboard
                <DropdownMenuShortcut>
                  <FontAwesomeIcon icon={faArrowRight} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="pointer-cursor">
                Profile
                <DropdownMenuShortcut>
                  <FontAwesomeIcon icon={faArrowRight} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/courses" className="pointer-cursor">
                Your Courses
                <DropdownMenuShortcut>
                  <FontAwesomeIcon icon={faArrowRight} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/backlog" className="pointer-cursor">
                    Backlog
                    <DropdownMenuShortcut>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/customers" className="pointer-cursor">
                    Customers
                    <DropdownMenuShortcut>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/orders" className="pointer-cursor">
                    Orders
                    <DropdownMenuShortcut>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/reports" className="pointer-cursor">
                    Reports
                    <DropdownMenuShortcut>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/swarm" className="pointer-cursor">
                    Swarm
                    <DropdownMenuShortcut>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button onClick={handleLogout} className="pointer-cursor">
              Log out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
