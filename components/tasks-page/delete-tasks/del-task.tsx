import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

import './delete-tasks.css'
import { deleteTaskById } from '@/api-services/tasks'

interface DelTaskDialogProps {
  selectedRow?: any
  setSelectedRow: (tool: any) => void
  onSuccess: () => void
}

export function DelTaskDialog({
  selectedRow,
  setSelectedRow,
  onSuccess,
}: DelTaskDialogProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedRow) {
      setIsDialogOpen(true)
    } else {
      setIsDialogOpen(false)
    }
  }, [selectedRow])

  const handleDelete = async () => {
    if (!selectedRow?.id) return
    setLoading(true)
    const result = await deleteTaskById(selectedRow.id)

    if (result.success) {
      console.log('Task deleted successfully:', result.data)
      onSuccess()
      setSelectedRow(null)
      setIsDialogOpen(false)
      toast({
        title: 'Task deleted successfully',
        duration: 2000,
      })
      setLoading(false)
    } else {
      console.error('Error deleting Task:', result.error)
      toast({
        variant: 'destructive',
        title: 'Task deleted successfully',
        duration: 2000,
      })
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedRow(null)
        }
        setIsDialogOpen(open)
      }}
    >
      <DialogContent className="min-h-[168px] max-w-[417px] py-10">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            task.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="responsiveClass">
          <Button
            type="button"
            className="cancelBtn"
            onClick={() => {
              setSelectedRow(null)
              setIsDialogOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            type="submit"
            className="delBtn"
            variant={'destructive'}
            disabled={loading}
          >
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
