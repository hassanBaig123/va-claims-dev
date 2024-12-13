import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileCircleQuestion,
  faBadgeCheck,
  faCircleHalfStroke,
  faCircleExclamation,
  faEdit,
} from '@fortawesome/pro-light-svg-icons'
import Link from 'next/link'
import { cn } from '@/utils'
import { Button } from '../ui/button'

import dynamic from 'next/dynamic'

const TodoStepDialog = dynamic(() => import('./todo-step-dialog'), {
  ssr: false,
})
interface SupplementalForm {
  id: string
  title: string | null
  status: 'created' | 'submitted' | 'submission_approved'
}

interface TodoSupplementalRowProps {
  formState: string | undefined
  supplementalForms: SupplementalForm[]
  intakeStatus: string
}

const getOverallStatus = (
  forms: SupplementalForm[],
  intakeStatus: string,
): string => {
  if (intakeStatus !== 'submission_approved') return 'Not Available Yet'
  if (forms.length === 0) return 'Not Available Yet'
  if (forms.every((form) => form.status === 'submission_approved'))
    return 'Completed'
  if (
    forms.some((form) => form.status === 'submitted') &&
    !forms.some((form) => form.status === 'created')
  )
    return 'Under Review'
  if (forms.some((form) => ['submitted', 'created'].includes(form.status)))
    return 'In Progress'
  return 'Not Started'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return { icon: faBadgeCheck, color: 'text-green-600' }
    case 'In Progress':
    case 'Under Review':
      return { icon: faCircleHalfStroke, color: 'text-blue-600' }
    case 'Not Started':
      return { icon: faFileCircleQuestion, color: 'text-yellow-600' }
    default:
      return { icon: faCircleExclamation, color: 'text-red-600' }
  }
}

const getFormMessage = (form: SupplementalForm): string => {
  switch (form.status) {
    case 'created':
      return 'Here is where it counts! This typically takes 5-10 minutes per sheet and gets Jordan and our medical research team the best possible view of your story. Being open and vulnerable about your true impacts allows him to write the best evidence drafts possible for you.'
    case 'submitted':
      return 'Your form has been submitted and is under review.'
    case 'submission_approved':
      return 'This form has been completed and approved.'
    default:
      return 'Form status is unknown.'
  }
}

const TodoSupplementalRow: React.FC<TodoSupplementalRowProps> = ({
  formState,
  intakeStatus,
  supplementalForms,
}) => {
  console.log(formState, 'supplementalFormssssss')

  return (
    <div className="supplemental-item">
      <div>
        {intakeStatus !== 'submission_approved' ? (
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
                Do Your Detail Builders{' '}
                <p
                  style={{
                    fontSize: '16px',
                    color: '#80030E',
                    fontWeight: 'light',
                  }}
                >
                  (Required)
                </p>
              </p>
              <p style={{ fontWeight: 'light' }} className="contentSubHeading">
                Here is where it counts! This typically takes 5-10 minutes per
                sheet and gets Jordan and our medical research team the best
                possible view of your story. <br /> Being open and vulnerable
                about your true impacts allows him to write the best evidence
                drafts possible for you.
              </p>
              {supplementalForms?.length > 0 && (
                <div className="contentButton mt-4">
                  <TodoStepDialog type="builderQA" data={{}}>
                    <Button variant={'secondary'} className="yellowBtn">
                      View your detail builder questions
                    </Button>
                  </TodoStepDialog>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {supplementalForms?.length === 0 ? (
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
                    Do Your Detail Builders{' '}
                    <p
                      style={{
                        fontSize: '16px',
                        color: '#80030E',
                        fontWeight: 'light',
                      }}
                    >
                      (Required)
                    </p>
                  </p>
                  <p
                    style={{ fontWeight: 'light' }}
                    className="contentSubHeading"
                  >
                    No detail builder forms are available at this time.
                  </p>
                </div>

                <div className="contentButton">
                  <TodoStepDialog type="builderQA" data={{}}>
                    <Button variant={'secondary'} className="yellowBtn">
                      Complete your detail builder questions
                    </Button>
                  </TodoStepDialog>
                </div>
              </div>
            ) : (
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
                    View your Detail Builder Questions{' '}
                    {supplementalForms.find(
                      (form) => form.status === 'created',
                    ) ? (
                      <p
                        style={{
                          fontSize: '16px',
                          color: '#FCA420',
                          fontWeight: 'light',
                        }}
                      >
                        (Required)
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: '16px',
                          color: '#00b67a',
                          fontWeight: 'light',
                        }}
                      >
                        (Completed)
                      </p>
                    )}
                  </p>
                  <p
                    style={{ fontWeight: 'light' }}
                    className="contentSubHeading"
                  >
                    Here is where it counts! This typically takes 5-10 minutes
                    per sheet and gets Jordan and our medical research team the
                    best possible view of your story. <br /> Being open and
                    vulnerable about your true impacts allows him to write the
                    best evidence drafts possible for you.
                  </p>
                </div>

                <div className="contentButton">
                  <TodoStepDialog type="builderQA" data={{}}>
                    <Button variant={'secondary'} className="yellowBtn">
                      View your detail builder questions
                    </Button>
                  </TodoStepDialog>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TodoSupplementalRow
