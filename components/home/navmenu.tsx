'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Menubar } from '../ui/menubar'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { UserNav } from '../admin/user-nav'
import { ChevronsDown, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface MenuItem {
  title: string
  href?: string
  description?: string
  contentList?: {
    title: string
    description: string
    href: string
  }[]
  img?: {
    src: string
    title: string
    href: string
  }
}

export function NavigationMenuDemo() {
  const { user, isLoading } = useSupabaseUser()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)

  // @TODO: this is just a limited time fix to remove blogs from prod
  // for blog content creation before showing on production
  const isProd =
    process.env.NEXT_PUBLIC_BASE_URL === 'https://www.vaclaims-academy.com'

  const closeSheet = () => {
    setIsSheetOpen(false)
  }

  const fetchMenuItems = () => {
    setMenuItems(
      [
        {
          title: 'Getting started',
          contentList: [
            {
              title: 'Offerings',
              description:
                'Discover our comprehensive plans and exclusive features.',
              href: '/#pricing-section',
            },
            {
              title: 'VetVictory Custom Guide',
              description:
                'See how our VetVictory Custom Guide can help you win your VA Rating.',
              href: '/#clearpath-report',
            },
          ],
        },
        {
          title: 'VA Disability Calculator',
          href: '/va-disability-calculator',
        },
        user
          ? {
              title: 'Dashboard',
              href: '/todos',
            }
          : null,
        user
          ? {
              title: 'My Courses',
              href: '/courses',
            }
          : null,
        {
          title: 'About Us',
          href: '/about-us',
        },
        {
          title: 'Testimonials',
          href: '/testimonials',
        },
        isProd
          ? null
          : {
              title: 'Blogs',
              href: '/blog',
            },
        !user
          ? {
              title: 'Login',
              href: '/login',
            }
          : null,
      ].filter(Boolean) as MenuItem[],
    )
  }

  useEffect(() => {
    if (!isLoading) {
      fetchMenuItems()
    }
  }, [isLoading])

  return (
    <div className=" w-full  flex justify-center items-center">
      <Menubar className="w-full h-fit flex justify-center border-0 border-b-[0px] border-b-gray-300 sm:border-b-[1px] sm:border-b-gray-300 rounded-none sm:border-0 bg-transparent shadow-none z-50 absolute top-0 py-[10px] px-[20px] sm:py-[20px] sm:px-[40px] customxl:px-[20px]">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <Link className="flex flex-grow justify-items-start" href="/">
            <Image
              src="/imgs/Logo/VA_CLAIMS_NEW.svg"
              alt="Logo"
              width={269}
              height={80}
              className="w-[135px] h-[40px] sm:w-[269px] sm:h-[80px]"
            />
          </Link>
          {!user && (
            <Link href="/login" className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="bg-oxfordBlueNew text-white mr-3"
              >
                Member Login
              </Button>
            </Link>
          )}
          <SheetTrigger asChild>
            <Button
              // variant="outline"
              size="icon"
              className="flex flex-col justify-center items-center sm:hidden shadow-none"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-w-[370px]">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                className="flex flex-grow justify-items-start"
                href="/"
                onClick={closeSheet}
              >
                <Image
                  src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png"
                  alt="Logo"
                  width={500}
                  height={500}
                  className="h-20 md:h-20 w-20 md:w-20"
                />
              </Link>
              {menuItems.map((item, index) =>
                item.contentList ? (
                  <Collapsible
                    key={index}
                    open={isCollapsibleOpen}
                    onOpenChange={setIsCollapsibleOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Link href="#" className="flex items-center ">
                        <span>{item.title}</span>
                        <ChevronsDown className="h-4 w-4 ml-1" />
                      </Link>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2">
                      <ul className="list-none p-0 pl-5">
                        {item.contentList.map((contentItem, index) => (
                          <li key={index}>
                            <Link
                              href={contentItem.href}
                              className="text-sm text-muted-foreground hover:text-foreground "
                              onClick={closeSheet}
                            >
                              {contentItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    key={index}
                    href={item.href || '/'}
                    className="text-muted-foreground hover:text-foreground"
                    onClick={closeSheet}
                  >
                    {item.title}
                  </Link>
                ),
              )}
            </nav>
          </SheetContent>
          <NavigationMenu className="hidden sm:flex w-full justify-end z-30 overflow-visible">
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.contentList ? (
                    <>
                      <NavigationMenuTrigger className="font-medium text-base  hover:text-crimsonNew bg-transparent">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="w-[400px] p-[40px]">
                          {item.contentList.map((contentItem, index) => (
                            <div key={index} className="mt-[20px]">
                              <ListItem
                                href={contentItem.href}
                                title={contentItem.title}
                              >
                                {contentItem.description}
                              </ListItem>
                            </div>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href || '/'} legacyBehavior passHref>
                      <NavigationMenuLink className=" font-medium mx-2  group inline-flex w-max items-center justify-center rounded-md text-base hover:text-crimsonNew focus:text-crimsonNew focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-base bg-transparent text-oxfordBlueNew">
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="pl-3">
            <UserNav />
          </div>
        </Sheet>
      </Menubar>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a ref={ref} className={cn(className)} {...props}>
          <div className="flex flex-col gap-[10px]">
            <div className="font-medium text-lg font-bold leading-none text-oxfordBlueNew hover:text-crimsonNew font-sans">
              {title}
            </div>
            <p className="font-sans text-base font-normal text-platinum_950">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
