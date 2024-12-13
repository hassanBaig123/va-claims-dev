import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

import './delete-tasks-group.css'
import { deleteTaskGroupById } from '@/api-services/tasks'

interface DelTasksGroupDialogProps {
  selectedTool?: any
  setSelectedTool: (tool: any) => void
  onSuccess: () => void
}

export function DelTasksGroupDialog({
  selectedTool,
  setSelectedTool,
  onSuccess,
}: DelTasksGroupDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedTool) {
      setIsDialogOpen(true)
    } else {
      setIsDialogOpen(false)
    }
  }, [selectedTool])

  const handleDelete = async () => {
    if (!selectedTool?.id) return
    const result = await deleteTaskGroupById(selectedTool.id)
    setLoading(true)

    if (result.success) {
      console.log('Task Group deleted successfully:', result.data)
      onSuccess()
      setSelectedTool(null)
      setIsDialogOpen(false)
      toast({
        title: 'Task deleted successfully',
        duration: 2000,
      })
    } else {
      console.error('Error deleting task group:', result.error)
      toast({
        variant: 'destructive',
        title: 'Error deleting task group',
        duration: 2000,
      })
    }
    setLoading(false)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedTool(null)
        }
        setIsDialogOpen(open)
      }}
    >
      <DialogContent className="min-h-[168px] max-w-[512px] py-10">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this task group?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your task
            group.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='responsiveClass'>
          <Button
            type="button"
            className="cancelBtn"
            onClick={() => {
              setSelectedTool(null)
              setIsDialogOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="delBtn"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            Delete Task Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
