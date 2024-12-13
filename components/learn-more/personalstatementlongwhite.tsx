import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLanguage,
  faSearch,
  faUserEdit,
  faRoad,
  faArrowsToCircle,
  faArrowRight,
  faFileCheck,
  faShieldCheck,
} from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { faUserUnlock } from "@fortawesome/pro-duotone-svg-icons";
import AngleElement from "@/components/angledesign";
import InfoCardItems from "@/components/infocarditems";
import IncludedWithGold from "@/components/home/includedwithgold";

interface InfoCardItem {
  heading: string;
  iconName:
    | typeof faLanguage
    | typeof faSearch
    | typeof faUserEdit
    | typeof faRoad;
  descriptions: string[];
}

const cardItems: InfoCardItem[] = [
  {
    heading: "Translating Your Truth",
    descriptions: [
      "Our custom templates serve as a bridge, helping you translate your experiences and challenges into the language the VA understands and respects. We ensure that your voice is heard loud and clear, while presenting your case in a manner that optimizes your chances of success.",
    ],
    iconName: faLanguage, // Assuming a language icon represents translation
  },
  {
    heading: "Uncovering Hidden Potential",
    descriptions: [
      "During our in-depth discovery process, we often uncover service-connected conditions that many veterans were unaware they could claim. Our custom statement templates help you illuminate these hidden conditions, maximizing your potential for a fair and favorable outcome.",
    ],
    iconName: faSearch, // Assuming a search icon represents uncovering or discovery
  },
  {
    heading: "The Power of Personalization",
    descriptions: [
      "Unlike the generic, pre-written templates provided in our Silver and Bronze packages, our Gold Advantage custom statements are crafted specifically for you. This personalized approach can make all the difference in the strength and impact of your VA claim.",
    ],
    iconName: faUserEdit, // Assuming an edit icon represents customization or personalization
  },
  {
    heading: "Empowering Your Journey",
    descriptions: [
      "With VA Claims Academy's custom-written personal statement templates, you'll be empowered to take control of your claim journey. You'll have the tools and language needed to effectively communicate your story to the VA, increasing your chances of receiving the benefits you deserve.",
    ],
    iconName: faRoad, // Assuming a road icon represents a journey
  },
];

const PersonalStatementLongWhite: React.FC = () => {
  return (
    <section className="relative pb-20 sm:pb-48 mb-32  w-full bg-gradient-to-b from-white to-[#F0EDEE]">
      <AngleElement angleType="top-light-simple" reverse={false} />
      <div className="container relative z-10 mt-5 pb-6 sm:pb-32">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom  leading-20 relative">
          Your Voice, Their Language
        </h1>
        <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-center text-crimson  mb-12">
          Unlock the Power of Custom Personal Statement Templates
        </h2>
        <div className="mb-6 sm:mb-20">
          <p className="text-lg  md:px-32">
            At VA Claims Academy, we understand that your story is unique, and
            your personal statement should reflect that. That's why we've
            developed a game-changing feature for our Gold Advantage members:
            custom-written personal statement templates.
          </p>
        </div>
        <div className="flex flex-col-reverse xl:flex-row items-center gap-10 mb-6 sm:mb-20">
          <div className="flex-initial justify-center">
            <Image
              src="/imgs/people/soldier_signing_document.jpeg"
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
          <div className="flex-1 text-lg  sm:px-4 md:px-16 py-10 relative">
            <p className="mb-4">
              Our expert team dives deep into your specific circumstances,
              gathering crucial information from your intake form and discovery
              call to uncover the full extent of your service-connected
              conditions. We then combine this intimate understanding of your
              story with our unparalleled knowledge of 38 CFR to create personal
              statement templates that are tailored to your unique situation.
            </p>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row items-center gap-10 sm:mb-20">
          <div className="flex-1 justify-center items-center text-xl  min-w-[415px] px-4 md:px-16 py-10 mb-3 sm:mb-10 xl:mb-0 relative ">
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faFileCheck}
                className="w-16 h-16 m-6 text-sky-900"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-crimson mb-6">
              Translating Your Truth
            </h2>            
            <p className="relative mb-4 mt-10 text-lg text-center sm:text-left z-20">
              Our custom templates serve as a bridge, helping you translate your
              experiences and challenges into the language the VA understands
              and respects. We ensure that your voice is heard loud and clear,
              while presenting your case in a manner that optimizes your chances
              of success.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/imgs/people/soldier-reading.png"
              alt="Soldier Reading Nexus Letter"
              width={580}
              height={300}
              className="rounded-lg shadow-lg ml-0 sm:ml-10"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse xl:flex-row items-center gap-10 sm:mb-20">
          <div className="flex justify-center">
            <Image
              src="/imgs/people/female-soldier-cropped.png"
              alt="Soldier"
              width={580}
              height={300}
              className="rounded-lg shadow-lg ml-0 sm:ml-10"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div className="flex-1 justify-center items-center text-xl  px-4 md:px-16 py-10 sm:mb-10 xl:mb-0 relative">
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faSearch}
                className="w-16 h-16 m-6 text-sky-900"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-crimson mb-6">
              Uncovering Hidden Potential
            </h2>
            <p className="mb-4 text-lg text-center sm:text-left">
              During our in-depth discovery process, we often uncover
              service-connected conditions that many veterans were unaware they
              could claim. Our custom statement templates help you illuminate
              these hidden conditions, maximizing your potential for a fair and
              favorable outcome.
            </p>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row items-center gap-10 sm:mb-20">
          <div className="flex-1 justify-center items-center text-xl  px-4 md:px-16 py-10 sm:mb-10 xl:mb-0 relative">
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faUserEdit}
                className="w-16 h-16 m-6 text-sky-900"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-crimson mb-6">
              The Power of Personalization
            </h2>
            <p className="mb-4 text-lg text-center sm:text-left">
              Unlike the generic, pre-written templates provided in our Silver
              and Bronze packages, our Gold Advantage custom statements are
              crafted specifically for you. This personalized approach can make
              all the difference in the strength and impact of your VA claim.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/imgs/people/handing_document.jpeg"
              alt="Soldier Reading Nexus Letter"
              width={580}
              height={300}
              className="rounded-lg shadow-lg ml-0 sm:ml-10"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse xl:flex-row items-center gap-10">
          <div className="flex justify-center">
            <Image
              src="/imgs/people/handshake-flag-2.jpeg"
              alt="Soldier Reading Nexus Letter"
              width={580}
              height={300}
              className="rounded-lg shadow-lg ml-0 sm:ml-10"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <div className="flex-1 justify-center items-center text-xl  px-4 md:px-16 py-10 sm:mb-10 xl:mb-0 relative">
            {/* <AngleElement angleType="top-dark-small" reverse={false} /> */}
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faRoad}
                className="w-16 h-16 m-6 text-sky-900"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-crimson mb-6">
              Empowering Your Journey
            </h2>
            <p className="mb-4 text-lg">
              With VA Claims Academy's custom-written personal statement
              templates, you'll be empowered to take control of your claim
              journey. You'll have the tools and language needed to effectively
              communicate your story to the VA, increasing your chances of
              receiving the benefits you deserve.
            </p>
            {/* <AngleElement angleType="bottom-dark-small" reverse={false} /> */}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center relative mb-20 z-20 text-2xl ">
        <p className="w-full lg:w-1/2 p-6 text-center sm:text-left">
          Don't settle for a blanket approach to your VA claim. Get access to{" "}
          <span className="font-bold">Gold Advantage</span> today and unlock the
          power of personalized personal statement templates – your voice, their
          language, your peace of mind.
        </p>
      </div>

     
      <IncludedWithGold color="oxfordBlue" iconColor="green-700" />
      <div className="w-full flex justify-center relative z-20">
        <Link href="/learn-more#pricing-section" legacyBehavior>
          <a className="cta-button text-xl sm:text-3xl flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
            Unlock My Custom Templates
            <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-black w-9 h-9"
              />
            </span>
          </a>
        </Link>
      </div>

      <AngleElement angleType="bottom-light-simple" reverse={false} />
    </section>
  );
};

export default PersonalStatementLongWhite;
