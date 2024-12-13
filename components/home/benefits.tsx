import React from 'react'
import Image from 'next/image'
import AngleElement from '../angledesign'

interface BenefitProps {
  title: string
  description: string
  img: string
}

const benefitsData: BenefitProps[] = [
  {
    title: 'Finally Be Heard',
    description:
      "We know how it feels when your story doesn't get the attention it deserves. That's why we make sure your story is told the right way, <strong>a way the VA can't ignore</strong>.",
    img: '/icons/medal.svg',
  },
  {
    title: 'Clear, Simple Steps to Success',
    description:
      "No more confusion. We break down the VA claims process into simple, <strong>easy-to-follow steps</strong>, so you can move forward with confidence.",
    img: '/icons/fileDone.svg',
  },
  {
    title: 'Break Free and Get Results',
    description:
      "Our proven strategies are designed to break through your roadblocks, many of our best clients have been denied for decades.",
    img: '/icons/lightBulb.svg',
  },
]

const Benefits: React.FC = () => {
  return (
    <section className="w-full mt-10 sm:mt-0 py-12 bg-[#F3F4F6] relative">
      <AngleElement angleType="top-light-simple" fillColor="#FFF" reverse={true}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-11 mb-20">
        <h1 className="text-4xl sm:text-5xl text-oxfordBlueNew text-center font-extrabold font-lexendDeca mb-16">
          How This Works
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitsData.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-oxfordBlueNew rounded-full flex items-center justify-center mb-4">
                <Image
                  src={benefit.img}
                  alt={`${benefit.title} icon`}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold text-oxfordBlueNew text-center mb-4">
                {benefit.title}
              </h3>
              <p 
                className="text-lg text-platinum_950 text-center"
                dangerouslySetInnerHTML={{ __html: benefit.description }}
              />
            </div>
          ))}
        </div>
      </div>
      <AngleElement angleType="bottom-light-simple" fillColor="#FFF" />
    </section>
  )
}

export default Benefits
