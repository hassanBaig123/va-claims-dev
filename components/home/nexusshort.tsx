import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight,
  faFileCheck
} from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import IncludedWithGold from "@/components/home/includedwithgold";
import AngleElement from "@/components/angledesign";

const NexusShort: React.FC = () => {
  return (
    <section
      className="relative pt-48 xl:pt-64 pb-64 mb-32 "
      style={{
        backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stars_Screen_Size_Smaller_Filled_3_Pattern_Repeatable.png')`,
      }}
    >
      <AngleElement angleType="top-light-large" reverse={true} />
      <div className="container  z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-white leading-20 relative z-10">
          The Missing Link: Custom Nexus Letters
        </h1>
        <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-center text-navyYellow  mb-12">
          Ready to be signed by your doctor
        </h2>
        <div className="flex flex-col xl:flex-row items-center">
          <div className="flex-1 text-xl text-white px-4 md:px-16 mb-5  xl:mb-8">
            <p className="mb-4">
              In the complex world of VA claims, a strong Nexus letter can be
              the missing link between your condition and your military service.
              VA Claims Academy's Gold Advantage package equips you with
              custom-crafted Nexus letters designed to help you establish that
              crucial connection.
            </p>
            <p className="mb-4">
              Our expert team creates each Nexus letter from scratch, tailoring
              it to your unique story and incorporating the language and
              elements the VA needs to see. We reinforce your letter with
              peer-reviewed scientific evidence from our extensive database,
              when available, to provide a solid foundation for your claim.
            </p>
            <p className="mb-4">
              With Gold Advantage, you'll receive a fully written, comprehensive
              Nexus letter ready to be signed by your doctor. It's a powerful
              tool in your arsenal as you navigate the VA claim process and
              pursue the benefits you've earned.
            </p>
            <p className="">
              Take the next step in your journey with a custom-crafted Nexus
              letter - a vital asset in establishing service connection for your
              VA claim.
            </p>
          </div>

          <div className="flex-initial justify-center">
            <Image
              src="/imgs/people/doctor-signing.webp"
              alt="Doctor Signing Nexus Letter"
              width={500}
              height={300}
              className="rounded-lg shadow-lg ml-0 sm:ml-10"
            />
          </div>
        </div>
        <IncludedWithGold color="white" iconColor="green-700" />
      </div>
      <div className="w-full flex justify-center my-16 relative z-20">
        <Link href="/learn-more#pricing-section" legacyBehavior>
          <a className="cta-button text-xl sm:text-3xl flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
            Get My Nexus Letters
            <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
              <FontAwesomeIcon icon={faFileCheck} className="text-black w-9 h-9" />
            </span>
          </a>
        </Link>
      </div>
      <AngleElement angleType="bottom-light-large" />

    </section>
  );
};

export default NexusShort;
