
import { DateTime } from 'luxon'
import { checkNotesExistence } from './dataAccess'
import {
  UserTier,
  TIERS_OLD_USER,
  TIERS_GOLD_OR_TEST,
  TIERS_NEEDING_INTAKE,
  TIERS_TAKING_COURSES,
  TIERS_SCHEDULING_CALL,
  TIERS_SILVER_OR_UPGRADE,
} from './constants'
import { getIntroVideoStatus } from '../users/userManagement'

export function needsIntakeTier(tier: UserTier): boolean {
  return TIERS_NEEDING_INTAKE.includes(tier)
}

export function isTierThatTakesCourses(tier: UserTier): boolean {
  return TIERS_TAKING_COURSES.includes(tier)
}

export function isTierThatSchedulesCall(tier: UserTier): boolean {
  console.log('Tier:', tier)
  return TIERS_SCHEDULING_CALL.includes(tier)
}

export function isGoldOrTestTier(tier: UserTier): boolean {
  return TIERS_GOLD_OR_TEST.includes(tier)
}

export function isOldUserTier(tier: UserTier): boolean {
  return TIERS_OLD_USER.includes(tier)
}

export function isSilverOrUpgradeTier(tier: UserTier): boolean {
  return TIERS_SILVER_OR_UPGRADE.includes(tier)
}

export async function getNextStepAndAccordionItem(
  userTier: string,
  intakeForm: any,
  supplementalForms: any[],
  hasSupplementalForms: boolean,
  intakeApproved: boolean,
  latestScheduledEvent: any,
  userData: any,
  userReport: any,
  hasPurchase: boolean
): Promise<{ nextStepMessage: string; openAccordionItem: string }> {
  if (!hasPurchase) {
    return {
      nextStepMessage: "Learn More About the VA Claims Process",
      openAccordionItem: "intro-video"
    }
  }

  let nextStepMessage = ''
  let openAccordionItem = ''

  const supplementalFormsReadyForCall = supplementalForms.every(form =>
    form.status === 'submitted' || form.status === 'submission_approved'
  )

  if (isGoldOrTestTier(userTier as UserTier) && userReport && userReport.status === 'submission_approved') {
    nextStepMessage = 'Your report is ready! Review it now.'
    openAccordionItem = 'report'
  } else if (isTierThatSchedulesCall(userTier as UserTier)) {
    if (isOldUserTier(userTier as UserTier)) {
      if (!latestScheduledEvent) {
        nextStepMessage = 'Schedule Your Discovery Call'
        openAccordionItem = 'discovery-call'
      } else if (latestScheduledEvent.start_time) {
        const eventDateTime = DateTime.fromISO(latestScheduledEvent.start_time)
        if (eventDateTime > DateTime.now()) {
          nextStepMessage = `Your Discovery Call is scheduled for ${eventDateTime.toLocaleString(
            DateTime.DATETIME_FULL,
          )}`
        } else {
          const notesExist = await checkNotesExistence(latestScheduledEvent.id)
          if (!notesExist) {
            nextStepMessage =
              'Your Discovery Call has completed and notes about your case are being prepared.'
          } else if (
            latestScheduledEvent.status !== 'created' &&
            latestScheduledEvent.status !== 'submission_approved'
          ) {
            nextStepMessage =
              'The notes from your Discovery call are being reviewed.'
          } else {
            nextStepMessage =
              'You have completed your Discovery Call and your case is being reviewed.'
          }
        }
      }
    } else if (
      isGoldOrTestTier(userTier as UserTier) ||
      isSilverOrUpgradeTier(userTier as UserTier)
    ) {
      if (!intakeForm || intakeForm.status === 'created') {
        nextStepMessage = 'Complete your Intake Form'
        openAccordionItem = 'intake'
      } else if (intakeForm.status === 'submitted') {
        openAccordionItem = 'intake'
        nextStepMessage =
          'Your Intake Form is being reviewed. Please check back later.'
      } else if (intakeApproved) {
        console.log('----', latestScheduledEvent, supplementalFormsReadyForCall)
        if (!supplementalFormsReadyForCall) {
          nextStepMessage = 'Complete Your Detail Builder Forms'
          openAccordionItem = 'supplemental'
        } else if (
          !latestScheduledEvent ||
          latestScheduledEvent.status === 'customer_contacted' || latestScheduledEvent.status === 'created'
        ) {
          nextStepMessage = 'Schedule Your Discovery Call'
          openAccordionItem = 'discovery-call'
        } else if (isGoldOrTestTier(userTier as UserTier) && userReport) {
          if (userReport.status === 'created') {
            nextStepMessage = 'Your report is being prepared. Check back soon!'
          } else if (userReport.status === 'questions_approved' || userReport.status === 'submitted') {
            nextStepMessage = "Your report is in progress. We'll notify you when it's ready."
          } else if (userReport.status === 'customer_contacted') {
            nextStepMessage = 'Action required for your report. Check your email for details.'
          }
          openAccordionItem = 'report'
        } else {
          nextStepMessage = "Learn More About the VA Claims Process",
            openAccordionItem = "intro-video"
        }
      }
    }
  } else {

    nextStepMessage = "Learn More About the VA Claims Process",
      openAccordionItem = "intro-video"


  }

  return { nextStepMessage, openAccordionItem }
}

export const getStepStatuses = async ({
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
}: any): Promise<Record<string, boolean>> => {
  const supplementalFormsReadyForCall = supplementalForms.length ? supplementalForms.every(
    (form: any) => form.status === 'submission_approved'
  ) : false;



  return {
    'intro-video': introVideoWatched,
    intake: needsIntakeTier(userTier) &&
      !isOldUserTier(userTier) &&
      intakeForm?.status === 'submission_approved',
    supplemental: (isGoldOrTestTier(userTier) ||
      isSilverOrUpgradeTier(userTier) ||
      hasSupplementalForms) &&
      !isOldUserTier(userTier) &&
      supplementalFormsReadyForCall,
    'discovery-call': false || isTierThatSchedulesCall(userTier) &&
      (!!latestScheduledEvent || intakeApproved),
    CNPCall: isGoldOrTestTier(userTier) &&
      !!latestScheduledEvent &&
      intakeApproved,
    TodoReportRow: isGoldOrTestTier(userTier) &&
      !!userReport &&
      userReport.status === 'submission_approved',
  };
}
