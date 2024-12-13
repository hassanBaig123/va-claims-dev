import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { FormViewerContent } from './viewer-modal-forms/form-viewer-content'
import ViewerModal from './viewer-modal'
import { createPortal } from 'react-dom'
import { approveForm } from './kanban-forms-helpers'

interface CustomerInfoDialogProps {
  user: any
  forms: Array<{
    id: string
    status: string
    title: string
    created_at: string
  }>
  discoveryCall: Array<{
    id: string
    user_id: string
    start_time: string
    users: {
      id: string
      email: string
      full_name: string
    }
  }> | null
  discoveryCallError: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmailClick: () => void
}

export const CustomerInfoDialog = ({
  user,
  forms,
  discoveryCall,
  discoveryCallError,
  open,
  onOpenChange,
}: CustomerInfoDialogProps) => {
  const [isFormViewerOpen, setIsFormViewerOpen] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  const openFormViewer = (formId: string) => {
    console.log('Opening form viewer for form:', formId)
    setSelectedFormId(formId)
    setIsFormViewerOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-[1200px] h-[90vh] max-h-[900px] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{user?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            <div className="w-full h-1/2 md:h-auto md:w-1/2 flex flex-col overflow-hidden bg-gray-100 md:bg-white">
              <div className="flex-grow p-6 overflow-y-auto">
                <div className="space-y-6 pr-4">
                  <div>
                    <h3 className="font-semibold">Customer Details</h3>
                    <p>Email: {user?.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Forms</h3>
                    {forms.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {forms.map((form) => (
                          <li key={form.id}>
                            <span
                              className="cursor-pointer text-blue-500 hover:underline"
                              onClick={() => setSelectedFormId(form.id)}
                            >
                              {form.title}
                            </span>
                            - Status: {form.status}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No forms available</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">Discovery Call</h3>
                    {discoveryCallError ? (
                      <p className="text-red-500">
                        Error fetching discovery call data
                      </p>
                    ) : discoveryCall && discoveryCall.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {discoveryCall.map((call) => (
                          <li key={call.id}>
                            Scheduled:{' '}
                            {new Date(call.start_time).toLocaleString()}
                            <br />
                            With: {call.users.full_name} ({call.users.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No discovery call scheduled</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-px md:w-px md:h-auto bg-gray-200 md:hidden" />
            <div className="w-full md:w-1/2 h-1/2 md:h-auto flex flex-col overflow-hidden">
              <div className="flex-grow p-6 overflow-y-auto">
                {selectedFormId ? (
                  <div className="space-y-4">
                    <FormViewerContent obj_id={selectedFormId} />
                    {forms.find((f) => f.id === selectedFormId)?.status ===
                      'submitted' && (
                      <button
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors w-full"
                        onClick={async () => {
                          // Add your approval logic here
                          console.log('Approving form:', selectedFormId)
                          await approveForm(selectedFormId, true, user?.id)
                        }}
                      >
                        Approve Form
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a form to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
