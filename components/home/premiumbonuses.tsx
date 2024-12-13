import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlassChart,
  faFileSignature,
  faMapSigns,
} from '@fortawesome/pro-regular-svg-icons'
import { faCrown } from '@fortawesome/pro-solid-svg-icons'

interface BonusProps {
  title: string
  subtitle: string
  extraText?: string
  description: string
  icon: typeof faMagnifyingGlassChart
}

const bonusData: BonusProps[] = [
  {
    title: 'Uncover Every Detail',
    subtitle: '30-Minute Discovery Call with a Specialist',
    description:
      "In a focused 30-minute session with one of our discovery specialists, we'll delve into how your conditions impact your life and explore how they were caused by your service. Every detail matters when building a strong VA claim.",
    icon: faMagnifyingGlassChart,
  },
  {
    title: 'Evidence Is Everything',
    subtitle: 'Custom Personal Statements & Nexus Letter Drafts',
    extraText: 'Written by Jordan Personally',
    description:
      'Tailored to your circumstance, our expertly written drafts ensure your case is compelling and clear. Nexus letters are fully prepared and ready to be signed by your doctor, giving your claim the best possible chance.',
    icon: faFileSignature,
  },
  {
    title: 'Your VetVictory Claim Guide',
    subtitle: 'Expertly-Crafted, Just for You',
    description:
      'Our experts carefully build your personalized guide based on your unique medical history and insights from your 1-on-1 Discovery Call. This is for those who demand that every strategic detail is covered to ensure your claim is as strong as possible.',
    icon: faMapSigns,
  },
]

const PremiumBonuses: React.FC = () => {
  return (
    <section className="w-full px-L sm:px-XXL overflow-hidden mt-14 sm:mt-24">
      <div className="flex items-center justify-center w-full">
        <h2 className="text-4xl sm:text-6xl text-center font-lexendDeca font-bold text-crimsonNew relative z-10">
        Exclusive Bonuses
        </h2>
        <span
          className={`inline-flex items-center justify-center ml-7 mt-1 mr-2 relative}`}
        >
          <FontAwesomeIcon
            icon={faCrown}
            className={`text-4xl sm:text-5xl md:text-6xl text-crimsonNew relative z-10`}
          />
        </span>
      </div>
    </section>
  )
}

export default PremiumBonuses
