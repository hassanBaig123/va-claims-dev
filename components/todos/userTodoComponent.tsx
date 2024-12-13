// UserTodoComponent.tsx

import React from 'react'
import { Accordion } from '@/components/ui/accordion'
import TodoIntroVideo from './todoIntroVideo'
import TodoIntakeRow from './todoIntakeRow'
import TodoAdditionalRequestRow from './todoAdditionalRequestRow'
import TodoSupplementalRow from './todoSupplementalRow'
import TodoDiscoveryCallRow from './todoDiscoveryCallRow'
import TodoCoursesRow from './todoCoursesRow'
import TodoNextStep from './todoNextStep'
import TodoJoinBoardroom from './todoJoinBoardroom'
import TodoReportRow from './todoReportRow'
import dynamic from 'next/dynamic'
import {
  getUserData,
  getUserForms,
  getUserTier,
  getLatestScheduledEvent,
  getUserReport,
  getUserMeta,
} from '@/utils/todos/dataAccess'
import {
  needsIntakeTier,
  isTierThatSchedulesCall,
  isGoldOrTestTier,
  isSilverOrUpgradeTier,
  isOldUserTier,
  getNextStepAndAccordionItem,
} from '@/utils/todos/utils'
import {
  hasUserMadePurchase,
  getUserCourseData,
} from '@/utils/users/userManagement'

const TodoMaterialsRow = dynamic(() => import('./todoMaterialsRow'), {
  ssr: false,
})

const ClientReferralDialog = dynamic(() => import('./todo-referral-dialog'), {
  ssr: false,
})

export default async function UserTodoComponent() {
  const userData = await getUserData()

  if (!userData) {
    return (
      <div className="w-full">
        <div className="w-full">
          Please log in to view your todo list. If you're already logged in,
          there might be an issue loading your data. Try refreshing the page or
          contact support if the problem persists.
        </div>
      </div>
    )
  }

  const userForms = await getUserForms(userData.id)
  const userMeta: any = await getUserMeta(userData.id)

  const userTier = await getUserTier(userData.id)
  const latestScheduledEvent = await getLatestScheduledEvent(
    userData.id,
    userData.email || '',
  )
  const userReport = await getUserReport(userData.id)

  const intakeForm = userForms.find((form) => form.type === 'intake')
  const additionalForm = userForms.find((form) => form.type === 'additional')
  const supplementalForms = userForms.filter(
    (form) => form.type === 'supplemental',
  )
  const hasSupplementalForms = supplementalForms.length > 0

  const intakeApproved = isOldUserTier(userTier)
    ? true
    : intakeForm?.status === 'submission_approved'

  const hasPurchase = await hasUserMadePurchase(userData.id)
  console.log('hasPurchase', hasPurchase)

  const { displayMessage } = await getUserCourseData(userData.id)

  const { nextStepMessage, openAccordionItem } =
    await getNextStepAndAccordionItem(
      userTier,
      intakeForm,
      supplementalForms,
      hasSupplementalForms,
      intakeApproved,
      latestScheduledEvent,
      userData,
      userReport,
      hasPurchase,
    )

  return (
    <div className="w-full">
      {!!userMeta && !userMeta?.isDownloaded && (
        <ClientReferralDialog userMeta={userMeta} userId={userData.id} />
      )}
      <TodoNextStep message={nextStepMessage} />
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={openAccordionItem}
      >
        <TodoIntroVideo />
        {needsIntakeTier(userTier) && !isOldUserTier(userTier) && (
          <TodoIntakeRow
            formState={userData.form_state}
            intakeForm={
              intakeForm
                ? { id: intakeForm.id, status: intakeForm.status }
                : undefined
            }
            hasSupplementalForms={hasSupplementalForms}
          />
        )}

        {(isGoldOrTestTier(userTier) ||
          isSilverOrUpgradeTier(userTier) ||
          hasSupplementalForms) &&
          !isOldUserTier(userTier) && (
            <TodoSupplementalRow
              formState={userData.form_state}
              supplementalForms={supplementalForms}
              intakeStatus={intakeForm?.status || ''}
            />
          )}
        {isTierThatSchedulesCall(userTier) && (
          <TodoDiscoveryCallRow
            intakeApproved={intakeApproved}
            supplementalForms={supplementalForms}
            scheduledEvent={latestScheduledEvent}
            userEmail={userData.email || ''}
            userId={userData.id}
          />
        )}
        {isGoldOrTestTier(userTier) && <TodoReportRow report={userReport} />}
        <TodoCoursesRow
          tier={userTier}
          userId={userData.id}
          displayMessage={displayMessage}
        />

        {hasPurchase && (
          <TodoAdditionalRequestRow
            formState={userData.form_state}
            additionalForm={
              additionalForm
                ? { id: additionalForm.id, status: additionalForm.status }
                : undefined
            }
            hasSupplementalForms={hasSupplementalForms}
            intakeStatus={intakeForm?.status || ''}
          />
        )}

        {userTier && hasPurchase && (
          <>
            <TodoJoinBoardroom />
            <TodoMaterialsRow tier={userTier} />
          </>
        )}
      </Accordion>
    </div>
  )
}
