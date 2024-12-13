'use client'

import React from 'react'
import { TypographyH2 } from '@/components/report/h2'
import { TypographyH3 } from '@/components/report/h3'
import { TypographyP } from '@/components/report/p'

interface MentalCAndPCheatSheetProps {
	sections: {
		title: string
		tips: string[]
	}[]
}

const MentalCAndPCheatSheet: React.FC<MentalCAndPCheatSheetProps> = ({ sections }) => {
	const generateRTF = (sections: { title: string; tips: string[] }[]) => {
		const rtfHeader = "{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Times New Roman;}{\\f1 Arial;}}\n";
		const rtfTitle = `{\\f1\\fs40\\b Mental C&P Exam Cheat-Sheet\\par\\par}\n`;
		const rtfSections = sections.map((section, index) => {
			const sectionTitle = `{\\f1\\fs32\\b ${index + 1}. ${section.title}\\par}\n`;
			const sectionTips = section.tips.map(tip => 
				`{\\f0\\fs28\\tab ${tip}\\par}`
			).join('\\par\n');
			return sectionTitle + sectionTips;
		}).join('\\par\n');
		const rtfFooter = "}";
		return rtfHeader + rtfTitle + rtfSections + rtfFooter;
	}

	const handleDownload = () => {
		const rtfContent = generateRTF(sections)
		const blob = new Blob([rtfContent], { type: 'application/rtf' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = `Mental_C&P_Exam_Cheat_Sheet.rtf`
		link.click()
	}

	return (
		<div className="my-12 print:break-before-page bg-white shadow-lg rounded-lg overflow-hidden">
			<div className="bg-gray-100 border-b border-gray-200 px-6 py-4">
				<TypographyH2 className="text-2xl font-bold text-gray-800">
					Mental C&P Exam “Cheat-Sheet”
				</TypographyH2>
			</div>
			<div className="px-6 py-6">
				<TypographyP className="mb-4">
					This checklist is designed to help you quickly remember important moments from your experience. It’s meant to jog your memory, not to be a full story.
				</TypographyP>
				{sections.map((section, index) => (
					<div key={index} className="mb-6">
						<TypographyH3 className="text-lg font-semibold text-gray-700">
							{section.title}
						</TypographyH3>
						<ul className="list-disc pl-5">
							{section.tips.map((tip, tipIndex) => (
								<li key={tipIndex} className="text-gray-600">
									<TypographyP>{tip}</TypographyP>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<button
				onClick={handleDownload}
				className="m-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden flex items-center justify-center"
			>
				<svg
					className="w-5 h-5 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Download Cheat-Sheet
			</button>
		</div>
	)
}

export default MentalCAndPCheatSheet
