import React from "react";
import Image from "next/image";
import AngleElement from "../angledesign";

interface ProblemProps {
  title: string;
  description: string;
  img: string;
}

const problemsData: ProblemProps[] = [
  {
    title: "Low Ratings & Denials",
    description: "You are far from alone. Did you know that <strong>8 out of 10</strong> veterans are <strong>underrated</strong> by the VA? This has a huge financial <strong>impact on your household</strong>.",
    img: "/icons/thumbs-down.svg"
  },
  {
    title: "Way Too Complicated",
    description: "Many veterans <strong>give up or avoid</strong> applying for years. When you don't have the right help in your corner, filing a good claim can seem like a <strong>maze</strong>.",
    img: "/icons/puzzle-icon.svg"
  },
  {
    title: "Lack of Evidence",
    description: "It's no secret that you were probably <strong>not seeing the doctor during service</strong>, it was highly frowned upon. In fact, many of our <strong>best clients</strong> started with <strong>no medical evidence</strong> at all!",
    img: "/icons/checkedDocs.svg"
  },
];

const Problems: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F3F4F6] flex flex-col justify-center items-center px-L sm:px-XXL pb-20 py-16">
      
      <div className="text-3xl sm:text-2xl md:text-3xl w-full text-center font-lexandDeca font-bold text-crimsonNew mb-20">
      3 Common Problems
      </div>

      <div className="w-full h-full flex flex-col md:flex-row gap-16 justify-center items-center">
        {problemsData.map((problem, index) => (
          <div key={index} className="w-full md:w-[300px] lg:w-[400px] flex flex-col items-center justify-center relative">
            <div className="relative w-full h-[80px] bg-crimsonNew flex items-center justify-center overflow-visible rounded-t-custom_lg">
              <div className="absolute top-[-60%] bg-backgoundPlatinum rounded-full p-4 flex items-center justify-center shadow-md border-[8px] border-crimsonNew">
                <Image
                  src={problem.img}
                  alt={problem.img}
                  height={64}
                  width={64}
                />
              </div>
            </div>
            <div className="p-L h-auto w-full md:h-[350px] lg:h-[250px] xl:h-[200px] flex flex-col justify-start bg-white rounded-b-custom_lg ">
              <p className="text-xl sm:text-xl md:text-xl font-bold text-center text-crimsonNew font-lexendDeca mb-1">{problem.title}</p>
              <p className="text-lg text-platinum_950 text-center" dangerouslySetInnerHTML={{ __html: problem.description }}></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Problems;
