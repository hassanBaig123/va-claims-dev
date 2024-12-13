import Link from 'next/link'
import { JSX, SVGProps } from 'react'

export default function Footer({ isHomePage }: { isHomePage?: boolean }) {
  // @TODO: this is just a limited time fix to remove blogs from prod
  // for blog content creation before showing on production
  const isProd =
    process.env.NEXT_PUBLIC_BASE_URL === 'https://www.vaclaims-academy.com'

  return (
    <footer className={`${isHomePage ? 'mb-40' : ''} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="w-full col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-center justify-center">
            <Link className="flex justify-center" href="/">
              <img
                src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.webp"
                alt="Logo"
                className="h-20 sm:h-28 lg:h-36 m-4"
              />
            </Link>
            <p className="mt-2 text-sm text-center">VA Claims Academy © 2024</p>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold">Get started</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/#pricing-section"
                  className="text-sm hover:underline"
                >
                  Offerings
                </Link>
              </li>
              <li>
                <Link
                  href="/#clearpath-report"
                  className="text-sm hover:underline"
                >
                  VetVictory Claim Guide
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/#faq" className="text-sm hover:underline">
                  FAQs
                </Link>
              </li>
              {!isProd && (
                <li>
                  <Link href="/blog" className="text-sm hover:underline">
                    Blogs
                  </Link>
                </li>
              )}
              <li>
                <Link href="/about-us" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <p className="text-sm">
                  5900 Balcones Drive, STE 100
                  <br />
                  Austin, TX, 78731
                  <br />
                  USA
                </p>
              </li>
              <li>
                <a href="tel:+12102013299" className="text-sm hover:underline">
                  (210) 201-3299
                </a>
              </li>
              <li>
                <a
                  href="mailto:onboarding@vaclaims-academy.com"
                  className="text-sm text-blue-600 hover:underline break-words"
                >
                  onboarding@vaclaims-academy.com
                </a>
              </li>
            </ul>
            <h3 className="text-sm font-semibold mt-6">Follow us</h3>
            <div className="flex mt-4 space-x-3">
              <a
                className="hover:text-gray-900"
                href="https://www.facebook.com/VAClaimsAcademy/"
                aria-label="Facebook"
              >
                <FaceBookIcon className="h-5 w-5" />
              </a>
              <a
                className="hover:text-gray-900"
                href="https://www.youtube.com/@vaclaimsacademy"
                aria-label="YouTube"
              >
                <YouTubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold">Technical Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <ul className="mt-4 space-y-2">
                  <li>
                    <p className="text-sm">
                      <a
                        href="tel:+2102012223"
                        className="text-sm text-blue-600 hover:underline break-words"
                      >
                        (210) 201-2223
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Available Monday - Friday, 8:30 AM - 5:30 PM Central
                      Standard Time
                    </p>
                  </li>
                  <li>
                    <p className="text-sm text-blue-600 hover:underline break-words">
                      <a
                        href="mailto:techsupport@vaclaims-academy.com"
                        className="text-sm hover:underline"
                      >
                        techsupport@vaclaims-academy.com
                      </a>
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            <Link href="/terms-of-service" className="hover:underline">
              Terms
            </Link>{' '}
            ·{' '}
            <Link href="/acceptable-use-policy" className="hover:underline">
              Acceptable Use Policy
            </Link>{' '}
            ·{' '}
            <Link href="/refund-policy" className="hover:underline">
              Refund Policy
            </Link>{' '}
            ·{' '}
            <Link href="/privacy-policy" className="hover:underline">
              Privacy & Policy
            </Link>{' '}
            ·{' '}
            <Link href="/disclaimer" className="hover:underline">
              Disclaimer
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FaceBookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
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
      <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YouTubeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}
