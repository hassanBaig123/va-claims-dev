import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileCheck,
  faSliders,
  faFlaskGear,
  faListCheck,
  faFileCertificate,
} from '@fortawesome/pro-regular-svg-icons'
import Image from 'next/legacy/image'
import Link from 'next/link'
import AngleElement from '@/components/angledesign'
import IncludedWithGold from '@/components/home/includedwithgold'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import { Separator } from '../ui/separator'

interface NexusDescriptionsProps {
  title: string
  description: string
  icon: typeof faFlaskGear | typeof faSliders | typeof faListCheck
}

const iconMapping = {
  faFlaskGear: faFlaskGear,
  faSliders: faSliders,
  faListCheck: faListCheck,
}

const nexusDescriptions: NexusDescriptionsProps[] = [
  {
    title: 'Backed by Science',
    description:
      'To bolster the strength of your Nexus letter, we dive deep into our extensive database of peer-reviewed scientific studies and literature. When available, we incorporate this supporting evidence directly into your letter, providing a solid foundation for your claim.',
    icon: faFlaskGear,
  },
  {
    title: 'Tailored to Your Story',
    description:
      'Just like our custom personal statement templates, your Nexus letter is written with your specific circumstances in mind. We take the time to understand your unique case and craft a letter that speaks directly to your situation, maximizing its impact and relevance.',
    icon: faSliders,
  },
  {
    title: 'Signature Ready',
    description:
      'Our Grandmaster Nexus letters are fully written and ready to be signed by your doctor. We handle all the heavy lifting, ensuring that your letter contains all the necessary components and language to give your claim the best possible chance of success.',
    icon: faListCheck,
  },
]

const NexusLongLight: React.FC = () => {
  return (
    <section className="bg-white px-4 sm:px-10 py-12">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="rounded-lg p-8 mb-12">          
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Personalized Complete Support
          </h2>

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-2/5">
              <Image
                src="/imgs/people/soldier_smiling.jpg"
                alt="Nexus Letters"
                width={530}
                height={450}
                className="rounded-lg shadow-md object-cover"
              />
            </div>
            <div className="lg:w-3/5 space-y-8">
              {/* <p className="text-lg sm:text-xl">
                Maximize your VA claim potential by discovering overlooked
                service connections and preparing for your C&P exam with
                confidence.
              </p> */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Exclusive Access to 'The Board Room'
                </h3>
                <p className="text-lg sm:text-xl text-platinum_950">
                  Join our private, active community where Jordan and fellow
                  high-speed veterans exchange key intel about all things VA
                  disability. Need a good answer fast? Ask here.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  1-on-1 Discovery Call ($297 Value)
                </h3>
                <p className="text-lg sm:text-xl text-platinum_950">
                  We need to get your full story because every detail matters.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Pre-C&P Exam Call ($297 Value)
                </h3>
                <p className="text-lg sm:text-xl text-platinum_950">
                  Feel confident & prepared before heading in to the most
                  important day of your rating process.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator className='h-[2px]' />
        {/* Evidence Is Everything section */}
        <div className="text-center mt-12 mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-oxfordBlue mb-4">
            <span className="text-gray-800">
              Custom Evidence Drafts By Jordan Personally
            </span>
          </h1>
          <h3 className="text-xl text-gray-800 font-normal mb-2"></h3>
          {/* <h3 className="text-lg sm:text-lg text-gray-800 underline">
            Written by Jordan Personally
          </h3> */}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <Image
              src="/imgs/folder_pic.png"
              alt="Nexus Letters"
              width={600}
              height={400}
              className="max-w-full h-auto  object-cover"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <p className="text-lg sm:text-xl text-platinum_950 text-center">
              Writing good lay evidence is hard. Writing nexus letters can be
              even harder. Let Jordan handle writing your custom draft of
              personal statements and nexus letters as requested for up to
              fifteen (15) conditions. Ready to edit as needed and sign!
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-platinum_950 text-center">
              ($2,500+ Value)
            </p>
          </div>
        </div>
      </div>
      <Separator className='h-[2px]' />
    </section>
  )
}

export default NexusLongLight

