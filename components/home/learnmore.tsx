import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import FadeInOnView from "@/components/fadeInOnView";

const LearnMore = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center py-24"
      style={{
        backgroundImage: `url('/imgs/brand_patterns/VA_Claims_Stripes_Screen_Size_Portrait_Filled_3_Pattern_repeatable.png')`,
      }}
    >
        <h1 className="text-3xl font-bold text-white tracking-wide sm:text-5xl xl:text-6xl/none mb-10">Ready to win your VA rating?</h1>
        <FadeInOnView delay="500ms">
      <Link href="/learn-more" legacyBehavior>
        <a className="cta-button text-xl flex items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-10 py-5  transition duration-300
   shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
          LEARN MORE
        <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
          <FontAwesomeIcon icon={faArrowRight} className="text-black" />
        </span>
        {/* <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 bg-gray-700 rounded-full shadow-[inset_2px_3px_4px_rgba(255,255,255,0.5),_1px_1px_1px_0px_#e2e2e2]">
          <FontAwesomeIcon icon={faArrowRight} className="text-white" />
        </span> */}
        </a>
      </Link>
      </FadeInOnView>
    </div>
  );
};

export default LearnMore;
