import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faPhone, faFileAlt, faFileSignature, faUpload, faStethoscope, faBalanceScale, faRedo } from "@fortawesome/pro-solid-svg-icons";
const UserProcess = () => {
  const steps = [
    {
      number: 1,
      title: 'INTAKE PROCESS (15 MINUTES)',
      description: 'Complete your brief intake form, select a day & time for your Discovery Call, then get started right away on the online training modules.',
      icon: faClipboardList
    },
    {
      number: 2,
      title: 'COMPLETE DISCOVERY CALL (AVERAGE 2-3 WEEKS)',
      description: 'Your description here.',
      icon: faPhone
    },
    {
      number: 3,
      title: 'PERSONAL STATEMENTS, NEXUS LETTERS, POTENTIAL PATHS (AVERAGE 14 DAYS OR LESS)',
      description: 'We Conduct Research & Draft Custom Personal Statement Templates & Nexus Letters if needed. During this time our team will have internal meetings to procure winning paths from previous winning claims.',
      icon: faFileAlt
    },
    {
      number: 4,
      title: 'CLEARPATH REPORT (RECEIVED IN PHYSICAL FORM ALONG WITH CUSTOM EVIDENCE FROM STEP 3)',
      description: 'Receive Your Fully Custom Drafted ClearPath Research Report.',
      icon: faFileSignature
    },
    {
      number: 5,
      title: 'CLAIM SUBMISSION (AVERAGE 5-7 DAYS)',
      description: 'You can file the claim on your own using the tutorial or contact your local VSO to file for you. We do NOT file for you nor prepare your claim.',
      icon: faUpload
    },
    {
      number: 6,
      title: 'C&P PREP (AVERAGE 2-3 DAYS)',
      description: 'Study the C&P exam prep module for your claim to go into your big day feeling confident & prepared.',
      icon: faStethoscope
    },
    {
      number: 7,
      title: 'CLAIM DECISION (AVERAGE 45-135 DAYS)',
      description: 'Most of our clients are happy with their ratings at this point, others may have some re-strategizing to do and will move on to step 8.',
      icon: faBalanceScale
    },
    {
      number: 8,
      title: 'SUPPLEMENTAL CLAIM (AVERAGE 60-135 DAYS) IF NEEDED',
      description: 'If you would like to take another pass at a claim or disagree with a decision, the supplemental claim process is an effective way to do so.',
      icon: faRedo
    }
  ];

  const getColor = (index) => {
    const colors = ['oxfordBlue', 'crimson']; // Ensure these colors are defined in your Tailwind config
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative w-full max-w-4xl">
        {/* Vertical line */}
        <div className="absolute inset-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full z-0"></div>
        
        {steps.map((step, index) => (
          <div key={step.number} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center my-8`}>
            {/* Step circle and number */}
            <div className={`z-10 ${index % 2 === 0 ? 'mr-12' : 'ml-12'}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 border-${getColor(index)} text-${getColor(index)} font-bold`}>
                <span>Step {step.number}</span>
              </div>
            </div>
            {/* Text description */}
            <div className={`flex-1 ${index % 2 === 0 ? 'pr-24' : 'pl-24'}`}>
              <h3 className={`text-${getColor(index)} font-semibold mb-2`}>{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
            {/* Icon in circle on the vertical line */}
            <div className="z-20 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center border-4 border-${getColor(index)} bg-${getColor(index)} text-4xl text-white`}>
                <FontAwesomeIcon icon={step.icon} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProcess;