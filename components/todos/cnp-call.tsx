'use client'

import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import TodoStepDialog from './todo-step-dialog'

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

const CNPCall: React.FC<TodoDiscoveryCallRowProps> = ({
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

  const canScheduleCall = () => {
    return (
      intakeApproved &&
      supplementalForms.every(
        (form) =>
          form.status === 'submitted' || form.status === 'submission_approved',
      )
    )
  }

  const getMessage = () => {
    if (!intakeApproved || !canScheduleCall()) {
      return "You've made it! We know how it feels to be nervous in this step. You are already more prepared than 90% of other veterans, but this call is to calm any last minute uncertainties you may have so you can get in there and knock it out of the park."
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
    return 'Please use the calendar below to schedule your Pre-C&P Exam Call with a specialist.'
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

  return (
    <div className="accordion-item">
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
              : 'Schedule Your Pre-C&P Exam Call'}
            <p
              style={{
                fontSize: '16px',
                color: '#FCA420',
                fontWeight: 'light',
              }}
            >
              (Required)
            </p>
          </p>
          <p style={{ fontWeight: 'light' }} className="contentSubHeading">
            {getMessage()}
          </p>
        </div>

        <div className="contentButton">
          <TodoStepDialog
            type="scheduleCall"
            data={{
              scheduleCall: {
                isDiscoveryCall: false,
              },
            }}
          >
            <Button
              variant={'secondary'}
              onClick={handleReschedule}
              className="yellowBtn"
              disabled={isRescheduling}
            >
              {isRescheduling ? 'Rescheduling...' : 'Click Here to Schedule'}
            </Button>
          </TodoStepDialog>
        </div>
      </div>
    </div>
  )
}

export default CNPCall
