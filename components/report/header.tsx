import DisplayImages from '@/components/report/images'
import Head from 'next/head' // Import the Head component

export function DashboardHeader() {
  return (
    <>
      <Head>
        {/* Add the link to the Montserrat font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header className="print:hidden w-full bg-headerGradient text-platinum">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto bg-bgGradient my-4">
          <div>
            <a href="#">
              <DisplayImages
                imagePath="/images/VA_Claims_Main_Logo_Transparent_2_200px.png"
                altText="VA Claims Academy"
                width={100}
                height={84}
              />
            </a>
          </div>
          <div>
            <ul className="flex justify-between gap-x-10">
              <li className="transition-colors duration-200 hover:text-white">
                <a href="https://vaclaims-academy.com/" aria-current="page">
                  Home
                </a>
              </li>
              <li className="transition-colors duration-200 hover:text-white">
                <a href="https://vaclaims-academy.com/2023-va-disability-calculator/">
                  VA Disability Calculator
                </a>
              </li>
              <li className="transition-colors duration-200 hover:text-white">
                <a href="https://vaclaims-academy.com/my-courses/">
                  My Courses
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex gap-x-5 items-center">
              <li>SOCIAL</li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=100089616737514">
                  <DisplayImages
                    imagePath="https://vaclaims-academy.com/wp-content/uploads/2023/10/header-icon-01.svg"
                    altText=""
                    width={50}
                    height={50}
                  />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCbGqvI-XbGy1SSO2xAp4unw">
                  <DisplayImages
                    imagePath="https://vaclaims-academy.com/wp-content/uploads/2023/10/header-icon-02.svg"
                    altText=""
                    width={50}
                    height={50}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:hidden">
          <div>
            <ul className="mobile-menu-btn">
              <li>
                <a href="https://vaclaims-academy.com/" aria-current="page">
                  Home
                </a>
              </li>
              <li>
                <a href="https://vaclaims-academy.com/2023-va-disability-calculator/">
                  VA Disability Calculator
                </a>
              </li>

              <li>
                <a href="https://vaclaims-academy.com/my-courses/">
                  My Courses
                </a>
              </li>
            </ul>
          </div>
          <ul className="social">
            <li>SOCIAL</li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=100089616737514">
                <DisplayImages
                  imagePath="https://vaclaims-academy.com/wp-content/uploads/2023/10/header-icon-01.svg"
                  altText=""
                  width={50}
                  height={50}
                />
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCbGqvI-XbGy1SSO2xAp4unw">
                <DisplayImages
                  imagePath="https://vaclaims-academy.com/wp-content/uploads/2023/10/header-icon-02.svg"
                  altText=""
                  width={50}
                  height={50}
                />
              </a>
            </li>
          </ul>
          <div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke-width="0"></g>
              <g stroke-linecap="round" stroke-linejoin="round"></g>
              <g>
                <path
                  d="M4 18L20 18"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M4 12L20 12"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M4 6L20 6"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                ></path>
              </g>
            </svg>
          </div>
        </div>
      </header>
    </>
  )
}
