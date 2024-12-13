import React from "react";

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="flex flex-wrap items-center justify-between w-full p-10 abstract-background min-h-[25vh]">
        <div className="w-full">
          <h1 className="text-5xl font-bold text-white text-center">
            About Us
          </h1>
          
        </div>
        
      </section>
      
        <div className="flex flex-wrap w-full w-full max-w-7xl mx-auto mt-5 sm:mt-10">
            <img
            src="/imgs/flag-left-wood-logo.png"
            alt="Team VA Claims Academy"
            className="w-full sm:w-1/2 object-cover rounded-lg shadow-lg"
            />
            <section id="about-us" className="flex flex-col justify-center w-full sm:w-1/2 p-10">
                <p className="text-lg indent-10">
                    At VA Claims Academy, we're more than just a team; we're a family of veterans and advocates dedicated to empowering our fellow service members. Founded by Jordan Anderson, an Air Force veteran who navigated the labyrinth of VA claims to secure a 100% Permanent & Total rating, our mission is to demystify the VA claims process and help you achieve the benefits you rightfully deserve.
                </p>

                <p className="text-lg indent-10">
                    Our journey began from personal struggle and a desire to help others avoid the same pitfalls. Witnessing firsthand the challenges and frustrations that come with securing VA benefits, Jordan was inspired to create a platform that offers clear, actionable guidance. VA Claims Academy is the culmination of years of research, trial, and error, now refined into a streamlined course designed to fast-track your claim to success.
                </p>
                <p className="text-lg indent-10">
                    We believe in a world where veterans are fully recognized and compensated for their sacrifices. Our courses, resources, and community support are crafted to provide you with the knowledge and tools needed to navigate the VA system confidently. From personalized coaching calls to comprehensive video modules, we're here to guide you every step of the way.
                </p>
                <p className="text-lg indent-10">
                    Join us at VA Claims Academy, where we're turning the battle for benefits into a victory for veterans. Together, we can achieve the financial freedom and recognition you've earned through your service. Welcome to the family.
                </p>
            </section>
        </div>
    </div>
  );
}
