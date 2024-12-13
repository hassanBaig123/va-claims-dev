import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark, faClockRotateLeft, faGraduationCap, faFileLines, faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import AngleElement from "@/components/angledesign";
import Link from 'next/link';

const WhatWeDontDoHome = () => {
  return (
    <div
      id="whatwedontdo"
      className="w-full flex flex-col justify-center items-center text-center relative sm:pt-4 pt-4 pb-20 sm:pb-40 mb-12 sm:mb-24"
      style={{
        background: 'linear-gradient(to bottom, #0A173B, #05091D)',
      }}
    >
      
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8 sm:mt-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-white font-lexendDeca leading-tight">
          Straight Talk: What We DO And DON'T Do
        </h2>
        <p className="text-lg sm:text-xl mb-8 sm:mb-16 text-frenchGray font-lexendDeca max-w-3xl mx-auto">
          To help you understand exactly what our packages include, here are some key points about what our service does NOT provide:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {[
            {
              icon: faUserXmark,
              title: "No One-on-One Coaching",
              description: "Our services include comprehensive training courses and resources, but they do not offer ongoing personal coaching or one-on-one consultation."
            },
            {
              icon: faClockRotateLeft,
              title: "Limited Direct Support",
              description: "While we provide initial guidance and resources to help you with your VA claim, our support does not include unlimited or 24/7 direct responses."
            },
            {
              icon: faGraduationCap,
              title: "Training, Not Representation",
              description: "Our platform is designed to educate and empower you through training modules and resources, and community. We do not represent clients in claims or legal matters."
            },
            {
              icon: faFileLines,
              title: "Resource-Based Assistance",
              description: "Our services are structured to provide you with the tools and knowledge to independently manage and understand your VA claims process."
            }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-lg shadow-custom">
              <FontAwesomeIcon icon={item.icon} className="text-3xl sm:text-4xl mb-4 text-crimsonNew" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-oxfordBlueNew font-lexendDeca">{item.title}</h3>
              <p className="text-md sm:text-sm text-gray-600 font-lexendDeca">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-16 p-6 sm:p-8 bg-white rounded-lg shadow-custom">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-oxfordBlueNew font-lexendDeca">
            Accredited Veteran Service Organizations are free and are able to directly assist with your claim.
          </h3>
          <p className="text-md sm:text-sm text-gray-600 font-lexendDeca">
            Veterans in need of hands-on assistance in filing their VA claim can also enlist the help of their local Veteran Service Organization (VSO), who are legally able to file claims on the veteran's behalf.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-center relative z-20 mt-8">
          <Link
            href="/#pricing-section2"
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


      <AngleElement angleType="bottom-light-large" reverse={false} />
    </div>
  );
};

export default WhatWeDontDoHome;