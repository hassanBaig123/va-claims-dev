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
import TimelineWithIcons from "@/components/learn-more/timelineWithIcons";

const timelineData = [
  {
    title: "Translating Your Truth",
    text: [
      "Our custom templates serve as a bridge, helping you translate your experiences and challenges into the language the VA understands and respects. We ensure that your voice is heard loud and clear, while presenting your case in a manner that optimizes your chances of success.",
    ],
    iconName: faLanguage, // Assuming a language icon represents translation
  },
  {
    title: "Uncovering Hidden Potential",
    text: [
      "During our in-depth discovery process, we often uncover service-connected conditions that many veterans were unaware they could claim. Our custom statement templates help you illuminate these hidden conditions, maximizing your potential for a fair and favorable outcome.",
    ],
    iconName: faSearch, // Assuming a search icon represents uncovering or discovery
  },
  {
    title: "The Power of Personalization",
    text: [
      "Unlike the generic, pre-written templates provided in our Master and Expert packages, our Grandmaster custom statements are crafted specifically for you. This personalized approach can make all the difference in the strength and impact of your VA claim.",
    ],
    iconName: faUserEdit, // Assuming an edit icon represents customization or personalization
  },
  {
    title: "Empowering Your Journey",
    text: [
      "With VA Claims Academy's custom-written personal statement templates, you'll be empowered to take control of your claim journey. You'll have the tools and language needed to effectively communicate your story to the VA, increasing your chances of receiving the benefits you deserve.",
    ],
    iconName: faRoad, // Assuming a road icon represents a journey
  },
];

const PersonalStatementLongWhite: React.FC = () => {
  return (
    <section className="relative pb-20 sm:pb-48 mb-6 sm:mb-32  w-full bg-gradient-to-b from-white to-[#F0EDEE]">
      <AngleElement angleType="top-light-simple" reverse={false} />
      <div className="container relative z-10 mt-5 pb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom  leading-20 relative">
          Your Voice, Their Language
        </h1>
        <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-center text-crimson  mb-12">
          Unlock the Power of Custom Personal Statement Drafts
        </h2>
        <div className="mb-6 sm:mb-20">
          <p className="text-lg  md:px-32">
            At VA Claims Academy, we understand that your story is unique, and
            your personal statement should reflect that. That's why we've
            developed a game-changing feature for our Grandmaster members:
            custom-written personal statement drafts.
          </p>
        </div>
        <div className="mt-[60px] relative">
          <div className="absolute inset-y-[70px] left-auto md:left-1/2 -ml-[2px] border-r-4 border-crimsonNew border-dotted h-[82%] block"></div>
          {timelineData.length > 0 && (
            <div className="flex flex-col">
              {timelineData.map((data, idx) => (
                <TimelineWithIcons data={data} key={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center relative mb-20 z-20 text-2xl ">
        <p className="w-full lg:w-1/2 p-6 text-center text-align-center sm:text-left">
          Don't settle for a blanket approach to your VA claim. Get access to{" "}
          <span className="font-bold">Grandmaster</span> today and unlock the
          power of personalized personal statement drafts – your voice, their
          language, your peace of mind.
        </p>
      </div>

      <IncludedWithGold color="oxfordBlue" iconColor="green-700" />
      <div className="w-full flex justify-center relative z-20">
        <Link href="#pricing-section" legacyBehavior>
          <a className="cta-button text-xl sm:text-3xl flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
            Get Instant Access 
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
