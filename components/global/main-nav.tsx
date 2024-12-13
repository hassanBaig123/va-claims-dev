"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoggedInUserNav } from "@/components/global/logged-in-user-nav";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { createClient } from "@/utils/supabase/client";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const supabase = createClient();

  // Define your navigation links as a data source
  const adminNavLinks = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/backlog", label: "Backlog" },
    { href: "/admin/customers", label: "Customers" },
  ];

  const customerNavLinks = [
    { href: "/profile", label: "Dashboard" },
    { href: "/courses/all/1", label: "My Courses" },
    { href: "/offers", label: "Offers" },
  ];

  // Function to determine if the link is the current route
  const isActive = (link: { href: string; label: string }) => {
    const normalizedPathname = pathname ?? "";

    if (
      link.href === "/courses/all" &&
      normalizedPathname.includes("courses")
    ) {
      return true;
    }

    return normalizedPathname === link.href;
  };

  const navLinks = pathname?.includes("admin")
    ? adminNavLinks
    : customerNavLinks;

  return (
    <nav
      className={cn(
        "flex items-center justify-between space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4 lg:space-x-6">
        <Link className="flex flex-grow justify-items-start" href="/">
          <img
            src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png"
            alt="Logo"
            className="h-10 md:h-20 m-4"
          />
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              {
                "text-primary": isActive(link),
                "text-muted-foreground": !isActive(link),
              }
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* <LoggedInUserNav /> */}
    </nav>
  );
}
