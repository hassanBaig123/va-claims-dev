import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCheck } from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { faUserUnlock } from "@fortawesome/pro-duotone-svg-icons";
import IncludedWithGold from "@/components/home/includedwithgold";
import AngleElement from "@/components/angledesign";

const PersonalStatementShort: React.FC = () => {
  return (
    <section
      className="relative pt-40 pb-48 mb-32 "
      style={{
        backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stripes_Screen_Size_Portrait_Filled_3_Pattern_repeatable.png')`,
      }}
    >
      <AngleElement angleType="top-light-large" />
      <div className="container relative z-10 mt-5">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-white leading-20 relative">
          Your Story, Told Right
        </h1>
        <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-center text-navyYellow  mb-12">
        Expertly Drafted Custom Personal Statement Templates
        </h2>
        <div className="flex flex-col-reverse xl:flex-row items-center">
          <div className="flex-initial justify-center">
            <Image
              src="/imgs/people/soldier_at_desk.jpeg"
              alt="Doctor Signing Nexus Letter"
              width={580}
              height={300}
              className="rounded-lg shadow-lg ml-0 sm:ml-10"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div className="flex-1 text-xl text-white px-4 md:px-16 mb-10 xl:mb-0">
            <p className="mb-4">
              At VA Claims Academy, we get it. Your experiences are unique, and
              your VA claim should reflect that. That's why our Gold Advantage
              package comes with a game-changer: custom-written personal
              statement templates.
            </p>
            <p className="mb-4">
              We take the time to understand your story inside and out. From
              your intake form to your discovery call, we dig deep to uncover
              the full picture of your service-connected conditions. Then, we
              combine this intimate knowledge with our expertise in 38 CFR to
              craft personal statement templates that speak directly to your
              situation.
            </p>
            <p className="mb-4">
              Our custom templates do more than just tell your story – they
              translate it into the language the VA needs to hear. We help you
              communicate your experiences and challenges in a way that gives
              you the best shot at success.
            </p>
            <p className="">
              With Gold Advantage, you're not just getting generic templates.
              You're getting a personalized tool kit to help you take control of
              your claim. Your voice, their language – it's a powerful
              combination.
            </p>
            <p className="">
              Ready to level up your VA claim? Choose Gold Advantage and unlock
              the power of custom personal statement templates – because your
              story deserves to be told right.
            </p>
          </div>
        </div>
        <IncludedWithGold color="white" iconColor="green-700" />
      </div>
      <div className="w-full flex justify-center mt-16 relative z-20">
        <Link href="/learn-more#pricing-section" legacyBehavior>
        <a className="cta-button text-xl sm:text-3xl flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
        Unlock My Custom Templates
          <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
            <FontAwesomeIcon icon={faUserUnlock} className="text-black w-9 h-9" />
          </span>
        </a>
      </Link>
      </div>

      {/* <div className="absolute bottom-1 left-0 w-full  z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="0.1" d="M0,160L1440,96L1440,320L0,320Z"></path></svg>
      </div>       */}
      
      <AngleElement angleType="bottom-light-large" />

    </section>
  );
};

export default PersonalStatementShort;
