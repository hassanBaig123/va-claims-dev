'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

import './nav-style.css'

type NavLink = {
  href: string
  label: string
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [canUpgrade, setCanUpgrade] = useState(true)
  const [needsTodos, setNeedsTodos] = useState(false)

  useEffect(() => {
    const fetchUserTier = async () => {
      const response = await fetch('/api/user/userTier')
      const data = await response.json()
      const tierPackageIds = await getPurchaseProducts('old-products')
      const userTier = tierPackageIds.find((tier) => tier.id === data.tier)
        ?.metadata?.tier
      const noUpgradeTiers = [
        'gold',
        'upgrade_bronze_to_gold',
        'upgrade_silver_to_gold',
      ]
      const needsTodosTiers = [
        'bronze',
        'gold',
        'silver',
        'upgrade_bronze_to_gold',
        'upgrade_silver_to_gold',
        'upgrade_bronze_to_silver',
        'expert',
        'master',
        'grandmaster',
        'upgrade_expert_to_master',
        'upgrade_master_to_grandmaster',
        'upgrade_expert_to_grandmaster',
      ]
      if (userTier) {
        setCanUpgrade(!noUpgradeTiers.includes(userTier))
        setNeedsTodos(needsTodosTiers.includes(userTier))
      }
    }
    fetchUserTier()
  }, [])

  const adminNavLinks: NavLink[] = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/backlog', label: 'Backlog' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/orders', label: 'Orders' },
  ]

  const customerNavLinks: (NavLink | undefined)[] = [
    { href: '/todos', label: 'Dashboard' },
    { href: '/courses', label: 'My Courses' },
    // { href: '/tools', label: 'Tools' },
    canUpgrade ? { href: '/upgrade', label: 'Upgrade' } : undefined,
    // needsTodos ? { href: '/todos', label: 'To-dos' } : undefined,
  ]

  const isActive = (link: NavLink) => {
    const normalizedPathname = pathname ?? ''
    if (
      link.href === '/courses/all' &&
      normalizedPathname.includes('courses')
    ) {
      return true
    }
    return normalizedPathname === link.href
  }

  const navLinks: NavLink[] = (
    pathname?.includes('admin') ? adminNavLinks : customerNavLinks
  ).filter((link): link is NavLink => Boolean(link))

  return (
    <header className="sticky headerClass top-0 flex h-16 items-center gap-4 bg-background px-4 md:px-6 bg-white">
      <Link className="flex logoClass flex-grow justify-items-start" href="/">
        <Image
          src="/imgs/Logo/RGB/PNG/200px (small size)/Logo Icon/Transparent Background/VA_Claims_Logo_Icon_2_Transparent_1_200px.png"
          alt="Logo"
          width={500}
          height={500}
          className="h-10 md:h-[3.5rem] w-10 md:w-[3.5rem] m-4"
        />
      </Link>
      <nav className="hidden navClass flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-lg font-medium transition-colors hover:text-primary',
              {
                'text-crimsonNew underline': isActive(link),
                'text-muted-foreground': !isActive(link),
              },
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="max-w-[370px]">
          <nav className="grid gap-6 text-lg font-medium">
            <Link className="flex flex-grow justify-items-start" href="/">
              <Image
                src="/imgs/Logo/RGB/PNG/200px (small size)/Logo Icon/Transparent Background/VA_Claims_Logo_Icon_2_Transparent_1_200px.png"
                alt="Logo"
                width={500}
                height={500}
                className="h-20 md:h-20 w-20 md:w-20"
              />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary',
                  {
                    'text-primary': isActive(link),
                    'text-muted-foreground': !isActive(link),
                  },
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
