"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  // Define your navigation links as a data source
  const adminNavLinks = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/swarm", label: "Swarm" },
  ];

  const customerNavLinks = [
    { href: "/profile", label: "Dashboard" },
    { href: "/courses", label: "My Courses" },
    { href: "/offers", label: "Offers" },
  ];
  console.log("pathname", pathname);
  // Function to determine if the link is the current route
  const isActive = (link: { href: string; label: string }) => {
    // Function to remove trailing slash for consistent comparison
    const normalizePath = (path: string) =>
      path.endsWith("/") ? path.slice(0, -1) : path;

    const normalizedPathname = normalizePath(pathname ?? "");
    const normalizedHref = normalizePath(link.href);

    return (
      normalizedPathname === normalizedHref ||
      normalizedPathname.includes(link.label.toLowerCase())
    );
  };

  const navLinks = pathname?.includes("admin")
    ? adminNavLinks
    : customerNavLinks;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            {
              "text-primary": isActive(link), // Pass the entire link object
              "text-muted-foreground": !isActive(link),
            }
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
