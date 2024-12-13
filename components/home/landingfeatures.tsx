import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowProgress, faPenField, faHandshakeAngle, faMapLocationDot } from "@fortawesome/pro-regular-svg-icons";

interface FeaturesProps {
  title: string;
  description: string;
  icon: typeof faArrowProgress | typeof faPenField | typeof faHandshakeAngle | typeof faMapLocationDot;
}

const featuresData: FeaturesProps[] = [
  {
    title: "Step-by-Step Training",
    description: "Follow clear, step-by-step guides to navigate the VA claims process confidently.",
    icon: faArrowProgress,
  },
  {
    title: "Custom Evidence Drafts",
    description: "Receive evidence drafts tailored to translate your story into VA language.",
    icon: faPenField,
  },
  {
    title: "Discovery Phone Call",
    description: "Discuss how your conditions affect you, how they began, and how they relate to your service.",
    icon: faHandshakeAngle,
  },
  {
    title: "Detailed Research",
    description: "Receive a custom research report with in-depth answers, crafted by a VA claims expert.",
    icon: faMapLocationDot,
  }
];

const Features: React.FC = () => {
  return (
    <section className="flex flex-col gap-L sm:mt-8 sm:gap-XXL pt-XXL px-L sm:px-XXL">
      <div className="w-full text-center">
        <h1 className="text-4xl sm:text-5xl text-crimsonNew text-center font-oswald font-bold">
        Expert Training and Personalized Evidence
        </h1>
      </div>
      <div className="w-full flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-L w-full max-w-[1440px]">
        {featuresData.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center py-L sm:py-XXL px-L gap-[10px] sm:gap-L  rounded-lg">
            <div className="flex justify-center items-center text-sky-900 mb-4">
              <FontAwesomeIcon icon={feature.icon} className="w-[48px] h-[48px] text-platinum_950" />
            </div>
            <div className="h-[70px]">
              <h3 className="text-platinum_950 font-bold text-2xl font-sans">{feature.title}</h3>
            </div>
            <div>
              <p className="text-base font-normal text-platinum_950">{feature.description}</p>
              {feature.title === "Detailed Research" && (
                <p className="text-base font-normal text-red-600">
                  VERY LIMITED AVAILABILITY
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Features;
