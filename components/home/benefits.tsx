import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCheck,
  faMedal,
  faLightbulbOn,
} from "@fortawesome/pro-regular-svg-icons";

interface BenefitProps {
  title: string;
  description: string;
  icon: typeof faFileCheck | typeof faMedal | typeof faLightbulbOn;
}

const iconMapping = {
  faFileCheck: faFileCheck,
  faMedal: faMedal,
  faLightbulbOn: faLightbulbOn,
};

const benefitsData: BenefitProps[] = [
  {
    title: "Experience the Relief of Simplicity",
    description:
      "At VA Claims Academy, we know how confusing VA disability claims can be. That's why we're here to make things simple for you. Our experts break down the big words and legal jargon, giving you the facts in plain English, so you can move forward with confidence.",
    icon: faFileCheck,
  },
  {
    title: "We Go Above and Beyond",
    description:
      "We believe you deserve the best support possible. Our team works hard to help you explore every chance for service-connection, making sure no stone is left unturned. We'll go the extra mile to help you file the strongest claim possible for each of your conditions.",
    icon: faMedal,
  },
  {
    title: "Say Goodbye to Guesswork",
    description:
      "Tired of the 'wait and see' approach? With our help, you'll have a clear action plan for filing a winning claim for each condition. We take out the guesswork and give you the know-how and strategies to go after the benefits you've earned.",
    icon: faLightbulbOn,
  },
];

const Benefits: React.FC = () => {
  return (
    <section
      className="relative pt-32 pb-20 mb-64 "
      style={{
        backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stars_Screen_Size_Smaller_Filled_3_Pattern_Repeatable.png')`,
      }}
    >
      <div className="absolute -top-1 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#fff"
            d="M0,32L1440,96L1440,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-white leading-20 relative top-14 z-10">
          Your Claim, Simplified
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative  z-10">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center py-10 p-6 bg-white shadow-xl rounded-lg transform translate-y-1/2"
            >
              <div className="text-sky-900 mb-4">
                <FontAwesomeIcon icon={benefit.icon} className="w-12 h-12" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-crimson">
                {benefit.title}
              </h3>
              <p className="text-lg">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            d="M0,256L1440,224L1440,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Benefits;
