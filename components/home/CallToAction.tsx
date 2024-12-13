import { faArrowRight } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

const CallToAction: React.FC = () => {
  return (
    <div className="text-white py-12">
        {/* <h2 className="container text-2xl sm:text-3xl text-center font-extrabold font-lexendDeca mb-16">
        Win as an Active Duty, Transitioning Military, or Veteran with our
        complete crash course
        </h2> */}
        <div className="w-full flex justify-center z-20">
        <Link
            href="/#otherscharge"
            className="group cta-button text-xl sm:text-3xl relative z-20 flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_2px_#c3c3c3] hover:shadow-[0px_0px_0px_4px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded"
        >
            Get Instant Access
            <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition-transform duration-300 group-hover:translate-x-6">
            <FontAwesomeIcon
                icon={faArrowRight}
                className="text-black w-9 h-9"
            />
            </span>
          </Link>
        </div>
    </div>
  )
}

export default CallToAction