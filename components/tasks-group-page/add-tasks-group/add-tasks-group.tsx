import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { z } from 'zod'

import { addTool, updateTool } from '@/api-services/tools'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

import './add-tasks-group.css'
import { MultiSelect } from '@/components/ui/multi-select'
import { addTaskGroup, updateTaskGroup } from '@/api-services/tasks'

interface AddTasksGroupDialogProps {
  selectedTool?: any
  allTask?: any
  setSelectedTool: (tool: any) => void
  onSuccess: () => void
  existingToolNames: string[]
}

const toolSchema = (existingToolNames: string[]) =>
  z.object({
    name: z.string().min(1, { message: 'Required' }),
    description: z.string().optional(),
  })

export function AddTasksGroupDialog({
  selectedTool,
  allTask,
  setSelectedTool,
  onSuccess,
  existingToolNames,
}: AddTasksGroupDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(toolSchema(existingToolNames)),
  })

  const { toast } = useToast()
  const [tasksGroup, setTasksGroup] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedTool) {
      setValue('name', selectedTool.name)
      setValue('description', selectedTool.description)

      // Prefill tasks
      const taskIds = selectedTool?.tasks?.map((task: any) => task.id) || []
      setSelectedTasks(taskIds)

      setTasksGroup(selectedTool.tools || [])
      setIsDialogOpen(true)
    } else {
      reset()
      setTasksGroup([])
      setSelectedTasks([])
      setIsDialogOpen(false)
    }
  }, [selectedTool, setValue, reset])

  const onSubmit = async (data: any) => {
    setLoading(true)
    const taskGroupData = {
      name: data.name,
      description: data.description,
      tasks: selectedTasks?.map((taskId: string) => ({ id: taskId })),
    }

    let response

    if (selectedTool?.id) {
      response = await updateTaskGroup(selectedTool.id, taskGroupData)
    } else {
      response = await addTaskGroup(taskGroupData)
    }

    if (response.success) {
      console.log(
        selectedTool?.id
          ? 'Task group updated successfully:'
          : 'Task group added successfully:',
        response.data || 'No data available',
      )

      toast({
        title: selectedTool?.id
          ? 'Task group updated successfully'
          : 'Task group added successfully',
        duration: 2000,
      })
    } else {
      console.error(
        selectedTool?.id
          ? 'Failed to update task group:'
          : 'Failed to add task group:',
        response.error,
      )
      toast({
        variant: 'destructive',
        title: selectedTool?.id
          ? 'Failed to update task group'
          : 'Failed to add task group',
        duration: 2000,
      })
    }

    reset()
    onSuccess()
    setSelectedTasks([])
    setSelectedTool(null)
    setIsDialogOpen(false)
    setLoading(false)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setTasksGroup([])
          setSelectedTool(null)
          setSelectedTasks([])
        }
        setIsDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button className="headerBtn">Create Task Group</Button>
      </DialogTrigger>
      <DialogContent className="min-h-[443px] max-w-[584px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTool ? 'Edit Task Group' : 'Create Task Group'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="formWrapper">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter task group name here"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-red-500">
                {errors.name?.message as string}
              </span>
            )}
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Description</Label>
            <Textarea
              placeholder="Enter task group description here"
              id="message"
              rows={4}
              {...register('description')}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Select Tasks</Label>
            <MultiSelect
              options={allTask?.map((task: any) => ({
                label: task?.name,
                value: task?.id,
              }))}
              onValueChange={setSelectedTasks}
              defaultValue={selectedTasks}
              placeholder="Select tasks"
              variant="inverted"
              maxCount={5}
            />
          </div>

          <DialogFooter className='responsiveClass'>
            <Button
              className="cancelBtn"
              type="button"
              onClick={() => {
                setSelectedTool(null)
                setIsDialogOpen(false)
                setSelectedTasks([])
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit" className="headerBtn">
              {selectedTool ? 'Save Changes' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
