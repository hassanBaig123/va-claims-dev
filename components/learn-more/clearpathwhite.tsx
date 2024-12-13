import Image from 'next/image'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldCheck,
  faFlaskGear,
  faFileAlt,
  faArrowRight,
} from '@fortawesome/pro-solid-svg-icons'
import { faTrophy } from '@fortawesome/pro-regular-svg-icons'
import AngleElement from '@/components/angledesign'
import Link from 'next/link'

const ClearPathLongWhite = () => {
  return (
    <div
      id="clearpath-report"
      className="w-full flex flex-col justify-center items-center text-center relative  pb-10 bg-gradient-to-b from-white to-[#F0EDEE]"
    >
      <AngleElement angleType="top-light-simple" />
      <div className="w-full z-10">
        <div className="flex flex-col items-center justify-center my-10 relative">
          <h1 className="text-4xl sm:text-6xl font-black text-center text-crimson leading-20 mb-4">VetVictory</h1>
          <h1 className="text-3xl sm:text-5xl font-medium text-center text-oxfordBlue leading-20 mb-4">
             Custom Guide
          </h1>          
          <p className="text-red-700 text-3xl font-semibold">
            We apologize for the extremely limited availability.
          </p>        
        </div>
      </div>

      <div className="container flex flex-wrap flex-col md:flex-row items-center justify-center z-10 mb-8">
        
        <div className="lg:w-1/2 min-w-[380px] sm:min-w-[480px]">
          <Image
            src="/imgs/research_report/clearpathreport.png"
            alt="VetVictory Claim Guide"
            width={700}
            height={600}
          />
        </div>
        <div className="xl:w-1/2 px-3 sm:px-10">
          <p className="mb-4 text-gray-800 text-md lg:text-xl mt-5">
            <strong>Your best strategy, simplified</strong>. What would it mean
            to you to have a VA claim expert write you a step-by-step guide of
            what YOUR entire claim process looks like? VA Claims and peace of
            mind have never gone together... until now.
          </p>
          {/* <ul className="list-none list-inside mb-6 text-xl pl-4 sm:py-4">
            <li className="flex flex-col items-center mb-7 sm:mb-7 mt-10 sm:mt-0  text-left">
              <FontAwesomeIcon
                icon={faFileAlt}
                className="text-sky-900 mr-2 w-12 h-12 mb-5 sm:hidden"
              />

              <div className="flex flex-col sm:flex-row">
                <div className="basis-2/12 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-sky-900 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-12 sm:h-12 hidden sm:block"
                  />
                </div>
                <div className="basis-10/12 text-center sm:text-left">
                  <h2 className="w-full text-2xl text-crimson ">
                    Easy-to-Follow Steps
                  </h2>
                  <strong></strong> What makes this stand out is how deep we
                  dive into research that's all about you and your unique
                  situation.
                </div>
              </div>
            </li>
            <li className="flex flex-col items-center mb-7 sm:mb-7 mt-10 sm:mt-0  text-left">
              <FontAwesomeIcon
                icon={faFlaskGear}
                className="text-sky-900 mr-2 w-12 h-12 mb-5 sm:hidden"
              />

              <div className="flex flex-col sm:flex-row">
                <div className="basis-2/12 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faFlaskGear}
                    className="text-sky-900 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-12 sm:h-12 hidden sm:block"
                  />
                </div>
                <div className="basis-10/12 text-center sm:text-left">
                  <h2 className="text-2xl text-crimson">Scientific Backup</h2>
                  <strong></strong> When it fits, we bring in findings from the
                  latest studies that show your condition is valid, giving you
                  more solid evidence for your claim.
                </div>
              </div>
            </li>
            <li className="flex flex-col items-center mb-3 sm:mb-5 mt-10 sm:mt-0 text-left">
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-sky-900 mr-2 w-12 h-12 mb-5 sm:hidden"
              />

              <div className="flex flex-col sm:flex-row">
                <div className="basis-2/12 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-sky-900 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-12 sm:h-12 hidden sm:block"
                  />
                </div>
                <div className="basis-10/12 mb-8 text-center sm:text-left">
                  <h2 className="text-2xl text-crimson">
                    Winning Strategies from Real Cases
                  </h2>
                  <strong></strong> Learn from the success stories of claims
                  like yours. These real-life examples show you the strategies
                  that worked in situations similar to your own, giving you both
                  guidance and motivation.
                </div>
              </div>
            </li>
          </ul> */}
        </div>
      </div>
      <div className="w-full flex justify-center relative z-20">
        <Link
          href="/#otherscharge"
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
      <AngleElement angleType="bottom-light-simple" />
    </div>
  )
}

export default ClearPathLongWhite
