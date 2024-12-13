import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCheck,
  faSliders,
  faFlaskGear,
  faListCheck,
  faFileCertificate,
} from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import AngleElement from "@/components/angledesign";
import IncludedWithGold from "../home/includedwithgold";

interface NexusDescriptionsProps {
  title: string;
  description: string;
  icon: typeof faFlaskGear | typeof faSliders | typeof faListCheck;
}

const iconMapping = {
  faFlaskGear: faFlaskGear,
  faSliders: faSliders,
  faListCheck: faListCheck,
};

const nexusDescriptions: NexusDescriptionsProps[] = [
  {
    title: "Backed by Science",
    description:
      "To bolster the strength of your Nexus letter, we dive deep into our extensive database of peer-reviewed scientific studies and literature. When available, we incorporate this supporting evidence directly into your letter, providing a solid foundation for your claim.",
    icon: faFlaskGear,
  },
  {
    title: "Tailored to Your Story",
    description:
      "Just like our custom personal statement templates, your Nexus letter is written with your specific circumstances in mind. We take the time to understand your unique case and craft a letter that speaks directly to your situation, maximizing its impact and relevance.",
    icon: faSliders,
  },
  {
    title: "Comprehensive Thorough",
    description:
      "Our Grandmaster Nexus letters are fully written and ready to be signed by your doctor. We handle all the heavy lifting, ensuring that your letter contains all the necessary components and language to give your claim the best possible chance of success.",
    icon: faListCheck,
  },
];

const NexusLong: React.FC = () => {
  return (
    <>
      <section
        className="w-full bg-[#161616] bg-no-repeat bg-cover mb-32 relative dark-after py-48"
        style={{ backgroundImage: "url('/imgs/flag-close.jpeg')" }}
      >
        <AngleElement angleType="top-light-large" reverse={false}/>
        <div className="z-20 relative">
          <div className="flex flex-col items-center justify-center mb-16 relative ">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-white leading-20">
              Strengthen Your Claim with Custom-Crafted Nexus Letters
            </h1>
            <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-navyYellow">
              Ready to be signed by your doctor
            </h2>
          </div>
          <div className="container  px-4 flex flex-col gap-10 lg:flex-row items-center justify-center text-white mb-20">
            <Image
              src="/imgs/nexus-mock-up.png"
              alt="Nexus Letters"
              width={530}
              height={450}
              layout="responsive"
              className="max-w-xs md:max-w-sm lg:max-w-md" // Adjust these values as needed for different breakpoints
            />
            <div className="basis-9/12 p-10 py-20 bg-[#0a173b] bg-opacity-70 relative">
              <AngleElement angleType="top-light-small" />             

              <p className="text-lg sm:text-lg pb-8">
                When it comes to proving service connection in your VA claim, a
                well-written Nexus letter can be a game-changer. That's why VA
                Claims Academy's Grandmaster package includes custom-crafted
                Nexus letters tailored to your unique situation.
              </p>
              <p className="text-lg sm:text-lg pb-4">
                Our expert team understands the critical role Nexus letters play
                in the VA claim process. We meticulously craft each letter to
                include the key language and elements the VA is looking for,
                giving you a powerful tool to help establish the vital link
                between your condition and your military service.
              </p>
              <AngleElement angleType="bottom-light-small"/>
              
            </div>
          </div>

          <div className="container mx-auto px-4 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative  z-10">
              {nexusDescriptions.map((nexusDescription, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center py-10 p-6 bg-oxfordBlue bg-opacity-70 relative"
                >
                  <div className="absolute top-0 left-0 w-full z-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1440 320"
                    >
                      <path
                        fill="#fff"
                        fill-opacity="0.3"
                        d="M0,10L1440,50L1440,0L0,0Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-blue-400 mb-4">
                    <FontAwesomeIcon
                      icon={nexusDescription.icon}
                      className="w-12 h-12"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-navyYellow">
                    {nexusDescription.title}
                  </h3>
                  <p className="text-lg text-white">
                    {nexusDescription.description}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full z-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1440 320"
                    >
                      <path
                        fill="#fff"
                        fill-opacity="0.3"
                        d="M0,276L1440,320L1440,320L0,320Z"
                      ></path>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="container py-24 px-4 flex flex-col justify-center items-center gap-10 text-white w-full bg-oxfordBlue bg-opacity-70 relative z-20">
            <AngleElement angleType="top-light-small" reverse={true}/>
            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
              <div className="flex justify-center items-center text-blue-400 md:basis-4/12 text-center">
                <Image
                  src="/imgs/people/handshake-clipboard.jpeg"
                  alt="Nexus Letters"
                  width={530}
                  height={450}
                  className="md:max-w-sm lg:max-w-md" // Adjust these values as needed for different breakpoints
                />
                </div>
              <div className="flex flex-col gap-10 justify-center items-center basis-7/12 relative z-20">
                <p className="text-lg">
                  While no one can guarantee a win, our custom-crafted Nexus
                  letters are designed to be a powerful asset in your VA claim
                  journey. They demonstrate our commitment to providing you with
                  the tools and support you need to effectively navigate the
                  process and pursue the benefits you deserve.
                </p>

                <p className="text-lg">
                  Get access to Grandmaster today and arm yourself with a
                  custom-crafted Nexus letter – a key piece of the puzzle in
                  establishing service connection for your VA claim.
                </p>
              </div>
            </div>
            <IncludedWithGold />

            <div className="w-full flex justify-center relative pb-8 z-20">
              <Link
                href="#pricing-section"
                className="cta-button text-xl sm:text-3xl relative z-20 flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded"
              >
                Get My Custom Nexus Letters
                <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
                  <FontAwesomeIcon
                    icon={faFileCheck}
                    className="text-black w-9 h-9"
                  />
                </span>
              </Link>
            </div>
            <AngleElement angleType="bottom-light-small" reverse={true}/>
          </div>
        </div>

        <AngleElement angleType="bottom-light-large" />
      </section>
    </>
  );
};

export default NexusLong;
