import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldCheck, faSquareCheck } from '@fortawesome/pro-solid-svg-icons'

const ClearPathShort = () => {
  return (
    <section className="w-full my-[80px] px-L sm:px-XXL flex flex-col items-center">
      <div className="flex flex-col gap-[10px] text-center">
        <h1 className="w-full text-4xl sm:text-5xl text-crimsonNew font-oswald font-bold">
          The Complete VetVictory Claim Guide
        </h1>
        <h2 className="w-full text-3xl text-platinum_950 font-normal uppercase font-oswald">
          Your personal roadmap to maximum benefits
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-center my-XXL gap-XXL w-full lg:w-[80%]">
        <div className="w-full lg:w-[40%] rounded-[20px]">
          <Image
            src={'/imgs/research_report/clearpathreport.png'}
            alt="VetVictory Claim Guide"
            height={1000}
            width={1000}
            className="rounded-[20px]"
          />
        </div>
        <div className="flex flex-col gap-L w-full lg:w-[60%]">
          <p className="text-platinum_950 font-normal font-opensans text-base">
            The VetVictory Claim Guide is your secret weapon in the battle
            for VA benefits. This comprehensive guide, meticulously crafted by
            our expert team, provides you with a customized plan to streamline
            your claim.
          </p>
          <p className="text-platinum_950 font-normal font-opensans text-[20px]">
            What sets the VetVictory Claim Guide apart?
          </p>
          <ul className="list-none list-inside mb-[10px] text-base">
            <li className="mb-3">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className="text-green-700 mr-2 w-5 h-5"
              />
              In-depth research tailored to your unique situation
            </li>
            <li className="mb-3">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className="text-green-700 mr-2 w-5 h-5"
              />
              Scientific evidence supporting your claim
            </li>
            <li className="mb-3">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className="text-green-700 mr-2 w-5 h-5"
              />
              Real-life winning strategies from similar successful cases
            </li>
            <li className="mb-3">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className="text-green-700 mr-2 w-5 h-5"
              />
              A clear, step-by-step action plan for maximum benefits
            </li>
            <li className="mb-3">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className="text-green-700 mr-2 w-5 h-5"
              />
              Guide to boost your rating & maintain it for decades to come
            </li>
          </ul>
          <p className="text-oxfordBluenew text-[22px] justify-center text-center font-semibold font-opensans">
            Others Charge up to{' '}
            <span className="text-crimsonNew font-bold text-[26px]">$</span>
            <span className=" text-crimsonNew font-bold text-[26px] underline">
              5,600
            </span>{' '}
            for This
          </p>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="max-w-[1000px] w-full">
          
          <p className="text-center text-text_2 text-[20px] font-normal font-opensans mt-4">
            As a Grandmaster member, you'll receive this game-changing
            digital report. It's not just a document – it's a powerful tool
            designed to give you the confidence, clarity, and strategic
            advantage you need to secure the benefits you deserve.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ClearPathShort
