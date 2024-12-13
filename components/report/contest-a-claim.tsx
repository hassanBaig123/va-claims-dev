import React from 'react';
import { TypographyH2 } from '@/components/report/h2';
import { TypographyP } from '@/components/report/p';

interface ContestAClaimProps {
	content: string;
	isPrintable?: boolean;
}

const ContestAClaim: React.FC<ContestAClaimProps> = ({ content, isPrintable = false }) => {
	const [introduction, ...steps] = content.split('\n').filter(line => line.trim() !== '');

	const containerClasses = isPrintable
		? "my-8"
		: "bg-gray-50 border border-gray-200 rounded-lg p-6 my-8";

	const stepClasses = isPrintable
		? "mb-4"
		: "border-l-4 border-gray-300 pl-4 mb-4";

	return (
		<div className={containerClasses}>
			<TypographyH2 className="text-2xl font-bold mb-4 text-gray-800">How to Contest a Claim</TypographyH2>
			<TypographyP className="mb-6 text-gray-700">{introduction}</TypographyP>
			<div className="space-y-4">
				{steps.map((step, index) => (
					<div key={index} className={stepClasses}>
						<TypographyP className="text-gray-600">{step.trim()}</TypographyP>
					</div>
				))}
			</div>
		</div>
	);
};

export default ContestAClaim;
