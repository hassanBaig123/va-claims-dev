// UserTodoComponent.tsx
import React from 'react'
import TodoIntakeRow from './todoIntakeRow'
import TodoSupplementalRow from './todoSupplementalRow'
import TodoDiscoveryCallRow from './todoDiscoveryCallRow'
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
  isOldUserTier,
  getStepStatuses,
  needsIntakeTier,
  isGoldOrTestTier,
  isSilverOrUpgradeTier,
  isTierThatSchedulesCall,
  getNextStepAndAccordionItem,
} from '@/utils/todos/utils'
import {
  hasUserMadePurchase,
  getUserCourseData,
  getIntroVideoStatus,
} from '@/utils/users/userManagement'

import './todo-styles.css'
import { Button } from '../ui/button'
import StepComponent from './steps-component'
import Table from './my-resources'
import MyResources from './my-resources'
import Link from 'next/link'
import CoursesStep from './course-step'
import fileIcon from '../../public/icons/file-icon.svg'
import Image from 'next/image'
import CNPCall from './cnp-call'

const TodoStepDialog = dynamic(() => import('./todo-step-dialog'), {
  ssr: false,
})

type FormStatus =
  | 'created'
  | 'submission_approved'
  | 'submitted'
  | 'customer_contacted'

export default async function UserTodoComponent() {
  const userData = await getUserData()

  const progress = 50

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
  const introVideoWatched = await getIntroVideoStatus(userData.id)

  const { displayMessage } = await getUserCourseData(userData.id)

  const stepStatuses = await getStepStatuses({
    userData,
    userTier,
    intakeForm,
    userReport,
    intakeApproved,
    introVideoWatched,
    supplementalForms,
    latestScheduledEvent,
    hasSupplementalForms,
    isTierThatSchedulesCall,
  })

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

  const fillerStyles: React.CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#616b80',
    borderRadius: 'inherit',
    textAlign: 'right',
  }

  const getAdditionalLink = () => {
    if (!additionalForm) {
      return '/additional'
    }
    return `/additional/${additionalForm.id}`
  }

  return (
    <div className="wrapper">
      <div className="header">
        <h1 className="headerTex">Next Steps</h1>
      </div>
      <div className="upperDiv">
        <div className="upperLeft">
          <StepComponent
            stepStatuses={stepStatuses}
            nextStepMessage={nextStepMessage}
            openAccordionItem={openAccordionItem}
            steps={steps({
              userMeta,
              userData,
              userTier,
              intakeForm,
              userReport,
              hasPurchase,
              intakeApproved,
              additionalForm,
              introVideoWatched,
              supplementalForms,
              latestScheduledEvent,
              hasSupplementalForms,
              isTierThatSchedulesCall,
            })}
          />
        </div>
        {/* course step */}
        <CoursesStep
          tier={userTier}
          userId={userData.id}
          hasPurchase={hasPurchase}
          displayMessage={displayMessage}
        />
      </div>
      {hasPurchase ? (
        <RequestAdditionalLetters
          {...{
            additionalForm,
            getAdditionalLink,
          }}
        />
      ) : (
        <NavigateToPlans />
      )}
      <div className="tableWrapper">
        <MyResources tier={userTier} userMeta={userMeta} />
      </div>
    </div>
  )
}

const steps = ({
  userData,
  userTier,
  intakeForm,
  userReport,
  intakeApproved,
  supplementalForms,
  introVideoWatched,
  latestScheduledEvent,
  hasSupplementalForms,
  isTierThatSchedulesCall,
}: any) =>
  [
    {
      id: 0,
      label: 'intro-video',
      content: (
        <div className="stepsContentInner">
          <div className="contentText">
            <p
              style={{
                gap: '5px',
                display: 'flex',
                fontWeight: 'normal',
                alignItems: 'center',
              }}
              className="contentHeading"
            >
              Watch an Introductory Video{' '}
              <span
                style={{
                  color: '#80030E',
                  fontSize: '16px',
                  fontWeight: 'light',
                }}
              >
                (Required)
              </span>
            </p>
            <p style={{ fontWeight: 'light' }} className="contentSubHeading">
              Welcome to VA Claims Academy! We highly recommend you start by
              watching our introductory video. This video will guide you through
              the process of using our services, what you can expect going
              forward, and provide you with helpful tips to maximize the
              benefits of this service as well as your claim with the VA.
            </p>
          </div>
          <div className="contentButton">
            <TodoStepDialog
              type="video"
              data={{
                video: {
                  videoUrl:
                    'https://player.vimeo.com/video/1021800547?h=5202f8ea3c&background=1&muted=0&cc_on=true&controls=1',
                  userId: userData.id,
                  introVideoWatched,
                },
              }}
            >
              <Button variant={'secondary'} className="yellowBtn">
                Watch video
              </Button>
            </TodoStepDialog>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      label: 'intake',
      content: needsIntakeTier(userTier) && !isOldUserTier(userTier) && (
        <TodoIntakeRow
          formState={userData.form_state}
          intakeForm={
            intakeForm
              ? { id: intakeForm.id, status: intakeForm.status }
              : undefined
          }
          hasSupplementalForms={hasSupplementalForms}
        />
      ),
    },
    {
      id: 2,
      label: 'supplemental',
      content: (isGoldOrTestTier(userTier) ||
        isSilverOrUpgradeTier(userTier) ||
        hasSupplementalForms) &&
        !isOldUserTier(userTier) && (
          <TodoSupplementalRow
            formState={userData.form_state}
            supplementalForms={supplementalForms}
            intakeStatus={intakeForm?.status || ''}
          />
        ),
    },
    {
      id: 3,
      label: 'discovery-call',
      content: isTierThatSchedulesCall(userTier) && (
        <TodoDiscoveryCallRow
          intakeApproved={intakeApproved}
          supplementalForms={supplementalForms}
          scheduledEvent={latestScheduledEvent}
          userEmail={userData.email || ''}
          userId={userData.id}
        />
      ),
    },
    {
      id: 4,
      label: 'CNPCall',
      content: isGoldOrTestTier(userTier) && (
        <CNPCall
          intakeApproved={intakeApproved}
          supplementalForms={supplementalForms}
          scheduledEvent={latestScheduledEvent}
          userEmail={userData.email || ''}
          userId={userData.id}
        />
      ),
    },
    {
      id: 5,
      label: 'TodoReportRow',
      content:
        isGoldOrTestTier(userTier) && userReport ? (
          <TodoReportRow report={userReport} />
        ) : (
          ''
        ),
    },
  ].filter((step) => step.content)

const RequestAdditionalLetters = ({
  additionalForm,
  getAdditionalLink,
}: any) => (
  <div className="middleSection">
    <div>
      <Image src={fileIcon} alt="fileIcon" />
    </div>
    <div>
      <p className="midHeading">
        Request Additional Nexus Letters or Personal Statement
        <span className="midHeadingSmall">(If Needed)</span>
      </p>
      <p className="midSubHeading">
        If you need additional custom Nexus Letters or Personal Statement drafts
        written by Jordan, click the blue button below. On the next page, you
        can select the conditions you want evidence for and choose which kind of
        letters you need.
      </p>
    </div>
    <div>
      {(!additionalForm ||
        additionalForm.status === 'created' ||
        additionalForm.status === 'submission_approved' ||
        (additionalForm.status as FormStatus) === 'customer_contacted' ||
        additionalForm.status === 'submitted') && (
        <Link href={getAdditionalLink()}>
          <Button variant={'destructive'} className="reviewBtn">
            {additionalForm &&
            (additionalForm.status as FormStatus) === 'customer_contacted'
              ? 'Review Additional Form'
              : 'Request Additional Letters'}
          </Button>
        </Link>
      )}
    </div>
  </div>
)

const NavigateToPlans = () => (
  <div className="middleSection">
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Image
        src="/imgs/ironclad_guarantee.png"
        alt="fileIcon"
        width={100}
        height={100}
        className={`w-[100px] h-[100px]`}
      />

      <div>
        <p className="midHeading">Ready to Get Serious About Your Claim?</p>
        <p className="midSubHeading">
          Find out how you can get individual help to finally set the record
          straight
        </p>
      </div>
    </div>

    <div>
      <Link href={'/'}>
        <Button variant={'secondary'} className="yellowBtn">
          Learn More
        </Button>
      </Link>
    </div>
  </div>
)
