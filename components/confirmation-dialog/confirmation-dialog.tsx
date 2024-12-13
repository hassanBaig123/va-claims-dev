'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
type ConfirmationDialogProps = {
  children: React.ReactNode
  onRemove: () => void
  loading: boolean
}
const ConfirmationDialog = ({
  children,
  onRemove,
  loading,
}: ConfirmationDialogProps) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div onClick={() => setShowDialog(true)}>{children}</div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[525px] p-2">
          <DialogHeader className="bg-primary/5 p-4 rounded-t-lg">
            <DialogTitle className="text-xl font-bold text-foreground">
              Are you sure?
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-2 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Are you sure you want to remove ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setShowDialog(false)}
                className="bg-gray-300 text-black rounded-lg px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={onRemove}
                className={`${
                  loading ? 'bg-red-300' : 'bg-red-500'
                } text-white rounded-lg px-4 py-2`}
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ConfirmationDialog
