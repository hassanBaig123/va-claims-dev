import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";

const LearnMore = () => {
  return (
    <section className='h-[400px] flex justify-center items-center bg-oxfordBlueNew'>
      <div className='w-full flex flex-col justify-center items-center gap-L px-L sm:p-XXL'>
        <h1 className='w-full text-center text-white font-bold text-[38px] md:text-6xl font-oswald '>Want More Details?</h1>
        
        <Link id="get-started-cta" href="/learn-more" legacyBehavior>
          <a className="cta-button text-xl mt-5 flex text-center justify-center items-center w-72 font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
            Learn More
            <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-black"
              />
            </span>
          </a>
        </Link>
      </div>
    </section>
  );
};

export default LearnMore;