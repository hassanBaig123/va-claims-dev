import Image from 'next/image';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldCheck, faCircleCheck, faSquareCheck } from "@fortawesome/pro-solid-svg-icons";
import IncludedWithGold from '@/components/home/includedwithgold';

const ClearPathShort = () => {
  return (
    
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center align-bottom text-crimson leading-20">The ClearPath Research Report</h1>
          <h2 className="text-2xl sm:text-3xl mt-6 uppercase">Your personal roadmap to maximum benefits</h2>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row -mx-4 items-center justify-center">
          <div className="lg:w-1/2 p-8 mb-8 lg:mb-0 min-w-[380px] sm:min-w-[480px]">
            <Image
              src="/imgs/research_report/clearpathreport.png"
              alt="ClearPath Report Example"
              width={700}
              height={600}
            />
          </div>
          <div className="lg:w-1/2 px-8 sm:pl-10">
            <p className="text-xl mb-6 sm:min-w-[500px]">
              The ClearPath Research Report is your secret weapon in the battle for VA benefits.
              This comprehensive guide, meticulously crafted by our expert team, provides you with a
              customized plan to optimize your claim.
            </p>
            <p className="text-2xl mb-6">
              What sets the ClearPath Research Report apart?
            </p>
            <ul className="list-none list-inside mb-6 text-xl pl-4">
              <li className="mb-3 sm:mb-0"><FontAwesomeIcon icon={faSquareCheck} className="text-green-700 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-5 sm:h-5" />In-depth research tailored to your unique situation</li>
              <li className="mb-3 sm:mb-0"><FontAwesomeIcon icon={faSquareCheck} className="text-green-700 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-5 sm:h-5" />Scientific evidence supporting your claim</li>
              <li className="mb-3 sm:mb-0"><FontAwesomeIcon icon={faSquareCheck} className="text-green-700 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-5 sm:h-5" />Real-life winning strategies from similar successful cases</li>
              <li className="mb-3 sm:mb-0"><FontAwesomeIcon icon={faSquareCheck} className="text-green-700 mr-2 w-5 h-5 mb-0 sm:my-0 sm:w-5 sm:h-5" />A clear, step-by-step action plan for maximum benefits</li>
            </ul>
            <p className="text-2xl text-crimson font-semibold mb-6">
            Other services charge up to <span className="underline">$5600</span> for similar services.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center mt-10 sm:mt-20">
        <IncludedWithGold color="oxfordBlue" iconColor="green-700" />
            
            
          <p className="text-xl max-w-2xl">
            As a Gold Advantage member, you'll receive this game-changing report in both digital and
            print formats. It's not just a document – it's a powerful tool designed to give you the
            confidence, clarity, and strategic advantage you need to secure the benefits you deserve.
          </p>
        </div>
      </div>
    
  );
};

export default ClearPathShort;