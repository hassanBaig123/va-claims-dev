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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

import './add-tool.css'

interface AddToolDialogProps {
  selectedTool?: any
  setSelectedTool: (tool: any) => void
  onSuccess: () => void
  existingToolNames: string[]
}

const toolSchema = (existingToolNames: string[], selectedTool?: any) =>
  z.object({
    name: z
      .string()
      .min(1, { message: 'Required' })
      .refine(
        (name) =>
          !existingToolNames.includes(name) ||
          (selectedTool && selectedTool.name === name),
        {
          message: 'Tool name must be unique',
        },
      ),
    description: z.string().optional(),
  })

export function AddToolDialog({
  selectedTool,
  setSelectedTool,
  onSuccess,
  existingToolNames,
}: AddToolDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ToolData>({
    resolver: zodResolver(toolSchema(existingToolNames, selectedTool)),
  })

  const [badges, setBadges] = useState<string[]>([])
  const [returnKeys, setReturnKeys] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    if (selectedTool) {
      setValue('name', selectedTool.name)
      setValue('description', selectedTool.description)
      setBadges(selectedTool.result_keys || [])
      setIsDialogOpen(true)
      setLoading(false)
    } else {
      reset()
      setBadges([])
      setIsDialogOpen(false)
      setLoading(false)
    }
  }, [selectedTool, setValue, reset])

  interface ToolData {
    name: string
    description: string
    result_keys: string[]
  }

  const onSubmit = async (data: ToolData) => {
    const toolData = {
      ...data,
      result_keys: badges,
    }
    setLoading(true)
    if (selectedTool) {
      const result = await updateTool(selectedTool.id, toolData)
      if (result.success) {
        console.log('Tool updated successfully:', result.data)
        toast({
          title: 'Tool updated successfully',
          duration: 2000,
        })
        onSuccess()
        setLoading(false)
      } else {
        console.error('Failed to update tool:', result.error)
        toast({
          variant: 'destructive',
          title: 'Failed to update tool',
          duration: 2000,
        })
        setLoading(false)
      }
    } else {
      const result = await addTool(toolData)
      if (result.success) {
        console.log('Tool added successfully:', result.data)
        toast({
          title: 'Tool added successfully',
          duration: 2000,
        })
        setLoading(false)
        onSuccess()
      } else {
        console.error('Failed to add tool:', result.error)
        toast({
          variant: 'destructive',
          title: 'Failed to add tool',
          duration: 2000,
        })
        setLoading(false)
      }
    }

    reset()
    setBadges([])
    setSelectedTool(null)
    setIsDialogOpen(false)
  }

  const handleReturnKeySubmit = (e: any) => {
    e.preventDefault()
    if (returnKeys.trim() !== '') {
      setBadges((prevBadges) => [...prevBadges, returnKeys])
      setReturnKeys('')
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset()
          setBadges([])
          setSelectedTool(null)
          setReturnKeys('')
        }
        setIsDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button className="headerBtn">Add New Tool</Button>
      </DialogTrigger>
      <DialogContent className="min-h-[443px] max-w-[584px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTool ? 'Edit Tool' : 'Add New Tool'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="formWrapper">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter tool name here"
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
              placeholder="Type tool description here"
              id="message"
              rows={4}
              {...register('description')}
            />
          </div>
          <div>
            <Label htmlFor="returnKeys">Return Keys</Label>
            <form onSubmit={handleReturnKeySubmit}>
              <Input
                type="text"
                id="result_keys"
                placeholder={`Type and press enter to create "Return Keys"`}
                value={returnKeys}
                onChange={(e) => setReturnKeys(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleReturnKeySubmit(e)
                  }
                }}
              />
            </form>
            <div className="mt-[16px] flex flex-wrap gap-2">
              {badges?.map((badge, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() =>
                    setBadges((prevBadges) =>
                      prevBadges.filter(
                        (_, badgeIndex) => badgeIndex !== index,
                      ),
                    )
                  }
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter className='responsiveClass'>
            <Button
              className="cancelBtn"
              type="button"
              onClick={() => {
                setSelectedTool(null)
                setIsDialogOpen(false)
                setReturnKeys('')
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit" className="headerBtn">
              {selectedTool ? 'Save Changes' : 'Add Tool'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
