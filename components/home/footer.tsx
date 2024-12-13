import Link from "next/link"
import { JSX, SVGProps } from "react"

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UmmoOIIdCNW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Footer({ isHomePage }: { isHomePage?: boolean }) {
    return (
      <footer className={`${isHomePage ? 'mb-40' : ''} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-7 md:grid-cols-7 gap-8">
            <div className="col-span-2 md:col-span-2">
            <Link className="flex flex-grow justify-items-start" href="/">
            <img src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png" alt="Logo" className="h-20 md:h-36 m-4" />
            </Link>
              <p className="mt-2 text-sm ">VA Claims Academy © 2024</p>
            </div>
            <div className="col-span-1 md:col-start-4">
              <h3 className="text-sm font-semibold">Features</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Sessions
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Rules
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-1">
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Help center
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-1">
              <h3 className="text-sm font-semibold ">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    About us
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    News
                  </a>
                </li>
                <li>
                  <a className="text-sm  hover:text-gray-900" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-1 md:col-span-1">
                <h3 className="text-sm font-semibold ">Follow us</h3>
                <div className="flex mt-4 space-x-3">
                    <a className=" hover:text-gray-900" href="#">
                        <TwitterIcon className="h-5 w-5" />
                    </a>
                    <a className=" hover:text-gray-900" href="#">
                        <ShoppingBasketIcon className="h-5 w-5" />
                    </a>
                    <a className=" hover:text-gray-900" href="#">
                        <LinkedinIcon className="h-5 w-5" />
                    </a>
                </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 text-center">
              <Link href="/terms-of-service" className="hover:underline">Terms</Link> · <Link href="/privacy-policy" className="hover:underline">Privacy & Policy</Link> · <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
            </p>
          </div>
        </div>
      </footer>
    )
  }
  
  function LinkedinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  }
  
  
  function ShoppingBasketIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 11 4-7" />
        <path d="m19 11-4-7" />
        <path d="M2 11h20" />
        <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
        <path d="m9 11 1 9" />
        <path d="M4.5 15.5h15" />
        <path d="m15 11-1 9" />
      </svg>
    )
  }
  
  
  function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    )
  }
  