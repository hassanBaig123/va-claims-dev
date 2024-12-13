import React from 'react'
import {
  KanbanColumn,
  IntakesNotCompletedCard,
  IntakesSubmittedCard,
  SupplementalsNotCompletedCard,
  SupplementalsNeedingApprovalCard,
  ReportsNeedingApprovalCard as ReportNeedingApprovalCard,
  DiscoveryNotScheduledCard,
  DiscoverySubmittedCard,
  DiscoveryCard,
  IncompleteReportsCard as IncompleteReportCard,
} from './kanban-column'
import { discoveryCalls } from '@/utils/data/schedule/scheduled_events'
import { validateReport } from '@/lib/validations/report.validator'
 
export const KanbanBoard = async ({
  forms,
  reports,
  query,
}: {
  forms: any
  reports: any
  query: any
}) => {
  // Safely handle reports data
  const processReports = (reportsData: any) => {
    if (!reportsData) return []
 
    try {
      // If it's an object with arrays as values, flatten all arrays into one
      if (typeof reportsData === 'object' && !Array.isArray(reportsData)) {
        const arrays = Object.values(reportsData).filter(Array.isArray)
        return arrays.flat()
      }
 
      // If it's already an array, return it
      if (Array.isArray(reportsData)) return reportsData
 
      // If it has a reports property that's an array, return that
      if (reportsData.reports && Array.isArray(reportsData.reports)) {
        return reportsData.reports
      }
 
      // If none of the above, wrap in array if it's a single report
      return reportsData ? [reportsData] : []
    } catch (error) {
      console.error('Error processing reports:', error)
      return []
    }
  }
 
  const reportsArray = processReports(reports)
  console.log('Processed reports array:', reportsArray)
 
  const onboardingWithoutNotes = async () => {
    const discoveryCall_data = await discoveryCalls({ query })
    return discoveryCall_data || []
  }
 
  const hasNotScheduledOnboarding = async () => {
    const discoveryCall_data = await discoveryCalls({
      status: 'created',
      query,
    })
    return discoveryCall_data || []
  }
 
  const hasOnboardingNotesSubmitted = async () => {
    const discoveryCall_data = await discoveryCalls({
      not: true,
      status: 'submission_approved',
      query,
    })
    return discoveryCall_data || []
  }
 
  const categorizedData = {
    intakesNotCompleted: forms?.intakesNotCompleted
      ? forms.intakesNotCompleted
      : [],
    intakesSubmitted: forms?.intakesSubmitted ? forms.intakesSubmitted : [],
    supplementalsNotCompleted: forms?.supplementalsNotCompleted
      ? forms.supplementalsNotCompleted
      : [],
    supplementalsNeedingApproval: forms?.supplementalsNeedingApproval
      ? forms.supplementalsNeedingApproval
      : [],
    onboardingNotScheduled: await hasNotScheduledOnboarding(),
    onboardingWithoutNotes: await onboardingWithoutNotes(),
    onboardingSubmitted: await hasOnboardingNotesSubmitted(),
    incompleteReports: reportsArray.filter((report: any) => {
      if (report.status !== 'created') return false
 
      // Access the report content from the database record
      const reportContent = report.decrypted_report
 
      try {
        let parsedContent = reportContent
        if (typeof reportContent === 'string') {
          try {
            parsedContent = JSON.parse(reportContent)
          } catch (e) {
            console.error('Failed to parse report content:', e)
          }
        }
 
        // Validate the report
        const validationResult = validateReport(parsedContent)
        report.validationResult = validationResult
 
        // Return true only if the report is incomplete (< 100%)
        return validationResult.completionPercentage < 100
      } catch (error) {
        console.error('Error processing report:', error)
        report.validationResult = validateReport(null)
        return true
      }
    }),
    reportsNeedingApproval: reportsArray.filter((report: any) => {
      try {
        // Include reports that are either:
        // 1. Explicitly marked as 'submitted'
        // 2. Have 'created' status but are 100% complete
        if (report.status === 'submitted') return true
 
        if (report.status === 'created') {
          const reportContent = report.decrypted_report
          let parsedContent =
            typeof reportContent === 'string'
              ? JSON.parse(reportContent)
              : reportContent
 
          const validationResult = validateReport(parsedContent)
          return validationResult.completionPercentage === 100
        }
 
        return false
      } catch (error) {
        console.error('Error processing report:', error)
        return false
      }
    }),
  }
 
  // Group reports by user
  const groupByUser = (items: any[]) => {
    return items.reduce((acc, item) => {
      const userId = item.users?.id || item.user_id
      if (!acc[userId]) {
        acc[userId] = [item]
      } else {
        acc[userId].push(item)
      }
      return acc
    }, {})
  }
 
  const data = [
    {
      title: 'Intakes Not Completed',
      data: Object.values(categorizedData.intakesNotCompleted),
      cardComponent: IntakesNotCompletedCard,
    },
    {
      title: 'Intakes Submitted',
      data: Object.values(categorizedData.intakesSubmitted),
      cardComponent: IntakesSubmittedCard,
    },
    {
      title: 'Supplementals Not Completed',
      data: Object.values(categorizedData.supplementalsNotCompleted),
      cardComponent: SupplementalsNotCompletedCard,
    },
    {
      title: 'Supplementals Needing Approval',
      data: Object.values(categorizedData.supplementalsNeedingApproval),
      cardComponent: SupplementalsNeedingApprovalCard,
    },
    {
      title: 'Discovery Not Scheduled',
      data: Object.values(categorizedData.onboardingNotScheduled),
      cardComponent: DiscoveryNotScheduledCard,
    },
    {
      title: 'Discovery Needing Approval',
      data: Object.values(categorizedData.onboardingSubmitted),
      cardComponent: DiscoveryCard,
    },
    {
      title: 'Incomplete Reports',
      data: Object.values(groupByUser(categorizedData.incompleteReports)),
      cardComponent: IncompleteReportCard,
    },
    {
      title: 'Reports Needing Approval',
      data: Object.values(groupByUser(categorizedData.reportsNeedingApproval)),
      cardComponent: ReportNeedingApprovalCard,
    },
  ]
 
  console.log('Final data structure:', data)
 
  return (
    <div className="flex flex-row divide-x-2 w-full h-[calc(100vh-250px)]">
      {data.map((column: any, index: any) => (
        <React.Fragment key={index}>
          <KanbanColumn
            title={column.title}
            data={column.data}
            cardComponent={column.cardComponent}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
 
export default KanbanBoard
 
