import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import {
  faPenToSquare,
  faBadgeCheck,
  faCircleHalfStroke,
  faCircleExclamation,
} from '@fortawesome/pro-light-svg-icons'

interface IntakeForm {
  id: string
  status:
    | 'created'
    | 'questions_approved'
    | 'submitted'
    | 'customer_contacted'
    | 'submission_approved'
    | null
}

interface TodoIntakeRowProps {
  formState: string | undefined
  intakeForm: IntakeForm | undefined
  hasSupplementalForms: boolean
}

const TodoIntakeRow: React.FC<TodoIntakeRowProps> = ({
  formState,
  intakeForm,
  hasSupplementalForms,
}) => {
  const getIntakeStatus = () => {
    console.log('Intake Form:', intakeForm)
    if (!intakeForm || intakeForm.status === 'created') {
      return {
        status: 'Not Completed',
        icon: faPenToSquare,
        color: 'text-red-600',
      }
    }
    switch (intakeForm.status) {
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

  const { status, icon, color } = getIntakeStatus()

  const getMessage = () => {
    if (!intakeForm || intakeForm.status === 'created') {
      return 'This should take 10-15 minutes and will help Jordan write your evidence drafts.'
    }
    switch (intakeForm.status) {
      case 'submitted':
        return 'Thank you for your submission. Your intake is currently under review.'
      case 'customer_contacted':
        return "We've contacted you about your intake. Please check your email and complete any requested actions."
      case 'submission_approved':
        return hasSupplementalForms
          ? 'Thank you for completing your intake. Please proceed to complete your supplemental forms.'
          : 'Thank you for completing your intake.'
      default:
        return 'Please complete your intake form.'
    }
  }

  const getIntakeLink = () => {
    if (!intakeForm) {
      return '/intake'
    }
    return `/intake/${intakeForm.id}`
  }

  return (
    <div className="accordion-item" style={{ width: '100%' }}>
      <div className="stepsContentInner">
        <div className="contentText">
          <p
            style={{
              fontWeight: 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
            className="contentHeading"
          >
            Fill Out Your Intake Sheet
            <span
              style={{
                fontSize: '16px',
                color:
                  intakeForm && intakeForm.status === 'submission_approved'
                    ? '#00b67a'
                    : intakeForm && intakeForm.status === 'submitted'
                    ? '#2863eb'
                    : '#80030E',
                fontWeight: 'light',
              }}
            >
              {intakeForm && intakeForm.status === 'submission_approved'
                ? '(Completed)'
                : intakeForm && intakeForm.status === 'submitted'
                ? '(Under Review)'
                : '(Required)'}
            </span>
          </p>
          <p style={{ fontWeight: 'light' }} className="contentSubHeading">
            {getMessage()}
            {/* Detail builder forms will be available after your intake form is
            approved. */}
          </p>
        </div>
        <div className="contentButton">
          {(!intakeForm ||
            intakeForm.status === 'created' ||
            intakeForm.status === 'customer_contacted') && (
            <div className="flex justify-end">
              <Link
                href={getIntakeLink()}
                // className={`${buttonVariants({
                //   variant: 'outline',
                // })} mt-4 bg-blue-700 text-white mr-5`}
              >
                <Button variant={'secondary'} className="yellowBtn">
                  {intakeForm && intakeForm.status === 'customer_contacted'
                    ? 'Review Intake Form'
                    : 'Complete Intake Form'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* <div className="accordion-content">
        <p className="text-md text-gray-700 mt-4 px-6 py-2">{getMessage()}</p>
        {(!intakeForm ||
          intakeForm.status === 'created' ||
          intakeForm.status === 'customer_contacted' ||
          intakeForm.status === 'submitted') && (
          <div className="flex justify-end">
            <Link
              href={getIntakeLink()}
              className={`${buttonVariants({
                variant: 'outline',
              })} mt-4 bg-blue-700 text-white mr-5`}
            >
              {intakeForm && intakeForm.status === 'customer_contacted'
                ? 'Review Intake Form'
                : 'Complete Intake Form'}
            </Link>
          </div>
        )}
      </div> */}
    </div>
  )
}

export default TodoIntakeRow
