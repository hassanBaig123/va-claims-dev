import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowProgress, faPenField, faHandshakeAngle, faMapLocationDot } from "@fortawesome/pro-regular-svg-icons";
import DesignElement from "@/components/angledesign";

interface FeaturesProps {
  title: string;
  description: string;
  icon: typeof faArrowProgress | typeof faPenField | typeof faHandshakeAngle | typeof faMapLocationDot; 
}

const iconMapping = {
  faArrowProgress: faArrowProgress,
  faPenField: faPenField,
  faHandshakeAngle: faHandshakeAngle,
  faMapLocationDot: faMapLocationDot,
};

const featuresData: FeaturesProps[] = [
  {
    title: "Step-by-Step Guidance",
    description: "Get real peace of mind as you are walked through step-by-step of filing your best claim. We provide simple, step-by-step instructions that take the mystery out of the process, giving you the power to take control of your claim journey.",
    icon: faArrowProgress,
  },
  {
    title: "Your Story, Their Language",
    description: "We know your story is one-of-a-kind. That's why we give you personalized templates for statements and medical nexus letters, translating your experiences into the language the VA understands. We make sure your voice is heard, loud and clear.",
    icon: faPenField
  },
  {
    title: "Unmatched Support",
    description: "At VA Claims Academy, we leave no stone unturned. Our powerful tools and in-depth discovery process are designed to uncover all possible service-connected conditions, even ones you might not have thought of. With our support, you can feel confident that your claim is as strong as it can be.",
    icon: faHandshakeAngle
  },
  {
    title: "Custom-Made Research",
    description: "We believe in support that's tailored just for you. That's why we provide a comprehensive ClearPath Research Report, delivered to you digitally and in print. This report is carefully put together based on your unique situation, giving you a clear roadmap of the best ways to win your claim.",
    icon: faMapLocationDot
  }
];

const Features: React.FC = () => {
  return (
    <section className="relative pt-20 sm:pt-24 xl:pt-48 sm:pb-8 mb-52 " style={{ backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stripes_Screen_Size_Portrait_Filled_3_Pattern_repeatable.png')` }}>
       <div className="absolute -top-1 left-0 w-full">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#fff" d="M0,128L1440,32L1440,0L0,0Z"></path>
        </svg>
      </div>
      {/* <DesignElement position="top" /> */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-white mb-9 sm:mb-0 leading-20 relative top-14 z-10">
        Powerful Tools and Personalized Support to Strengthen Your Claim
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 relative  z-10">
          {featuresData.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center py-10 p-6 bg-white shadow-xl rounded-lg transform translate-y-1/3">
              <div className="text-sky-900 mb-4">
                <FontAwesomeIcon icon={feature.icon} className="w-12 h-12"/>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-crimson">{feature.title}</h3>
              <p className="text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 w-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#ffffff" d="M0,288L1440,160L1440,320L0,320Z"></path>
        </svg>
      </div>
      
    </section>
  );
};

export default Features;