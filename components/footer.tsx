"use client";

import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const { user, isLoading } = useSupabaseUser();
  const isAdmin = user?.app_metadata.userlevel >= 500 || false;

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  const adminFooterLinks = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/backlog", label: "Backlog" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/swarm", label: "Swarm" },
  ];

  const customerFooterLinks = [
    { href: "/profile", label: "Dashboard" },
    { href: "/courses", label: "My Courses" },
  ];

  const footerLinks = pathname?.includes("admin")
    ? adminFooterLinks
    : customerFooterLinks;

  if (isLoading) {
    return null; // Or return a loading indicator if preferred
  }

  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8 ">
        <nav aria-label="Footer" className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12">
          {footerLinks.map((item) => (
            <div key={item.label} className="pb-6">
              <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                {item.label}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {currentYear} VA CLAIMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
