'use client'

import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const pathname = usePathname()
  const { user, isLoading } = useSupabaseUser()
  const isAdmin = user?.app_metadata.userlevel >= 500 || false

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const year = new Date().getFullYear()
    setCurrentYear(year)
  }, [])

  const customerFooterLinks = [
    { href: '/profile', label: 'Dashboard' },
    { href: '/courses', label: 'My Courses' },
  ]

  const resourceLinks = [
    { href: '/#faq', label: 'FAQs' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
  ]

  return (
    !isLoading && (
      <footer className="bg-white text-gray-600 py-8">
        <Link className="flex flex-grow justify-center py-4" href="/">
          <img
            src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png"
            alt="Logo"
            className="h-32 md:h-36 m-4"
          />
        </Link>
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-center my-5">
            <div className="mb-6 w-1/2 flex justify-center flex-wrap">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 w-full">
                  QUICK LINKS
                </h3>
                <ul className="space-y-2 w-full">
                  {customerFooterLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-lg hover:text-gray-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mb-6 w-1/2 flex justify-center flex-wrap">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  RESOURCES
                </h3>
                <ul className="space-y-2">
                  {resourceLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-lg hover:text-gray-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              FOLLOW US
            </h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-600">
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} VA CLAIMS ACADEMY. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link
                href="/terms"
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="/disclaimer"
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
  )
}
