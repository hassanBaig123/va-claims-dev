import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPhone, faFileAlt, faFolder, faFileUpload, faMagnifyingGlass, faStar, faClipboardCheck } from '@fortawesome/pro-solid-svg-icons';

const Infographic = () => {
	const steps = [
		{ number: 1, title: "INTAKE PROCESS", duration: "(15 MINUTES)", icon: faClipboardList, description: "Complete your brief intake form, select a day & time for your Discovery Call, then get started right away on the online training modules.", color: "bg-red-800" },
		{ number: 2, title: "COMPLETE DISCOVERY CALL", duration: "(AVERAGE 2-3 WEEKS)", icon: faPhone, description: "", color: "bg-blue-800" },
		{ number: 3, title: "PERSONAL STATEMENTS, NEXUS LETTERS, POTENTIAL PATHS", duration: "(AVERAGE 14 DAYS OR LESS)", icon: faFileAlt, description: "We Conduct Research & Draft Custom Personal Statement Templates & Nexus Letters if needed. During this time our team will have internal meetings to procure winning paths from previous winning claims.", color: "bg-red-800" },
		{ number: 4, title: "VETVICTORY CLAIM GUIDE", duration: "(RECEIVED IN PHYSICAL FORM ALONG WITH CUSTOM EVIDENCE FROM STEP 3)", icon: faFolder, description: "Receive Your Fully Custom Drafted VetVictory Claim Guide.", color: "bg-blue-800" },
		{ number: 5, title: "CLAIM SUBMISSION", duration: "(AVERAGE 5-7 DAYS)", icon: faFileUpload, description: "You can file the claim on your own using the tutorial or contact your local VSO to file for you. We do NOT file for you nor prepare your claim.", color: "bg-red-800" },
		{ number: 6, title: "C&P PREP", duration: "(AVERAGE 2-3 DAYS)", icon: faMagnifyingGlass, description: "Study the C&P exam prep module for your claim to go into your big day feeling confident & prepared.", color: "bg-blue-800" },
		{ number: 7, title: "CLAIM DECISION", duration: "(AVERAGE 45-135 DAYS)", icon: faStar, description: "Most of our clients are happy with their ratings at this point, others may have some re-strategizing to do and will move on to step 8.", color: "bg-red-800" },
		{ number: 8, title: "SUPPLEMENTAL CLAIM", duration: "(AVERAGE 60-135 DAYS) IF NEEDED", icon: faClipboardCheck, description: "If you would like to take another pass at a claim or disagree with a decision, the supplemental claim process is an effective way to do so.", color: "bg-blue-800" },
	];

	return (
		<div className="bg-white p-4 md:p-8 max-w-5xl mx-auto">
			<h1 className="text-4xl font-bold text-crimsonNew mb-8 text-center">How This Works</h1>
			<div className="relative">
				{steps.map((step, index) => (
					<div key={index} className="flex flex-col md:flex-row items-center mb-12 md:mb-8">
						<div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:order-3 md:text-left md:pl-8'}`}>
							<h2 className={`text-xl md:text-2xl font-bold ${step.color.replace('bg-', 'text-')} mb-2`}>
								Step {step.number} {step.title}
							</h2>
							<p className="text-sm text-gray-600 mb-1">{step.duration}</p>
							<p className="text-sm text-gray-700">{step.description}</p>
						</div>
						<div className={`flex-shrink-0 my-4 md:my-0 md:w-2/12 flex justify-center ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
							<div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center z-10 shadow-lg`}>
								<FontAwesomeIcon icon={step.icon} className="text-white text-2xl" />
							</div>
						</div>
						<div className={`w-full md:w-5/12`}></div>
					</div>
				))}
				<div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300 hidden md:block -ml-0.25"></div>
			</div>
		</div>
	);
};

export default Infographic;