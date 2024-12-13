import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVideoCamera,
  faChartLine,
  faUserTie,
  faMobileScreen,
  faBullseye,
} from '@fortawesome/pro-solid-svg-icons'
import Image from 'next/image'
import AngleElement from '../angledesign'

const IntroductionSection: React.FC = () => {
  const features = [
    {
      icon: faVideoCamera,
      title: "Unlock The VA's Playbook",
      description: '',
    },
    {
      icon: faChartLine,
      title: 'Master Your Claim Easily',
      description: '',
    },
    {
      icon: faUserTie,
      title: 'Max Out Your Rating',
      description: '',
    },
  ]

  return (
    <section className="w-full bg-white mb-10 sm:mb-16">
      <div className="relative w-full text-center mb-10  bg-[#F3F4F6] py-6 pb-28">
        <p className="text-xl sm:text-3xl text-crimson font-lexendDeca font-semibold mb-4">
          VA Claims have never been easy...
        </p>
        <p className="text-4xl sm:text-5xl text-oxfordBlueNew font-lexendDeca font-bold">
          Until now.
        </p>
        <AngleElement angleType="bottom-light-simple" fillColor="#FFF" />
      </div>
      <div className="max-w-6xl mx-auto px-L sm:px-XXL ">
      <h1 className="text-4xl sm:text-[4.1rem] text-black text-center font-lexendDeca font-bold mb-[3rem]">
          Introducing
        </h1>
        <div className="flex justify-center mb-[1.6rem]">
          <Image
            src="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png"            
            alt="VA Claims Academy Logo"
            width={640}
            height={0}
            className="w-[320px] sm:w-[640px]"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl text-crimsonNew text-center font-lexendDeca font-semibold mb-6">
          The Gold Standard in VA Claim Success
        </h2>

        <div
          id="now-serving-container"
          className="flex sm:flex-row flex-wrap justify-center items-center gap-[10px] w-full mb-[3.5rem]"
        >
          {/* Visible on smaller screens */}

          {/* <span className="flex items-center justify-center gap-[10px]">
            <Image
              src={'/icons/VA_check_icon.svg'}
              alt={'check icon'}
              height={24}
              width={22}
            />
            <span className="text-wrap sm:text-nowrap text-lg font-medium text-platinum_950">
              Active Duty
            </span>
          </span>

          <span className="flex items-center justify-center gap-[10px]">
            <Image
              src={'/icons/VA_check_icon.svg'}
              alt={'check icon'}
              height={24}
              width={22}
            />
            <span className="text-wrap sm:text-nowrap text-lg font-medium text-platinum_950">
              Veterans
            </span>
          </span>

          <span className="flex items-center justify-center gap-[10px]">
            <Image
              src={'/icons/VA_check_icon.svg'}
              alt={'check icon'}
              height={24}
              width={22}
            />
            <span className="text-wrap sm:text-nowrap text-lg font-medium text-platinum_950">
              Guard & Reservists
            </span>
          </span> */}
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center relative">
          <Image
            src="/imgs/course-mockup.png"
            alt="VA Claims Teaching"
            width={1200}
            height={800}
            className="w-full h-auto"
          />

          {/* <div className="flex justify-center lg:w-1/2">
            <ul className="flex flex-col min-h-[288px] justify-around space-y-2">
              {' '}
              {/* Add bottom margin */}
          {/* {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10flex items-center justify-center mr-4">
                    <Image
                      src={'/icons/VA_check_icon.svg'}
                      alt={'check icon'}
                      height={54}
                      width={52}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-oxfordBlueNew font-lexendDeca">
                      {feature.title}
                    </h3> */}
          {/* <p className="text-platinum_950 text-sm font-light font-lexendDeca">
                      {feature.description}
                    </p> */}
          {/* </div>
                </li>
              ))}
            </ul>
          </div> */}
          {/* <div className="absolute bottom-0 right-0 lg:w-1/2 text-left">
            <p className="text-xl font-semibold text-oxfordBlueNew font-lexendDeca">
              The ultimate step-by-step online video course.
            </p>
          </div> */}
        </div>
        <div className="w-full flex justify-center mt-20">
          <p className="text-2xl sm:text-3xl text-center font-semibold text-oxfordBlueNew font-lexendDeca">
            The ultimate step-by-step online video course.
          </p>
        </div>
      </div>
    </section>
  )
}

export default IntroductionSection
