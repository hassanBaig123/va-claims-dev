import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzle, faBullhorn, faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons";

interface ProblemProps {
  title: string;
  description: string;
  icon: typeof faPuzzle | typeof faBullhorn | typeof faMagnifyingGlass; 
}

const iconMapping = {
  faPuzzle: faPuzzle,
  faBullhorn: faBullhorn,
  faMagnifyingGlass: faMagnifyingGlass,
};

const problemsData: ProblemProps[] = [
  {
    title: "Complexity Overload",
    description: "The VA claims process can feel like a confusing battlefield of jargon and paperwork. It's time for a clear path forward to secure the benefits you've earned.",
    icon: faPuzzle,
  },
  {
    title: "Struggling to Be Heard",
    description: "Translating your unique experiences into VA language is tough. Having someone in your corner can help your voice be heard loud and clear.",
    icon: faBullhorn
  },
  {
    title: "Leaving Benefits Behind",
    description: "With so many potential service-connected conditions, it's hard to know if you're exploring every possibility. Expert guidance can help you maximize your claim's potential.",
    icon: faMagnifyingGlass
  },
];

const Problems: React.FC = () => {
  return (
    <section className="relative mt-32 mb-80" style={{ backgroundImage: `url('/imgs/brand_patterns/VA_Claims_A4_Stripes_Filled_4_Pattern_repeatable.png')` }}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-white leading-20 relative top-14">
          The 3 Most Common VA Rating Roadblocks
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problemsData.map((problem, index) => (
            <div key={index} className="flex flex-col items-center text-center py-10 p-6 bg-white shadow-xl rounded-lg transform translate-y-1/2">
              <div className="text-sky-900 mb-4">
                <FontAwesomeIcon icon={problem.icon} className="w-12 h-12"/>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-sky-900">{problem.title}</h3>
              <p className="text-lg">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
