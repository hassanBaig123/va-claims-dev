import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCheck } from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { faArrowRight, faShieldCheck } from "@fortawesome/pro-solid-svg-icons";

const NexusShort: React.FC = () => {
  return (
    <section className="py-XXL px-L sm:px-XXL bg-backgoundPlatinum">
      <div className="flex flex-col gap-[10px] text-center">
        <h1 className="text-crimsonNew text-4xl sm:text-5xl font-oswald font-bold">
          The Missing Link: Custom Nexus Letters
        </h1>
        <h2 className="text-platinum_950 text-[30px] font-oswald uppercase font-normal">
          Ready to be signed by your doctor
        </h2>
      </div>

      <div className="w-full flex justify-center items-center">

        <div className="flex flex-col lg:flex-row justify-center items-stretch mt-XXL gap-XXL w-full max-w-[1440px]">
          <div className="w-full lg:w-[35%] flex flex-col justify-center">
            <p className="mb-4 text-platinum_950 text-[18px] sm:text-[20px] font-normal font-opensans text-center sm:text-left">
              In the complex world of VA claims, a strong Nexus letter can be the missing link between your condition and your military service. VA Claims Academy's Grandmaster package equips you with custom-crafted Nexus letters designed to help you establish that crucial connection.
            </p>
            <p className="mb-4 text-platinum_950 text-[18px] sm:text-[20px] font-normal font-opensans text-center sm:text-left">
              Our expert team creates each Nexus letter from scratch, tailoring it to your unique story and incorporating the language and elements the VA needs to see. We reinforce your letters with peer-reviewed scientific evidence from our extensive database, when available, to provide a solid foundation for your claim.
            </p>            
          </div>
          <div className="w-full lg:w-[35%] flex justify-center items-center">
            <Image
              src="/imgs/people/ready_to_be_signed.jpg"
              alt="Doctor Signing Nexus Letter"
              width={1000}
              height={1000}
              className="rounded-lg h-full object-cover"
            />
          </div>
        </div>

      </div>

      <div className="flex flex-col items-center mt-XXL text-center">
        <div className='flex flex-col-reverse gap-[20px] md:flex-row justify-center items-center text-center my-8'>
          <FontAwesomeIcon
            icon={faShieldCheck}
            className="text-green-700 mb-4 sm:mb-0 sm:mr-2 w-16 h-16 sm:w-9 sm:h-9"
          />
          <h3 className='text-3xl font-semibold inline-flex items-center justify-center px-6 sm:px-0 text-oxfordBlueNew'>
            INCLUDED WITH GRANDMASTER PACKAGE
          </h3>
        </div>
        <Link
            href="#pricing-section"
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

export default NexusShort;
