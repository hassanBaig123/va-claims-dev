'use client'

import React, { useState, useEffect } from 'react'
import { TypographyH2 } from '@/components/report/h2'
import { TypographyH3 } from '@/components/report/h3'
import { TypographyP } from '@/components/report/p'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileLines,
  faComments,
  faHouse,
  faChartLine,
  faCircleQuestion,
  faUserGroup,
} from '@fortawesome/pro-solid-svg-icons'

interface ChecklistItem {
  text: string
}

interface ChecklistSection {
  title: string
  items: (ChecklistItem | string)[]
  tips?: string[]
}

interface ChecklistProps {
  title: string
  sections: ChecklistSection[]
}

const Checklist: React.FC<ChecklistProps> = ({ title, sections }) => {
  const [checkedItems, setCheckedItems] = useState<boolean[][]>(() => {
    const saved = localStorage.getItem('checkedItems')
    return saved
      ? JSON.parse(saved)
      : sections.map((section) => section.items.map(() => false))
  })

  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems))
  }, [checkedItems])

  console.log('Sections:', sections)

  const generateRTF = (title: string, sections: ChecklistSection[]) => {
	const rtfHeader = "{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Times New Roman;}{\\f1 Arial;}}\n";
	const rtfTitle = `{\\f1\\fs40\\b ${title}\\par\\par}\n`;
	const rtfSections = sections.map((section, sectionIndex) => {
		const sectionTitle = `{\\f1\\fs32\\b ${sectionIndex + 1}. ${section.title}\\par\\par}\n`;
		const sectionItems = section.items.map((item, itemIndex) => 
			`{\\f0\\fs28\\b ${itemIndex + 1}.\\tab }{\\f0\\fs28\\u9744?\\tab ${typeof item === 'string' ? item : item.text}\\par}`
		).join('\\par\n');
		const sectionTips = section.tips ? `\\par\n` + section.tips.map(tip => 
			`{\\f0\\fs24\\i Tip: ${tip}\\par}`
		).join('\\par\n') + `\\par\n` : '';
		return sectionTitle + sectionItems + sectionTips;
	}).join('\\par\n');
	const rtfFooter = "}";
	return rtfHeader + rtfTitle + rtfSections + rtfFooter;
};
  const handleDownload = () => {
    const rtfContent = generateRTF(title, sections)
    const blob = new Blob([rtfContent], { type: 'application/rtf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Checklist_${title.replace(/\s+/g, '_')}.rtf`
    link.click()
  }

  return (
    <div className="my-12 print:break-before-page bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-4">
        <TypographyH2 className="text-2xl font-bold text-gray-800">
          {title}
        </TypographyH2>
      </div>
      <div className="px-6 py-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8 last:mb-0 print:break-inside-avoid"
          >
            <TypographyH3 className="text-xl font-semibold text-gray-700 mb-4">
              {section.title}
            </TypographyH3>
            <ul className="space-y-3">
              {checkedItems && checkedItems[sectionIndex] && checkedItems[sectionIndex] && section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 mr-3 mt-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={checkedItems[sectionIndex][itemIndex]}
                      onChange={() => {
                        const newCheckedItems = [...checkedItems]
                        newCheckedItems[sectionIndex][itemIndex] =
                          !newCheckedItems[sectionIndex][itemIndex]
                        setCheckedItems(newCheckedItems)
                      }}
                    />
                  </div>
                  <TypographyP className="flex-1 text-gray-600">
                    {typeof item === 'string' ? item : item.text}
                  </TypographyP>
                </li>
              ))}
            </ul>
            {section.tips && section.tips.length > 0 && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                {section.tips.map((tip, tipIndex) => (
                  <>
                    <TypographyH3
                      key={tipIndex}
                      className="text-sm text-blue-700"
                    >
                      Tip:
                    </TypographyH3>
                    <TypographyP
                      key={tipIndex}
                      className="text-sm text-blue-700"
                    >
                      {tip}
                    </TypographyP>
                  </>
                ))}
              </div>
            )}
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
        Download Checklist
      </button>
    </div>
  )
}

export default Checklist
