import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLanguage,
  faSearch,
  faUserEdit,
  faRoad,
  faArrowsToCircle,
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
      "Unlike the generic, pre-written templates provided in our Master and Expert packages, our Grandmaster custom statements are crafted specifically for you. This personalized approach can make all the difference in the strength and impact of your VA claim.",
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

const PersonalStatementLong: React.FC = () => {
  return (
    <section
      className="relative pt-40 pb-48 mb-32  w-full medium-dark-after"
      style={{
        backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stars_Screen_Size_Smaller_Filled_3_Pattern_Repeatable.png')`,
      }}
    >
      <AngleElement angleType="top-light-large" reverse={false} />
      <div className="container relative z-10 mt-5 pb-32">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-white leading-20 relative">
          Your Voice, Their Language
        </h1>
        <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-center text-navyYellow  mb-12">
          Unlock the Power of Custom Personal Statement Templates
        </h2>
        <div className="mb-20">
          <p className="text-lg text-white md:px-32">
            At VA Claims Academy, we understand that your story is unique, and
            your personal statement should reflect that. That's why we've
            developed a game-changing feature for our Grandmaster members:
            custom-written personal statement templates.
          </p>
        </div>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 mb-20">
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
          <div className="flex-1 text-lg text-white px-4 md:px-16 py-10 bg-black bg-opacity-25 relative">
            <AngleElement angleType="top-light-small" reverse={false} />
            <p className="mb-4">
              Our expert team dives deep into your specific circumstances,
              gathering crucial information from your intake form and discovery
              call to uncover the full extent of your service-connected
              conditions. We then combine this intimate understanding of your
              story with our unparalleled knowledge of 38 CFR to create personal
              statement templates that are tailored to your unique situation.
            </p>
            <AngleElement angleType="bottom-light-small" reverse={false} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-20">
          <div className="flex-1 justify-center items-center text-xl text-white min-w-[415px] px-4 md:px-16 py-10 mb-10 xl:mb-0 relative bg-cover bg-black bg-opacity-25"
            
          >
            
            <AngleElement angleType="top-light-small" reverse={false} />
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faArrowsToCircle}
                className="w-16 h-16 m-6 text-blue-400"
              />
            </div> 
            <h2 className="text-3xl font-bold text-center text-navyYellow mb-6">
              Translating Your Truth
            </h2>
           
            {/* <div className="flex items-center justify-center mb-5 bg-crimson p-4 px-6 absolute -top-5 z-20 card-shadow">
                <div className="w-[50px] h-[15px] bg-oxfordBlue absolute -left-[5px] -bottom-[10px]"></div>
                <h2 className="text-3xl font-bold text-center text-white">
                Translating Your Truth
                </h2>
                <div className="w-[50px] h-[15px] bg-platinum absolute -right-[5px] -top-[10px]"></div>   
            </div> */}
            <p className="relative mb-4 mt-10 text-lg text-white z-20">
            Our custom templates serve as a bridge, helping you translate your
            experiences and challenges into the language the VA understands
            and respects. We ensure that your voice is heard loud and clear,
            while presenting your case in a manner that optimizes your chances
            of success.
            </p>
            <AngleElement angleType="bottom-light-small" reverse={false} />
          </div>
          <div className="flex-initial justify-center">
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
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 mb-20">
          <div className="flex-initial justify-center">
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
          <div className="flex-1 justify-center items-center text-xl text-white px-4 md:px-16 py-10 mb-10 xl:mb-0 bg-black bg-opacity-25 relative">
            <AngleElement angleType="top-light-small" reverse={false} />
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faSearch}
                className="w-16 h-16 m-6 text-blue-400"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-navyYellow mb-6">
              Uncovering Hidden Potential
            </h2>
            <p className="mb-4 text-lg">
              During our in-depth discovery process, we often uncover
              service-connected conditions that many veterans were unaware they
              could claim. Our custom statement templates help you illuminate
              these hidden conditions, maximizing your potential for a fair and
              favorable outcome.
            </p>
            <AngleElement angleType="bottom-light-small" reverse={false} />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row items-center gap-10 mb-20">
          <div className="flex-1 justify-center items-center text-xl text-white px-4 md:px-16 py-10 mb-10 xl:mb-0 bg-black bg-opacity-25 relative">
            <AngleElement angleType="top-light-small" reverse={false} />
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faUserEdit}
                className="w-16 h-16 m-6 text-blue-400"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-navyYellow mb-6">
              The Power of Personalization
            </h2>
            <p className="mb-4 text-lg">
              Unlike the generic, pre-written templates provided in our Master
              and Expert packages, our Grandmaster custom statements are
              crafted specifically for you. This personalized approach can make
              all the difference in the strength and impact of your VA claim.
            </p>
            <AngleElement angleType="bottom-light-small" reverse={false} />
          </div>
          <div className="flex-initial justify-center">
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
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
          <div className="flex-initial justify-center">
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
          <div className="flex-1 justify-center items-center text-xl text-white px-4 md:px-16 py-10 mb-10 xl:mb-0 bg-black bg-opacity-25 relative">
            <AngleElement angleType="top-light-small" reverse={false} />
            <div className="flex justify-center items-center w-full">
              <FontAwesomeIcon
                icon={faRoad}
                className="w-16 h-16 m-6 text-blue-400"
              />
            </div>
            <h2 className="text-3xl font-bold text-center text-navyYellow mb-6">
              Empowering Your Journey
            </h2>
            <p className="mb-4 text-lg">
              With VA Claims Academy's custom-written personal statement
              templates, you'll be empowered to take control of your claim
              journey. You'll have the tools and language needed to effectively
              communicate your story to the VA, increasing your chances of
              receiving the benefits you deserve.
            </p>
            <AngleElement angleType="bottom-light-small" reverse={false} />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center relative mb-20 z-20 text-2xl text-white">
        <p className="w-full lg:w-1/2 p-6">Don't settle for a blanket approach to your VA claim. Get access to <span className="text-navyYellow">Grandmaster</span> today and unlock the power of personalized personal statement templates – your voice, their language, your peace of mind.</p>
      </div>


      {/* <div className="flex flex-col sm:flex-row items-center gap-10 bg-white w-full relative min-h-48 z-20">
        <div className="container">
          <div className="">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-crimson mt-10 mb-10">
              Translating Your Truth
            </h2>
          </div>
          <div>
            <p className="text-lg text-[#424242] md:px-32 ">
              Our custom templates serve as a bridge, helping you translate your
              experiences and challenges into the language the VA understands
              and respects. We ensure that your voice is heard loud and clear,
              while presenting your case in a manner that optimizes your chances
              of success.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
            {cardItems.map((item, index) => (
                <div key={index} className="flex flex-col justify-center items-center gap-4 p-4 bg-white">
                    <FontAwesomeIcon icon={item.iconName} className="w-12 h-12 text-navyYellow" />
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4">{item.heading}</h2>
                        {item.descriptions.map((desc, descIndex) => (
                        <p key={descIndex} className="text-base">{desc}</p>
                        ))}
                    </div>
                </div>
            ))}
            </div>            
      </div> */}
      <IncludedWithGold />
      <div className="w-full flex justify-center relative z-20">
        <Link href="#pricing-section" legacyBehavior>
          <a className="cta-button text-xl sm:text-3xl flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
            Unlock My Custom Templates
            <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
              <FontAwesomeIcon
                icon={faUserUnlock}
                className="text-black w-9 h-9"
              />
            </span>
          </a>
        </Link>
      </div>

      <AngleElement angleType="bottom-light-large" reverse={false} />
    </section>
  );
};

export default PersonalStatementLong;
