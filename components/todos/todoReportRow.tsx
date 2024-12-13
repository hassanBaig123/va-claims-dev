import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileLines,
  faBadgeCheck,
  faCircleHalfStroke,
  faCircleExclamation,
} from '@fortawesome/pro-light-svg-icons'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils'
import { Report } from '@/utils/todos/dataAccess'

interface TodoReportRowProps {
  report: Report | null
}

const TodoReportRow: React.FC<TodoReportRowProps> = ({ report }) => {
  const getReportStatus = () => {
    if (!report) {
      return {
        status: 'Coming Soon',
        icon: faCircleExclamation,
        color: 'text-yellow-600',
      }
    }
    switch (report.status) {
      case 'created':
        return {
          status: 'Getting Started',
          icon: faCircleExclamation,
          color: 'text-red-600',
        }
      case 'questions_approved':
        return {
          status: 'In Progress',
          icon: faCircleHalfStroke,
          color: 'text-blue-600',
        }
      case 'submitted':
        return {
          status: 'Under Review',
          icon: faCircleHalfStroke,
          color: 'text-blue-600',
        }
      case 'customer_contacted':
        return {
          status: 'Action Required',
          icon: faCircleExclamation,
          color: 'text-yellow-600',
        }
      case 'submission_approved':
        return { status: 'Ready', icon: faBadgeCheck, color: 'text-green-600' }
      default:
        return {
          status: 'Unknown',
          icon: faCircleExclamation,
          color: 'text-gray-600',
        }
    }
  }

  if (report?.status !== 'submission_approved') {
    return null
  }

  const { status, icon, color } = getReportStatus()
  const getMessage = () => {
    if (!report) {
      return 'Please check back later.'
    }
    switch (report.status) {
      case 'created':
        return 'Your VetVictory Claim Guide is being written. Please check back later.'
      case 'questions_approved':
        return 'Your VetVictory Claim Guide is being written. Please check back soon.'
      case 'submitted':
        return "Your VetVictory Claim Guide is under review. We'll notify you when it's ready."
      case 'customer_contacted':
        return 'We need additional information for your VetVictory Claim Guide. Please check your email for instructions.'
      case 'submission_approved':
        return 'Your VetVictory Claim Guide is ready. Click the button below to view it.'
      default:
        return 'VetVictory Claim Guide status is unknown. Please contact support if this persists.'
    }
  }

  return (
    <div className="accordion-item">
      <div
        className={cn(
          'hover:bg-slate-100 min-h-[10rem] sm:min-h-7 accordion-trigger',
        )}
      >
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex w-full md:w-auto items-center">
            <FontAwesomeIcon
              icon={faFileLines}
              className="w-4 h-4 md:w-7 md:h-7 mr-2"
            />
            <span className="w-full md:w-auto text-lg font-light">
              View Your VetVictory Claim Guide
            </span>
          </div>
          <div
            className={`flex w-full md:w-auto mt-5 md:mt-0 justify-center items-center ${color} mr-6`}
          >
            <span className="mr-3">{status}</span>
            <FontAwesomeIcon
              icon={icon}
              className="w-4 h-4 md:w-7 md:h-7 ml-2"
            />
          </div>
        </div>
      </div>
      <div className="accordion-content">
        <p className="text-md text-gray-700 mt-4 px-6 py-2">{getMessage()}</p>
        {report && report.status === 'submission_approved' && (
          <div className="flex justify-end">
            <Link
              href="/report"
              className={`${buttonVariants({
                variant: 'outline',
              })} mt-4 bg-blue-700 text-white mr-5`}
            >
              View VetVictory Claim Guide
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoReportRow
