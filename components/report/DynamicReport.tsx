'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { TypographyH1 } from '@/components/report/h1'
import { TypographyH2 } from '@/components/report/h2'
import { TypographyH3 } from '@/components/report/h3'
import { TypographyP } from '@/components/report/p'
import { Separator } from '@/components/report/separator'
import MedicalConditionSection from '@/components/report/MedicalConditionSection'
import CoverPage from '@/components/report/cover-page'
import PrintHeader from '@/components/report/print-header'
import CPExamCheatSheet from '@/components/report/c-and-p-cheatsheet'
import Callout from '@/components/report/callout'
import TypographyListCallout from '@/components/report/calloutList'
import NumberedList from '@/components/report/numbered-list'
import FilingOnlineGuide from '@/components/report/filing-online-guide'
import { TypographyTable } from '@/components/report/tableSimple'
import {
  MedicalCondition,
  MedicalConditionsIntroduction,
} from '@/types/medicalConditionTypes'
import PersonalStatementLetter from '@/components/report/PersonalStatementLetter'
import NexusLetter from '@/components/report/NexusLetter'
import StandardOperatingProcedure from '@/components/report/StandardOperatingProcedure'
import Glossary from '@/components/report/Glossary'
import ReportTitle from '@/components/report/reportTitle'
import ReportFAQs from './report-faqs'
import Message from '@/components/report/message'
import ContestAClaim from '@/components/report/contest-a-claim'
import Checklist from '@/components/report/checklist'
import MentalCAndPCheatSheet from '@/components/report/mental-c-and-p-cheatsheet'
import LegendExplanation from '@/components/report/LegendExplanation'

interface ReportData {
  executive_summary?: string[]
  overviewOfConditions?: string
  legendExplanation?: {
    introduction: string
    categories: {
      color: string
      colorHex: string
      label: string
      description: string
    }[]
  }
  conditionsSectionIntro?: MedicalConditionsIntroduction[]
  conditions?: MedicalCondition[]
  nonCompensableConditions?: string[]
  personalStatementLetters?: Letter[]
  nexusLetters?: Letter[]
  vaBenefitRatingsCriteria?: string
  standardOperatingProcedure?: string
  onlineFilingGuide?: {
    title: string;
    introduction?: string;
    steps: {
      title: string;
      description: string;
      resources: { name: string; url: string }[];
    }[];
    additionalResources?: { name: string; url: string }[];
  };
  howToContestClaim?: string
  otherPossibleBenefits?: string[]
  conclusion?: string
  glossary?: GlossaryTerm[]
  faqs?: any
  letter?: {
    salutation?: string;
    paragraphs?: string[];
    closing?: {
      message?: string;
      signature?: string;
      title?: string;
    };
  };
  checklist?: {
    title: string;
    sections: {
      title: string;
      items: string[];
      tips?: string[];
    }[];
  };
  mentalCAndPTips?: {
    sections: {
      title: string
      tips: string[]
    }[]
  };
}

interface Condition {
  name: string
  summary: string
  keyPoints: string[]
  research: ResearchItem[]
  cfr38Points: string[]
  cpTips?: string[]
  futureConsiderations: string
}

interface ResearchItem {
  title: string
  author: string
  summary: string
}

interface Letter {
  title: string
  content: string | string[]
}

interface GlossaryTerm {
  term: string
  definition: string
}

interface DynamicReportProps {
  userId?: string
  isPrintPage?: boolean
}

const DynamicReport: React.FC<DynamicReportProps> = ({
  userId,
  isPrintPage = false,
}) => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [reportNotFound, setReportNotFound] = useState<boolean>(false)
  const componentRef = useRef(null)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const url = userId ? `/api/report?userId=${userId}` : '/api/report'
        const response = await fetch(url)
        if (response.status === 404) {
          setReportNotFound(true)
          return
        }
        if (!response.ok) {
          throw new Error('Failed to fetch report data')
        }
        const data = await response.json()
        const parsedData = JSON.parse(data.decrypted_report)
        setReportData(parsedData)
      } catch (error) {
        console.error('Error fetching report data:', error)
        setReportNotFound(true)
      }
    }

    fetchReportData()
  }, [userId])

  useEffect(() => {
    if (reportData && isPrintPage) {
      window.print()
    }
  }, [reportData, isPrintPage])

  if (reportNotFound) {
    return (
      <div className="flex justify-center min-h-screen">
        <div className="text-center max-w-7xl mx-auto px-4">
          <TypographyH2>Your VetVictory Claim Guide is Not Available</TypographyH2>
          <TypographyP className="mt-4">
            The VetVictory Claim Guide is a comprehensive document that outlines everything you need to know about making a disability claim with the VA, tailored specifically to your case.
          </TypographyP>
          <TypographyP className="mt-4">
            To receive your report, you may need to complete certain tasks. Please check your <Link href="/todos" className="text-blue-500 hover:underline">To-Do List</Link> for any pending actions or visit your account settings to review your membership status.
          </TypographyP>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div
      className={`w-full ${isPrintPage ? 'max-w-6xl' : 'max-w-6xl'} mx-auto px-3`}
    >
      {!isPrintPage && (
        <Link
          href="/print-report"
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Print Report
        </Link>
      )}
      <div ref={componentRef} className="pdf-content">
        <CoverPage />

        <ReportTitle title="VetVictory Claim Guide" />

        {/* <PrintHeader headerText="Your Personalized Research Packet" /> */}

        {reportData.executive_summary && (
          <section className="my-8">
            <TypographyH2>Executive Summary</TypographyH2>
            {reportData.executive_summary.map((paragraph, index) => (
              <TypographyP key={index} className="mt-4">
                {paragraph}
              </TypographyP>
            ))}
          </section>
        )}
        
        {reportData.standardOperatingProcedure && (
          <StandardOperatingProcedure
            steps={reportData.standardOperatingProcedure}
          />
        )}

        <Callout
          title="Key Point"
          text="Understanding the criteria for disability ratings and thorough documentation is crucial for securing entitled benefits."
          className="my-8 w-full"
        />

        <Separator className="my-8" />

        {reportData.overviewOfConditions && (
          <section className="mt-8">
            <TypographyH2>Overview of Conditions</TypographyH2>
            <TypographyP>{reportData.overviewOfConditions}</TypographyP>
            <TypographyListCallout
              title="Conditions Overview"
              texts={reportData.conditions?.map((c) => c.condition_name) || []}
            />
          </section>
        )}

        {reportData.legendExplanation && (
          <section className="mt-8">
            <TypographyH3>Legend Explanation for Condition Grading</TypographyH3>
            <LegendExplanation 
              data={reportData.legendExplanation}
              className="mt-4"
            />
          </section>
        )}

        {reportData.conditions && (
          <MedicalConditionSection            
            conditions={reportData.conditions}
          />
        )}

        {reportData.nonCompensableConditions && (
          <section className="mt-8">
            <TypographyH2>Non-Compensable Conditions</TypographyH2>
            <NumberedList items={reportData.nonCompensableConditions} />
          </section>
        )}

        {reportData.personalStatementLetters && (
          <section className="mt-8 print:break-before-page">
            <TypographyH2>Personal Statement Letters</TypographyH2>
            {reportData.personalStatementLetters.map((letter, index) => (
              <PersonalStatementLetter
                key={index}
                title={letter.title}
                content={letter.content}
              />
            ))}
          </section>
        )}

        {reportData.nexusLetters && (
          <section className="mt-8 print:break-before-page">
            <TypographyH2>Nexus Letters</TypographyH2>
            {reportData.nexusLetters.map((letter, index) => (
              <NexusLetter
                key={index}
                title={letter.title}
                content={letter.content}
                breakBeforeNotFirstLetter={index !== 0}
              />
            ))}
          </section>
        )}
         {reportData.checklist && (
          <section className="mt-12 mb-12">
            <Checklist
              title={reportData.checklist.title}
              sections={reportData.checklist.sections}
            />
          </section>
        )}
        <CPExamCheatSheet />
        {reportData.mentalCAndPTips && (
          <section className="mt-12 print:break-before-page">
            <MentalCAndPCheatSheet sections={reportData.mentalCAndPTips.sections} />
          </section>
        )}
        {/* {reportData.vaBenefitRatingsCriteria && (
          <section className="mt-8">
            <TypographyH2>VA Benefit Ratings Criteria</TypographyH2>
            <TypographyP>{reportData.vaBenefitRatingsCriteria}</TypographyP>
            <div className="[&_tbody_tr:nth-child(even)]:bg-[#F3F4F6]">
              <TypographyTable
                data={{
                  headers: ['Rating', 'Criteria'],
                  rows: [
                    ['0%', 'No noticeable or slightly noticeable symptoms'],
                    ['10%', 'Mild symptoms that do not interfere with work'],
                    [
                      '30%',
                      'Moderate symptoms with occasional decrease in work efficiency',
                    ],
                    [
                      '50%',
                      'Considerable impairment of social and occupational functioning',
                    ],
                    ['70%', 'Severe impairment in most areas of life'],
                    ['100%', 'Total occupational and social impairment'],
                  ],
                }}
              />
            </div>
          </section>
        )} */}

        {reportData.onlineFilingGuide && (
          <section className="mt-8 print:break-before-page">
            <FilingOnlineGuide guide={reportData.onlineFilingGuide} isPrintVersion={isPrintPage} />
          </section>
        )}

        {reportData.howToContestClaim && (
          <section className="mt-8">
            <ContestAClaim content={reportData.howToContestClaim} isPrintable={isPrintPage} />
          </section>
        )}

        {/* Top 10 FAQs */}
        {reportData.faqs && (
          <section className="mt-8 mb-12">
            <ReportFAQs faqs={reportData.faqs} isPrintPage={isPrintPage} />
          </section>
        )}

        {reportData.otherPossibleBenefits && (
          <section className="my-8 print:break-before-page">
            <TypographyH2 className="mb-4">Other Possible Benefits</TypographyH2>
            <NumberedList items={reportData.otherPossibleBenefits} />
          </section>
        )}

        {reportData.letter && (
          <section className="my-8 print:break-before-page">
            <TypographyH2 className="mb-4">A Message from Jordan Anderson</TypographyH2>
            <Message letter={reportData.letter} />
          </section>
        )}

        {reportData.conclusion && (
          <section className="mt-8">
            <TypographyH2>Conclusion</TypographyH2>
            <TypographyP>{reportData.conclusion}</TypographyP>
          </section>
        )}

        {reportData.glossary && <Glossary terms={reportData.glossary} />}      

        
      </div>
    </div>
  )
}

export default DynamicReport
