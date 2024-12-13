import React from 'react'
import {
  MedicalCondition,
  MedicalConditionsIntroduction,
} from '@/types/medicalConditionTypes'
import { TypographyH1 } from '@/components/report/h1'
import { TypographyH2 } from '@/components/report/h2'
import { TypographyH3 } from '@/components/report/h3'
import { TypographyP } from '@/components/report/p'
import { Separator } from '@/components/report/separator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/pro-solid-svg-icons'
import PrintHeader from '@/components/report/print-header'
import { QRCodeSVG } from 'qrcode.react';

interface MedicalConditionSectionProps {
  conditions: MedicalCondition[]
}

const MedicalConditionSection: React.FC<MedicalConditionSectionProps> = ({
  conditions,
}) => {
  return (
    <div>
      {/* <TypographyP>{conditionsSectionIntro}</TypographyP> */}
      {conditions.map((condition, index) => (
        <React.Fragment key={index}>
          <div
            key={index}
            className={`mb-10 p-4 mt-20`}
            style={{ pageBreakBefore: 'always' }}
          >
            {/* <PrintHeader headerText="VetVictory Claim Guide" /> */}
            <TypographyH1 className={`text-center border-none`}>
              {condition.condition_name}
            </TypographyH1>
            <TypographyH2
              className={`text-center my-2 text-${condition.color}-500`}
            >
              {condition.shortDescriptor}
            </TypographyH2>
            <div className={`flex`}>
              <div className={`flex-1`}>
                <div className={`my-10`}>
                  <div className={`relative`}>
                    <FontAwesomeIcon
                      icon={faKey}
                      className="absolute top-5 right-5 w-6 h-6 text-oxfordBlue print:text-black"
                    />
                    <aside
                      className={`float-right max-w-sm p-4 m-2 border border-gray-300 bg-[#F3F4F6] text-oxfordBlue print:bg-gray-50 print:text-black`}
                    >
                      <TypographyH3>Key Points</TypographyH3>
                      <ul className={`list-disc list-inside`}>
                        {condition.key_points.map((point, idx) => (
                          <li key={idx} className={`my-3`}>
                            <span className={`font-semibold mb-1`}>
                              {point.pointTitle}:
                            </span>
                            <br></br> {point.point}
                          </li>
                        ))}
                      </ul>
                    </aside>
                  </div>
                  <TypographyP className={`my-4`}>
                    {condition.executive_summary}
                  </TypographyP>
                </div>
                <div className={`mt-10 w-full overflow-y-auto`}>
                  <table className={`w-full`}>
                    <thead>
                      <tr>
                        <th
                          className={`border-slate-500 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right`}
                        >
                          Research
                        </th>
                        <th
                          className={`border-slate-500 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right`}
                        >
                          Summary
                        </th>
                        <th className={`border-slate-500 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right hidden print:table-cell`}>QR Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {condition.research_section.map((research, idx) => (
                        <tr
                          key={idx}
                          className={`m-0 border-t p-0 even:bg-[#F3F4F6]`}
                        >
                          <td
                            className={`border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right`}
                          >
                            <div className={`inline-block max-w-full`}>
                              <a
                                href={research.researchUrl}
                                className={`text-blue-500 hover:underline break-all`}
                              >
                                {research.researchTitle}
                              </a>
                            </div>
                            <p className={`text-sm text-gray-600`}>
                              {research.authorName}
                            </p>
                          </td>
                          <td
                            className={`border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right`}
                          >
                            <TypographyP>
                              {research.summaryOfResearch}
                            </TypographyP>
                          </td>
                          <td className={`border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right hidden print:table-cell`}>
                         <QRCodeSVG value={research.researchUrl} size={64} /> 
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col sm:flex-row justify-between mt-10 gap-4 print:mt-30`}
            style={{ pageBreakBefore: 'always' }}
          >
            <div
              className={`w-full sm:w-1/2  border-slate-900 bg-gray-100  print:mt-40`}
            >
              <TypographyH2
                className={`font-semibold p-2 bg-frenchGray print:bg-none text-oxfordBlue print:text-black`}
              >
                38CFR Points
              </TypographyH2>
              <ul className="p-2">
                {condition.PointsFor38CFR.map((point, idx) => (
                  <li key={idx} className={`text-sm my-3`}>
                    <div className={`font-semibold mb-1`}>
                      {point.pointTitle}:
                    </div>{' '}
                    {point.point}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`w-full sm:w-1/2 border-slate-900 bg-gray-100  print:mt-40`}
            >
              <TypographyH2
                className={`font-semibold p-2 bg-frenchGray print:bg-none text-oxfordBlue print:text-black`}
              >
                Future Considerations
              </TypographyH2>
              <ul className="p-2">
                {condition.future_considerations.map((consideration, idx) => (
                  <li key={idx} className={`text-sm my-3`}>
                    <div className={`font-semibold mb-1`}>
                      {consideration.considerationTitle}:
                    </div>{' '}
                    {consideration.consideration}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {index !== conditions.length - 1 && (
            <div className={`mt-8`}>
              <Separator className={`mt-8`} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default MedicalConditionSection
