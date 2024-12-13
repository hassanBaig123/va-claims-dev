'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Separator } from '../ui/separator'
import { DateTime } from 'luxon'
import ViewerModal from './viewer-modal'
import { FormViewerContent } from './viewer-modal-forms/form-viewer-content'
import { EmailSentViewerContent } from './viewer-modal-forms/email-sent-viewer'
import { ReportViewerContent } from './viewer-modal-forms/report-viewer-content'
import { NotesViewerContent } from './viewer-modal-forms/notes-viewer-content'
import { ScheduledEventViewerContent } from './viewer-modal-forms/scheduled-event-content'
import {
  handleEmailClick,
  handleViewClick,
  handleUpdateNotes,
  approveForm,
  approveReport,
  approveNotes,
  sendReminder,
} from './kanban-forms-helpers'
import { useLoading } from '@/lib/hooks/use-loading'
import DynamicReport from '@/components/report/DynamicReport'
import { MouseEventHandler, useEffect, useState } from 'react'
import { CustomerInfoDialog } from './customer-info-dialog'
import { useQuery } from 'react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { validateReport } from '@/lib/validations/report.validator';
import { Progress } from '../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface EmailDialogProps {
  isOpen: boolean
  onClose: () => void
  onSend: (message: string) => void
  defaultMessage: string
  title?: string
  btnText?: string
}

interface CustomCardProps {
  item: any
  user?: any
  children?: any
  loading?: boolean
}

export const EmailDialog: React.FC<EmailDialogProps> = ({
  isOpen,
  onClose,
  onSend,
  defaultMessage,
  title = 'Customize Email Message',
  btnText = 'Send Email',
}) => {
  const [emailMessage, setEmailMessage] = useState(defaultMessage || '')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={emailMessage}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEmailMessage(e.target.value)
            }
            rows={5}
            placeholder="Enter your custom message here..."
            className="col-span-3 bg-slate-500"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSend(emailMessage)
              onClose()
            }}
          >
            {btnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const CustomCard = ({ item, user, children, loading }: CustomCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

  const userId = item?.users?.id || item?.user_id

  const blackFridayPurchase = item?.meta?.find?.(
    (m: any) => m?.meta_value === 'BLACK FRIDAY PROMO',
  )

  const { data: formsData, refetch: refetchForms } = useQuery(
    ['forms', userId],
    async () => {
      if (!userId) return []
      const response = await fetch(`/api/user/${userId}/forms`)
      if (!response.ok) {
        throw new Error('Failed to fetch forms')
      }
      return response.json()
    },
    { enabled: false },
  )

  const {
    data: discoveryCallData,
    refetch: refetchDiscoveryCall,
    error: discoveryCallError,
  } = useQuery(
    ['discoveryCall', userId],
    async () => {
      if (!userId) return null
      const response = await fetch(`/api/user/${userId}/events`)
      if (!response.ok) {
        throw new Error('Failed to fetch discovery call')
      }
      return response.json()
    },
    { enabled: false, retry: 1 },
  )

  useEffect(() => {
    if (discoveryCallError) {
      console.error('Error fetching discovery call:', discoveryCallError)
    }
  }, [discoveryCallError])

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
    refetchForms()
    refetchDiscoveryCall()
  }

  const userName = user?.full_name || JSON.stringify(user)

  return (
    <Card className="m-2">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium w-full">
          <div className="flex justify-between w-full">
            <div
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={handleOpenDialog}
            >
              {userName}
            </div>
            {blackFridayPurchase && (
              <div className="text-white p-1 text-xs bg-red-700 rounded-full">
                Black Friday
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{loading ? <p>Loading...</p> : children}</CardContent>
      <CardFooter>
        {item && item.created_at && item.updated_at && (
          <div className="flex flex-row justify-between gap-4 w-full">
            <div className="text-sm text-gray-500 basis-1/2">
              Created: <br />
              <span className="text-xs">
                {DateTime.fromISO(item.created_at).toLocaleString(
                  DateTime.DATE_SHORT,
                )}
              </span>
            </div>
            <div className="text-sm text-gray-500 basis-1/2">
              Updated: <br />
              <span className="text-xs">
                {DateTime.fromISO(item.updated_at).toLocaleString(
                  DateTime.DATE_SHORT,
                )}
              </span>
            </div>
          </div>
        )}
      </CardFooter>
      <CustomerInfoDialog
        user={user || item?.users || item?.user}
        open={isDialogOpen}
        forms={formsData || []}
        discoveryCall={discoveryCallData || null}
        discoveryCallError={discoveryCallError ? true : false}
        onOpenChange={setIsDialogOpen}
        onEmailClick={() => setIsEmailDialogOpen(true)}
      />
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={(message) => {
          // Implement email sending logic here
          console.log('Sending email:', message)
          setIsEmailDialogOpen(false)
        }}
        defaultMessage={`Message for ${userName}:`}
      />
    </Card>
  )
}

export const IntakesNotCompletedCard = ({ item, user }: any) => {
  const { loading, setLoading } = useLoading()
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

  const userName = user?.full_name || JSON.stringify(user)
  const userId = user?.id || item?.users?.id || item?.user?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={userName}
        action={loading ? 'Loading...' : 'Email'}
        isActionDisabled={loading}
        onAction={() => setIsEmailDialogOpen(true)}
      >
        <EmailSentViewerContent obj_id={userId} />
      </ViewerModal>
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={(customMessage) =>
          handleEmailClick(
            user || item?.users || item?.user,
            'intake_not_completed',
            item?.id || '',
            customMessage,
            setLoading,
          )
        }
        defaultMessage={`Message for ${userName}:`}
      />
    </CustomCard>
  )
}

export const IntakesSubmittedCard = ({ item, user }: any) => {
  const { loading, setLoading } = useLoading()
  const [approving, setApproving] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isResetEmailDialogOpen, setIsResetEmailDialogOpen] = useState(false)

  const userName = user?.full_name || JSON.stringify(user)
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={userName}
        action={approving ? 'Approving...' : 'View/Approve'}
        onAction={async () => {
          setApproving(true)
          await approveForm(itemId)
          setApproving(false)
        }}
        secondaryAction={loading ? 'Loading...' : 'Send Approval Email'}
        isSecondaryActionDisabled={loading}
        onSecondaryAction={() => setIsEmailDialogOpen(true)}
        tertiaryAction={loading ? 'Loading...' : 'Reset Form'}
        isTertiaryActionDisabled={loading}
        onTertiaryAction={() => setIsResetEmailDialogOpen(true)}
      >
        <FormViewerContent obj_id={itemId} />
      </ViewerModal>
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        btnText={'Send Approval Email'}
        onSend={(customMessage) =>
          handleEmailClick(
            user,
            'intake_form_approved',
            itemId,
            customMessage,
            setLoading,
          )
        }
        defaultMessage={`Message for ${userName}:`}
      />
      <EmailDialog
        isOpen={isResetEmailDialogOpen}
        onClose={() => setIsResetEmailDialogOpen(false)}
        title={'Reset Form'}
        btnText={'Reset Form and send Email'}
        onSend={(customMessage) =>
          handleEmailClick(
            user,
            'intake_form_reset',
            itemId,
            customMessage,
            setLoading,
          )
        }
        defaultMessage={`Message for ${userName}: `}
      />
    </CustomCard>
  )
}

export const SupplementalsNotCompletedCard = ({ item, user }: any) => {
  const { loading, setLoading } = useLoading()
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

  const userName = user?.full_name || JSON.stringify(user)
  const userId = user?.id || item?.users?.id || item?.user?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={userName}
        action={loading ? 'Loading...' : 'Email'}
        isActionDisabled={loading}
        onAction={() => setIsEmailDialogOpen(true)}
      >
        <EmailSentViewerContent obj_id={userId} />
      </ViewerModal>
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={(customMessage) =>
          handleEmailClick(
            user || item?.users || item?.user,
            'supplemental_not_completed',
            item?.id || '',
            customMessage,
            setLoading,
          )
        }
        defaultMessage={`Message for ${userName}:`}
      />
    </CustomCard>
  )
}

export const SupplementalsNeedingApprovalCard = ({ item, user }: any) => {
  const userName = user?.full_name || JSON.stringify(user)
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={userName}
        action="Approve"
        onAction={() => approveForm(itemId, true, user?.id)}
      >
        <FormViewerContent obj_id={itemId} />
      </ViewerModal>
    </CustomCard>
  )
}

export const DiscoveryNotScheduledCard = ({ item, user }: any) => {
  const { loading, setLoading } = useLoading()
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const userName = user?.full_name || 'Unknown User'
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={`View Discovery - ${userName}`}
        action="View"
        onAction={() => {}}
        secondaryAction="Email"
        onSecondaryAction={() => setIsEmailDialogOpen(true)}
        isSecondaryActionDisabled={loading}
      >
        <FormViewerContent obj_id={itemId} />
      </ViewerModal>
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={(customMessage) =>
          handleEmailClick(
            user || item?.users || item?.user,
            'discovery_not_scheduled',
            itemId,
            customMessage,
            setLoading,
          )
        }
        defaultMessage={`Message for ${userName}:`}
      />
    </CustomCard>
  )
}

export const DiscoveryScheduledCard = ({ item, user }: any) => {
  const userName = user?.full_name || JSON.stringify(user)
  const userId = user?.id || item?.users?.id || item?.user?.id || ''
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={userName}
        action="Approve"
        onAction={() => approveForm(itemId)}
      >
        <ScheduledEventViewerContent obj_id={userId} />
      </ViewerModal>
    </CustomCard>
  )
}

export const DiscoveryCard = ({ item, user }: any) => {
  const userName = user?.full_name || JSON.stringify(user)
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={userName}
        action="Approve"
        onAction={() => approveNotes(itemId)}
      >
        <ScheduledEventViewerContent obj_id={itemId} />
      </ViewerModal>
    </CustomCard>
  )
}

export const DiscoverySubmittedCard = ({ item, user }: any) => {
  const userName = user?.full_name || user
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={JSON.stringify(userName)}
        action="Approve"
        onAction={() => approveNotes(itemId)}
      >
        <NotesViewerContent obj_id={itemId} />
      </ViewerModal>
    </CustomCard>
  )
}

const ValidationSummary = ({ result }: { result: any }) => {
  if (!result) return null;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Overall Completion */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Overall Completion</span>
          <span className="text-sm font-medium text-blue-600">
            {result.completionPercentage}%
          </span>
        </div>
        <Progress 
          value={result.completionPercentage} 
          className="h-2"
        />
      </div>

      {/* Critical Issues */}
      {result.criticalErrors?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-red-600 mb-2">Critical Issues:</h4>
          <ul className="space-y-1">
            {result.criticalErrors.map((error: any, index: number) => (
              <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {result.warnings?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-amber-600 mb-2">Warnings:</h4>
          <ul className="space-y-1">
            {result.warnings.map((warning: any, index: number) => (
              <li key={index} className="text-sm text-amber-600 flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{warning.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section Details */}
      {result.sectionResults && Object.keys(result.sectionResults).length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Section Details:</h4>
          <div className="space-y-2">
            {Object.entries(result.sectionResults).map(([section, sectionResult]: [string, any]) => (
              <div key={section} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span>{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`font-medium ${sectionResult.isValid ? 'text-green-600' : 'text-amber-600'}`}>
                    {Math.round(sectionResult.completionScore)}%
                  </span>
                </div>
                <Progress 
                  value={sectionResult.completionScore} 
                  className={`h-1.5 ${sectionResult.isValid ? "" : "bg-amber-200"}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const IncompleteReportsCard = ({ item, user }: any) => {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const userName = user?.full_name || 'Unknown User';
  const userId = user?.id || item?.users?.id || item?.user?.id || '';
  const itemId = item?.id || '';
  
  useEffect(() => {
    if (item) {
      try {
        // Debug logs
        console.log('Raw item:', item);
        
        // Parse the report data properly
        let reportData;
        if (item.decrypted_report) {
          reportData = typeof item.decrypted_report === 'string' 
            ? JSON.parse(item.decrypted_report)
            : item.decrypted_report;
        } else if (item.report) {
          reportData = typeof item.report === 'string'
            ? JSON.parse(item.report)
            : item.report;
        }

        console.log('Parsed reportData:', reportData);

        if (reportData) {
          const result = validateReport(reportData);
          console.log('Validation result:', result);
          setValidationResult(result);
        } else {
          console.warn('No report data found');
          setValidationResult({
            isValid: false,
            completionPercentage: 0,
            criticalErrors: [],
            warnings: []
          });
        }
      } catch (error) {
        console.error('Error in IncompleteReportsCard:', error);
        setValidationResult({
          isValid: false,
          completionPercentage: 0,
          criticalErrors: [],
          warnings: []
        });
      }
    }
  }, [item]);

  // Debug log for render
  console.log('Current validationResult:', validationResult);

  return (
    <CustomCard item={item} user={user}>
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-medium">{userName}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Completion</span>
            <span className="text-sm font-medium text-blue-600">
              {validationResult?.completionPercentage ?? 0}%
            </span>
          </div>
          <Progress 
            value={validationResult?.completionPercentage ?? 0} 
            className="h-2 mt-1"
          />
          {validationResult?.criticalErrors?.length > 0 && (
            <div className="text-xs text-red-500 mt-1">
              {validationResult.criticalErrors.length} critical issues found
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => setShowFullReport(true)}
        >
          View Full Report
        </Button>
      </div>

      {/* Full Report Dialog */}
      <Dialog open={showFullReport} onOpenChange={setShowFullReport}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details - {userName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {validationResult && (
              <ValidationSummary result={validationResult} />
            )}
            <ReportViewerContent obj_id={itemId} />
            <DynamicReport userId={userId} />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFullReport(false)}>Close</Button>
            <Button onClick={() => approveReport(itemId)}>Approve Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CustomCard>
  );
};

export const ReportsNeedingApprovalCard = ({ item, user }: any) => {
  const userName = user?.full_name || 'Unknown User'
  const userId = user?.id || item?.users?.id || item?.user?.id || ''
  const itemId = item?.id || ''

  return (
    <CustomCard item={item} user={user}>
      <ViewerModal
        title={`View/Approve Report - ${userName}`}
        action="Approve"
        onAction={() => approveReport(itemId)}
        isReportViewer={true}
      >
        <ReportViewerContent obj_id={itemId} />
        <DynamicReport userId={userId} />
      </ViewerModal>
    </CustomCard>
  )
}

interface KanbanColumnProps {
  data: any
  title: string
  cardComponent: React.FC<CustomCardProps>
}

export const KanbanColumn = ({
  data,
  title,
  cardComponent,
}: KanbanColumnProps) => {
  const CardComponent = cardComponent
  data?.sort((a: any, b: any) => {
    const aDate = a?.items?.[0]?.updated_at
      ? new Date(a.items[0].updated_at).getTime()
      : 0
    const bDate = b?.items?.[0]?.updated_at
      ? new Date(b.items[0].updated_at).getTime()
      : 0
    return bDate - aDate // Sort in descending order (most recent first)
  })

  return (
    <div className="min-w-[300px]">
      <h3 className="flex text-sm font-semibold justify-center">{title}</h3>
      <Separator className="my-2" />
      {data.map((group: any, index: any) => {
        return (
          <CardComponent key={index} item={group[0]} user={group[0].users} />
        )
      })}
    </div>
  )
}
