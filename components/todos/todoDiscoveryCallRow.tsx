'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhone,
  faBadgeCheck,
  faCircleHalfStroke,
  faClock,
} from '@fortawesome/pro-light-svg-icons'
import dynamic from 'next/dynamic'
import { DateTime } from 'luxon'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TodoStepDialog from './todo-step-dialog'

const InlineWidget = dynamic(
  () => import('react-calendly').then((mod) => mod.InlineWidget),
  { ssr: false },
)

interface ScheduledEvent {
  id: string
  created_at: string
  user_id: string
  start_time: string | null
  status:
    | 'created'
    | 'questions_approved'
    | 'submitted'
    | 'customer_contacted'
    | 'submission_approved'
  updated_at: string
}

interface TodoDiscoveryCallRowProps {
  intakeApproved: boolean
  supplementalForms: { status: string }[]
  scheduledEvent: ScheduledEvent | null
  userEmail: string
  userId: string
}

const TodoDiscoveryCallRow: React.FC<TodoDiscoveryCallRowProps> = ({
  intakeApproved,
  supplementalForms,
  scheduledEvent,
  userEmail,
  userId,
}) => {
  const [isRescheduling, setIsRescheduling] = useState(false)
  const router = useRouter()

  const isEventPast = (event: ScheduledEvent | null) => {
    return (
      event?.start_time && DateTime.fromISO(event.start_time) < DateTime.now()
    )
  }

  const canScheduleOrReschedule = () => {
    if (!scheduledEvent) return true
    if (scheduledEvent.status === 'customer_contacted') return true
    if (isEventPast(scheduledEvent)) return true
    return false
  }

  const canScheduleCall = () => {
    return (
      intakeApproved &&
      supplementalForms.every(
        (form) =>
          form.status === 'submitted' || form.status === 'submission_approved',
      )
    )
  }

  console.log(canScheduleCall(), 'canScheduleCall')

  const getStatus = () => {
    if (!intakeApproved || !canScheduleCall()) {
      return { status: 'Pending', icon: faClock, color: 'text-gray-400' }
    }
    if (scheduledEvent && scheduledEvent.start_time) {
      if (scheduledEvent.status === 'customer_contacted') {
        return {
          status: 'Call Completed',
          icon: faBadgeCheck,
          color: 'text-green-600',
        }
      }
      if (isEventPast(scheduledEvent)) {
        return {
          status: 'Call Completed',
          icon: faBadgeCheck,
          color: 'text-green-600',
        }
      }
      return {
        status: 'Call Scheduled',
        icon: faCircleHalfStroke,
        color: 'text-blue-600',
      }
    }
    return {
      status: 'Ready to Schedule',
      icon: faPhone,
      color: 'text-blue-600',
    }
  }

  const { status, icon, color } = getStatus()

  const getMessage = () => {
    if (!intakeApproved || !canScheduleCall()) {
      return ' We are in your corner! Your Discovery Expert will ask you specific questions at the direction of Jordan and our Medical Research Team. The questions we ask will all depend on what we know the VA will need to hear in order to see your story in the most favorable way possible. Set aside up to 30 minutes, but this call can often be completed around 15-20 mins.'
    }
    if (scheduledEvent && scheduledEvent.start_time) {
      const callTime = DateTime.fromISO(
        scheduledEvent.start_time,
      ).toLocaleString(DateTime.DATETIME_FULL)
      if (
        scheduledEvent.status === 'customer_contacted' ||
        isEventPast(scheduledEvent)
      ) {
        return `Your call was completed on ${callTime}. Our team is reviewing the notes from your call.`
      }
      return `Your call is scheduled for ${callTime}.`
    }
    return 'Please use the calendar below to schedule your discovery call with a specialist.'
  }

  const handleReschedule = async () => {
    if (
      window.confirm(
        'Are you sure you want to reschedule? You will lose your current spot.',
      )
    ) {
      setIsRescheduling(true)
      try {
        const response = await fetch('/api/reschedule-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventUri: scheduledEvent?.id,
            userEmail: userEmail,
            userId: userId,
          }),
        })

        if (response.ok) {
          router.refresh()
        } else {
          throw new Error('Failed to reschedule')
        }
      } catch (error) {
        console.error('Error rescheduling:', error)
        alert('Failed to reschedule. Please try again or contact support.')
      } finally {
        setIsRescheduling(false)
      }
    }
  }

  console.log(
    status,
    'status----------------------------------------------------------------',
  )

  return (
    <div className="accordion-item">
      {/* <div
        className={cn(
          'hover:bg-slate-100 min-h-[10rem] sm:min-h-7 accordion-trigger',
        )}
      >
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex w-full md:w-auto items-center">
            <FontAwesomeIcon
              icon={faPhone}
              className="w-4 h-4 md:w-7 md:h-7 mr-2"
            />
            <span className="w-full md:w-auto text-lg font-light">
              {scheduledEvent && isEventPast(scheduledEvent)
                ? 'Discovery Call Completed'
                : 'Schedule Your Discovery Call'}
              <span className="text-xs md:text-sm ml-4 text-red-500 todo-requirement">
                *Required
              </span>
            </span>
          </div>
          <div
            className={`flex w-full md:w-auto mt-5 md:mt-0 justify-center ${color} mr-6`}
          >
            <span className="mr-3">{status}</span>
            <FontAwesomeIcon
              icon={icon}
              className="w-4 h-4 md:w-7 md:h-7 ml-2"
            />
          </div>
        </div>
      </div> */}
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
            {scheduledEvent && isEventPast(scheduledEvent)
              ? 'Discovery Call Completed'
              : 'Schedule your Discovery Call'}
            <p
              style={{
                fontSize: '16px',
                color: status === 'Call Completed' ? '#00b67a' : '#FCA420',
                fontWeight: 'light',
              }}
            >
              {status === 'Call Completed' ? '(Completed)' : ` (Required)`}
            </p>
          </p>
          <p style={{ fontWeight: 'light' }} className="contentSubHeading">
            We are in your corner! Your Discovery Expert will ask you specific
            questions at the direction of Jordan and our Medical Research Team.
            <br />
            The questions we ask will all depend on what we know the VA will
            need to hear in order to see your story in the most favorable way
            possible. Set aside up to 30 minutes, but this call can often be
            completed around 15-20 mins.
          </p>
          {canScheduleCall() && (
            <>
              {canScheduleOrReschedule() ? (
                <div className="mt-4">
                  <TodoStepDialog
                    type="scheduleCall"
                    data={{ scheduleCall: { isDiscoveryCall: true } }}
                  >
                    <Button
                      variant={'secondary'}
                      className="yellowBtn"
                      disabled={isRescheduling}
                    >
                      {'Schedule Call'}
                    </Button>
                  </TodoStepDialog>
                </div>
              ) : (
                <div className="mt-4 px-6">
                  <p className="mb-2">
                    You have a call scheduled. Please call +1 210-201-2727 at
                    your scheduled time. If you need to reschedule, please use
                    the button below.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="contentButton">
          {canScheduleCall() && !canScheduleOrReschedule() && (
            <Button
              variant={'secondary'}
              onClick={handleReschedule}
              className="yellowBtn"
              disabled={isRescheduling}
            >
              {isRescheduling ? 'Rescheduling...' : 'Click Here to Schedule'}
            </Button>
          )}
        </div>
      </div>
      {/* <div className="accordion-content">
        <p className="text-md text-gray-700 mt-4 px-6 py-2">{getMessage()}</p>
        {canScheduleCall() && (
          <>
            {canScheduleOrReschedule() ? (
              <div className="mt-4">
                <InlineWidget url="https://calendly.com/grandmasteronboarding/30min" />
              </div>
            ) : (
              <div className="mt-4 px-6">
                <p className="mb-2">
                  You have a call scheduled. Please call +1 210-201-2727 at your
                  scheduled time. If you need to reschedule, please use the
                  button below.
                </p>
                <Button onClick={handleReschedule} disabled={isRescheduling}>
                  {isRescheduling ? 'Rescheduling...' : 'Reschedule Call'}
                </Button>
              </div>
            )}
          </>
        )}
      </div> */}
    </div>
  )
}

export default TodoDiscoveryCallRow
