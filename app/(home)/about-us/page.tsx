import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center mb-16 mt-16">
          <div className="w-full lg:w-1/2 lg:pl-12">
            <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
            <p className="text-lg mb-6">
            <Image
              src="/imgs/Logo/RGB/PNG/960px (medium size)/Logo Icon/Transparent Background/VA_Claims_Logo_Icon_3_Transparent_1_960px.png"
              alt="VA Claims Logo"
              className="float-left mr-4 mb-4"
              priority={true}
              width={100}
              height={100}
            />
              At VA Claims Academy, we're more than just a team; we're a family
              of veterans and advocates dedicated to empowering our fellow
              service members. Founded by Jordan Anderson, an Air Force veteran
              who navigated the labyrinth of VA claims to secure a 100%
              Permanent & Total rating, our mission is to demystify the VA
              claims process and help you achieve the benefits you rightfully
              deserve.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 text-xl italic mb-6">
              "Our journey began from personal struggle and a desire to help
              others avoid the same pitfalls. Witnessing firsthand the
              challenges and frustrations that come with securing VA benefits,
              Jordan was inspired to create a platform that offers clear,
              actionable guidance."
            </blockquote>
            <p className="text-lg mb-6">
              VA Claims Academy is the culmination of years of research, trial,
              and error, now refined into a streamlined course designed to
              fast-track your claim to success.
            </p>
            <p className="text-lg">
              We believe in a world where veterans are fully recognized and
              compensated for their sacrifices. Our courses, resources, and
              community support are crafted to provide you with the knowledge
              and tools needed to navigate the VA system confidently. From
              personalized coaching calls to comprehensive video modules, we're
              here to guide you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
