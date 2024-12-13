import React from 'react';
import { TypographyH2 } from './h2';
import { TypographyP } from './p';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
	question: string;
	answer: string;
}

interface ReportFAQsProps {
	faqs: FAQ[];
	isPrintPage?: boolean;
}

const ReportFAQs: React.FC<ReportFAQsProps> = ({ faqs, isPrintPage = false }) => {
	return (
		<section className="max-w-4xl mx-auto">
			<TypographyH2 className="mb-3">Top 10 FAQs</TypographyH2>
			{isPrintPage ? (
				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<div key={index} className="mb-4" style={{ pageBreakInside: 'avoid', pageBreakBefore: 'avoid' }}>
							<TypographyP className="font-semibold">{`${index + 1}. ${faq.question}`}</TypographyP>
							<TypographyP className="ml-6">{faq.answer}</TypographyP>
						</div>
					))}
				</div>
			) : (
				<Accordion type="single" collapsible className="w-full space-y-4">
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={`item-${index}`} className="border rounded-lg overflow-hidden">
							<AccordionTrigger className="text-lg font-medium p-4 hover:bg-gray-50 text-left">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="bg-gray-50 p-4">
								<p className="text-base leading-relaxed">{faq.answer}</p>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			)}
		</section>
	);
};

export default ReportFAQs;
