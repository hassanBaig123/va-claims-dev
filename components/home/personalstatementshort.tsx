import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faUserUnlock } from "@fortawesome/pro-duotone-svg-icons";
import TimelineItem from "../ui/timeline";
import { faArrowRight, faShieldCheck } from "@fortawesome/pro-solid-svg-icons";
const PersonalStatementShort: React.FC = () => {
  const timelineData = [
    {
      title: "Understanding Your Story",
      text: 'Your experiences are unique, and your VA claim should reflect that. Thats why our Grandmaster package comes with a game-changer: custom-written personal statement templates',
    },
    {
      title: "Deep Dive into Your Experience",
      text: 'We take the time to understand your story inside and out. From your intake form to your discovery call, we dig deep to uncover the full picture of your service-connected conditions.',
    },
    {
      title: "Youre Story, Our Writing",
      text: 'Our custom templates do more than just tell your story – they translate it into the language the VA needs to hear. We help you communicate your experiences and challenges in a way that gives you the best shot at success.',
    },
    {
      title: "Personalized Tools",
      text: 'With Grandmaster, you’re not just getting generic templates. You’re getting a personalized tool kit to help you take control of your claim. Your voice, their language – it’s a powerful combination.',
    },
    {
      title: "Ready to Level Up Your VA Claim?",
      text: 'Ready to level up your VA claim? Choose Grandmaster and unlock the power of custom personal statement templates – because your story deserves to be told right.',
    },
  ];

  return (
    <section className="p-XXL">
      <div className="flex flex-col w-full gap-[10px]">
        <h1 className="w-full text-center text-crimsonNew text-4xl sm:text-5xl font-oswald font-bold">
          Your Story, Told Right
        </h1>
        <h2 className="w-full text-center text-platinum_950 text-[30px] font-oswald font-normal">
          Expertly Drafted Custom Personal Statement Drafts
        </h2>
      </div>

      <div className="my-[60px] relative">
        <div className="absolute inset-y-[70px] left-auto md:left-1/2 -ml-[2px] border-r-4 border-crimsonNew border-dotted h-[82%] block"></div>
        {timelineData.length > 0 && (
          <div className="flex flex-col">
            {timelineData.map((data, idx) => (
              <TimelineItem data={data} key={idx} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-XXL">
        <div className='flex flex-col-reverse gap-[20px] md:flex-row justify-center items-center text-center sm:my-8'>
          <FontAwesomeIcon
            icon={faShieldCheck}
            className="text-green-700 mb-4 sm:mb-0 sm:mr-2 w-16 h-16 sm:w-9 sm:h-9"
          />
          <h3 className='text-[20px] md:text-3xl font-semibold inline-flex items-center justify-center px-6 sm:px-0 text-oxfordBlueNew'>
            INCLUDED WITH GRANDMASTER PACKAGE
          </h3>
        </div>
      </div>

      <div className="flex justify-center items-center mt-L sm:mt-XXL">
      <Link
            href="/#pricing-section"
            className="cta-button text-xl sm:text-3xl relative z-20 flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_2px_#c3c3c3] hover:shadow-[0px_0px_0px_4px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded"
          >
            Get Instant Access 
            <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-black w-9 h-9"
              />
            </span>
          </Link>
      </div>
    </section>
  );
};

export default PersonalStatementShort;