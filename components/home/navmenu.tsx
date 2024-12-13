"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import  Icons, { DotIcon, HamburgerMenuIcon, InstagramLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menubar } from "../ui/menubar"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"


const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

const menuItems: { title: string; href: string; description: string }[] = [
    {
      title: "Getting Started",
      href: "/getting-started",
      description: "Learn how to get started with our application.",
    },
    {
      title: "Components",
      href: "/components",
      description: "Explore the various components we offer.",
    },
    {
      title: "Documentation",
      href: "/docs",
      description: "Find detailed documentation about our application.",
    },
    // Add more items as needed
  ];

export function NavigationMenuDemo() {
    const [theme, setTheme] = React.useState('light');
    const [isOpen, setIsOpen] = React.useState(false); // Add this line

    const toggleTheme = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Add this function
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

  return (
    <Menubar className="w-full h-fit flex justify-center border-0 px-6 md:px-10 bg-transparent shadow-none z-50 absolute top-0">
    <Link className="flex flex-grow justify-items-start" href="/">
    <img src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png" alt="Logo" className="h-20 md:h-36 m-4" />
    </Link>
    
    <button className="flex flex-col justify-center items-center sm:hidden" onClick={toggleMenu}>
        
        <span className={`bg-white block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${isOpen ? 
                    'rotate-45 translate-y-1' : '-translate-y-0.5'
                    }`} >
        </span>
        <span className={`bg-white block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 
                    'opacity-0' : 'opacity-100'
                    }`} >
        </span>
        <span className={`bg-white block transition-all duration-300 ease-out 
                        h-0.5 w-6 rounded-sm ${isOpen ? 
                        '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                        }`} >
        </span>  
    
    
    </button>
    {isOpen && (
        <NavigationMenu className="absolute top-20 flex sm:hidden bg-white padding-x-10 max-w-full w-full h-fit transition-all duration-300 ease-out">
          <NavigationMenuList className="flex-col w-full">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.title} className="flex flex-col gap-2 p-4 w-full">
                <Accordion type="multiple">
                    <AccordionItem value={item.title}>
                        <AccordionTrigger>
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent>
                            <p>{item.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    <NavigationMenu className="hidden sm:flex w-full justify-end z-30">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-none-important text-md text-oxfordBlue">Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadowUI
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Get started with VA Claims Academy.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/learn-more" title="Learn More">
                Learn more about how together with VA Claims Academy you can win your VA Rating.
              </ListItem>
              <ListItem href="/learn-more#products-area" title="Products">
                View our products and services.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-none-important text-md text-oxfordBlue">Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem                   
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about-us" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-md text-oxfordBlue bg-transparent">
              About Us
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <Switch checked={theme === 'dark'} onChange={toggleTheme} />
    </Menubar>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
