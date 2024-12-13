import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faBadgeCheck,
  faCircleHalfStroke,
  faCircleExclamation,
} from '@fortawesome/pro-light-svg-icons'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils'

interface AdditionalRequestForm {
  id: string
  status:
    | 'created'
    | 'questions_approved'
    | 'submitted'
    | 'customer_contacted'
    | 'submission_approved'
    | null
}

interface TodoAdditionalRequestRowProps {
  formState: string | undefined
  additionalForm: AdditionalRequestForm | undefined
  hasSupplementalForms: boolean
  intakeStatus: string
}

const TodoAdditionalRequestRow: React.FC<TodoAdditionalRequestRowProps> = ({
  formState,
  additionalForm,
  hasSupplementalForms,
  intakeStatus,
}) => {
  const getAdditionalStatus = () => {
    // if (intakeStatus !== 'submission_approved') { return { status: 'Not Available Yet', icon: faCircleExclamation, color: 'text-red-600' } }
    if (!additionalForm || additionalForm.status === 'created') {
      return {
        status: 'Not Completed',
        icon: faPenToSquare,
        color: 'text-red-600',
      }
    }
    switch (additionalForm.status) {
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
        return {
          status: 'Complete',
          icon: faBadgeCheck,
          color: 'text-green-600',
        }
      default:
        return {
          status: 'In Progress',
          icon: faCircleHalfStroke,
          color: 'text-blue-600',
        }
    }
  }

  const { status, icon, color } = getAdditionalStatus()

  const getMessage = () => {
    // if (!additionalForm || additionalForm.status === 'created') {
    //   return "Please complete your additional request form to begin the process.";
    // }
    switch (additionalForm?.status) {
      case 'submitted':
        return 'Thank you for your submission. Your additional request is currently under review.'
      case 'customer_contacted':
        return "We've contacted you about your additional request. Please check your email and complete any requested actions."
      case 'submission_approved':
        return hasSupplementalForms
          ? 'Thank you for completing your additional request. Please proceed to complete your supplemental forms.'
          : 'Thank you for completing your additional request.'
      default:
        return 'If you need additional custom Nexus Letters or Personal Statement drafts written by Jordan, click the blue button below. On the next page, you can select the conditions you want evidence for and choose which kind of letters you need.'
    }
  }

  const getAdditionalLink = () => {
    if (!additionalForm) {
      return '/additional'
    }
    return `/additional/${additionalForm.id}`
  }

  return (
    <div>
      <div className={cn('hover:bg-slate-100 min-h-[10rem] sm:min-h-7')}>
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex w-full md:w-auto items-center">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="w-4 h-4 md:w-7 md:h-7 mr-2"
            />
            <span className="w-full md:w-auto text-lg font-light">
              <span>
                Request Additional Nexus Letters or Personal Statements
              </span>
              <span className="text-xs md:text-sm ml-4 text-amber-500 todo-requirement">
                If Needed
              </span>
            </span>
          </div>
          <div
            className={`flex w-full md:w-auto mt-5 md:mt-0 justify-center items-center ${color} mr-6`}
          >
            {/* <span className="mr-3">{status}</span> */}
            {/* <FontAwesomeIcon
              icon={icon}
              className="w-4 h-4 md:w-7 md:h-7 ml-2"
            /> */}
          </div>
        </div>
      </div>
      <div>
        {intakeStatus === 'submission_approvedRemoved' ? (
          <p className="text-md text-gray-700 mt-4 px-6 py-2">
            Additional request forms will be available after your intake form is
            approved.
          </p>
        ) : (
          <>
            <p className="text-md text-gray-700 mt-4 px-6 py-2">
              {getMessage()}
            </p>
            {(!additionalForm ||
              additionalForm.status === 'created' ||
              additionalForm.status === 'customer_contacted' ||
              additionalForm.status === 'submitted') && (
              <div className="flex justify-end">
                <Link
                  href={getAdditionalLink()}
                  className={`${buttonVariants({
                    variant: 'outline',
                  })} mt-4 bg-blue-700 text-white mr-5`}
                >
                  {additionalForm &&
                  additionalForm.status === 'customer_contacted'
                    ? 'Review Additional Form'
                    : 'Request Additional Letters'}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TodoAdditionalRequestRow
