import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldCheck, faFlaskGear } from "@fortawesome/pro-solid-svg-icons";
import { faTrophy } from "@fortawesome/pro-regular-svg-icons";
import AngleElement from "@/components/angledesign";

const ClearPathLong = () => {
  return (
    <div
        id="clearpath-long"
        className="w-full flex flex-col justify-center items-center text-center relative sm:pt-20 pb-40 my-24"
        style={{
            backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stripes_Screen_Size_Portrait_Filled_3_Pattern_repeatable.png')`,
        }}
    >
       <AngleElement angleType="top-light-large" reverse={false}/>
      
      <div className="mt-20 w-full z-10">
        <div className="flex flex-col items-center justify-center mb-16 relative">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-center align-bottom text-white leading-20">
            The VetVictory Claim Guide
          </h1>
          <h2 className="text-2xl sm:text-3xl mt-6 uppercase text-navyYellow">
            Grandmaster Exclusive
          </h2>
        </div>
      </div>

      <div className="container flex flex-wrap flex-col md:flex-row items-center justify-center text-white py-4 sm:py-8 z-10">
        <p className="text-xl sm:text-2xl mb-10 sm:px-5">
          Your Guiding Light in the VA Claims Journey: The VetVictory Claim Guide is the heart of your Gold Tier experience. This in-depth guide,
          carefully put together by our expert team and sent to you both
          digitally and in print, shines a light on the best path to success for
          your claim.
        </p>
        <div className="lg:w-1/2 p-8 mb-4 sm:mb-8 lg:mb-0 min-w-[380px] sm:min-w-[480px]">
          <Image
            src="/imgs/research_report/clearpathreport.png"
            alt="VetVictory Claim Guide"
            width={700}
            height={600}
          />
        </div>
        <div className="lg:w-6/12 px-3 sm:pl-10 text-white py-8">
            <div className="flex justify-center">
            
            <p className="text-xl sm:min-w-[500px] sm:px-5 sm:text-justify">
                Unmatched Detail and Customization: What makes the VetVictory Claim Guide
                stand out is how deep we dive into research that's
                all about you and your unique situation. This custom-made report
                includes:
            </p>
            </div>
          <ul className="list-none list-inside mb-6 text-xl pl-4 my-5 text-white py-4 sm:py-4">
            <li className="flex flex-col items-center mb-7 sm:mb-7 mt-10 sm:mt-0  text-left">
            <FontAwesomeIcon
                    icon={faFlaskGear}
                    className="text-green-500 mr-2 w-12 h-12 mb-5 sm:hidden"
                  />
              <h2 className="text-2xl text-center mb-5 sm:mb-5 text-navyYellow">
                Scientific Backup
              </h2>
              <div className="flex flex-col sm:flex-row">
                
                <div className="basis-2/12 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faFlaskGear}
                    className="text-green-500 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-12 sm:h-12 hidden sm:block"
                  />
                </div>
                <div className="basis-10/12">
                  <strong></strong> When it fits, we bring in findings from the
                  latest studies that show your condition is valid, giving you
                  more solid evidence for your claim.
                </div>
              </div>
            </li>
            <li className="flex flex-col items-center mb-3 sm:mb-5 mt-10 sm:mt-0 text-left">
            <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-green-500 mr-2 w-12 h-12 mb-5 sm:hidden"
                  />
              <h2 className="text-2xl text-center mb-5 sm:mb-5 text-navyYellow">
                Winning Strategies from Real Cases
              </h2>
              <div className="flex flex-col sm:flex-row">
                <div className="basis-2/12 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-green-500 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-12 sm:h-12 hidden sm:block"
                  />
                </div>
                <div className="basis-10/12">
                  <strong></strong> Learn from the success stories of claims
                  like yours. These real-life examples show you the strategies
                  that worked in situations similar to your own, giving you both
                  guidance and motivation.
                </div>
              </div>
            </li>
          </ul>
        </div>
        <p className="text-xl mb-6 sm:min-w-[500px] ">
          Your Step-by-Step Plan for Success: Every part of the VetVictory Claim Guide is made to bring out the best in your claim. With
          clear strategies, easy-to-follow steps, and deep insights, this
          document maps out a straightforward path through the VA claims
          process.
        </p>
        <p className="text-2xl text-red-600 font-semibold mb-6">
          Others Charge up to <span className="underline">$5600</span>{" "}
          for This.
        </p>
      </div>
      <div className="flex flex-col items-center text-center mt-10 sm:mt-10 text-white z-10">
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center text-center mb-4">
          <FontAwesomeIcon
            icon={faShieldCheck}
            className="text-green-700 sm:mr-2 w-16 h-16 mb-4 sm:my-0 sm:w-9 sm:h-9"
          />
          <h3 className="text-3xl font-semibold inline-flex items-center justify-center mb-4 sm:mb-0 px-6 sm:px-0 text-oxfordBlueNew">
            INCLUDED WITH GRANDMASTER PACKAGE
          </h3>
        </div>

        <p className="text-xl max-w-2xl px-5">
          Invest in Peace of Mind: Get access to the Grandmaster package and
          get the VetVictory Claim Guide in your corner. It's more than just
          facts and figures – it's a powerful asset that brings clarity,
          confidence, and peace of mind as you navigate your claim. With this
          game plan guiding you, you can go after the benefits you deserve,
          knowing you have the best support possible.
        </p>
      </div>

      <AngleElement angleType="bottom-light-large" reverse={false}/>

    </div>
    
  );
};

export default ClearPathLong;
