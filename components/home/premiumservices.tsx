import { JSX, SVGProps } from "react"
import Image from 'next/image';

export default function PremiumServices() {
    return (
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <Image
            src="/imgs/placeholder.svg"
            alt="Premium Services"
            width={380}
            height={280}
            className="w-full lg:w-1/3 h-auto rounded-lg shadow-lg"
            style={{
              objectFit: "cover",
            }}
          />
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">Premium Services</h2>
            <p className="">
              Experience our exclusive onboarding assessment and discovery call, tailored to your individual needs. Our
              curated training program includes a comprehensive personal statement writing course designed for success.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ClipboardListIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Assessment & Discovery Call</h3>
              </div>
              <p className="text-gray-500">
                Begin your journey with a personalized assessment to align your goals with our services. Engage in a one-on-one discussion to uncover your unique training needs and objectives.
              </p>
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Curated Training Program</h3>
              </div>
              <p className="text-gray-500">
                Receive a customized training plan, including our acclaimed personal statement writing course.
              </p>
            <div className="flex items-center space-x-2">
                <PhoneIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Personal Statement Writing Course</h3>
            </div>
            <p className="text-gray-500">
                Learn how to write a compelling personal statement that will capture your true story while meeting the requirements of the VA.
            </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  function BookOpenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  }
  
  
  function ClipboardListIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </svg>
    )
  }
  
  
  function PhoneIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  }
  