import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'

export function LoggedInUserNav() {
  const { user } = useSupabaseUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user ? (
          <Avatar className="h-8 w-8 dropdown-trigger">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
            />
            <AvatarFallback>
              {user.user_metadata.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full dropdown-trigger"
          >
            Log In
          </Button>
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
                {user.user_metadata.full_name || 'Guest'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email || 'No email'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/todos" className="pointer-cursor">
                Dashboard
                <DropdownMenuShortcut>
                  <FontAwesomeIcon icon={faArrowRight} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="pointer-cursor">
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
              <Link href="/my-products" className="pointer-cursor">
                Your Products
                <DropdownMenuShortcut>
                  <FontAwesomeIcon icon={faArrowRight} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout" className="pointer-cursor">
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
