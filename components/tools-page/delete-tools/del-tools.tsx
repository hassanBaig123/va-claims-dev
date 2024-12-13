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

import './delete-tools.css'
import { deleteTool } from '@/api-services/tools'

interface DelToolDialogProps {
  selectedTool?: any
  setSelectedTool: (tool: any) => void
  onSuccess: () => void // Callback to refresh the tool list or handle success
}

export function DelToolDialog({
  selectedTool,
  setSelectedTool,
  onSuccess,
}: DelToolDialogProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
    setLoading(true)
    const result = await deleteTool(selectedTool.id)

    if (result.success) {
      console.log('Tool deleted successfully:', result.data)
      toast({
        title: 'Tool deleted successfully',
        duration: 2000,
      })
      setLoading(false)
      onSuccess() // Trigger the success callback
      setSelectedTool(null) // Reset the selected tool
      setIsDialogOpen(false) // Close the dialog
    } else {
      console.error('Error deleting tool:', result.error)
      setLoading(false)
      toast({
        variant: 'destructive',
        title: 'Error deleting tool',
        duration: 2000,
      })
    }
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
      <DialogContent className="min-h-[168px] max-w-[417px] py-10">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this tool?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            tool.
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
            Delete Tool
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
