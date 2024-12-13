import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { number, z } from 'zod'
import { Trash2, Check, X } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { MultiSelect } from '@/components/ui/multi-select'
import { Checkbox } from '@/components/ui/checkbox'
import { addTask, updateTask } from '@/api-services/tasks'

import './add-task.css'

const toolSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  description: z.string().optional(),
  message_template: z.string().optional(),
  variableName: z.string().optional(),
  agent_class: z.string().optional(),
  keyMapping: z.string().optional(),
  shared_instructions: z.string().optional(),
  tools: z.array(z.string()).optional(),
  result_keys: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  expansion_config: z
    .object({
      type: z.string().optional(),
      identifiers: z
        .object({
          condition_name: z.string().optional(),
          id: z.string().optional(),
        })
        .optional(),
      array_mapping: z
        .object({
          condition: z.string().optional(),
          user: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
})

interface AddTaskDialogProps {
  data?: any
  agents?: any
  allTools?: any
}

interface Dependency {
  name: string
  shouldExpand: boolean
}

interface Tool {
  name: string
  result_keys: string[]
}

export function AddTaskDialog({ data, agents, allTools }: AddTaskDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(toolSchema),
  })
  const { toast } = useToast()
  const router = useRouter()
  const [addedDependencies, setAddedDependencies] = useState<
    { name: string; shouldExpand: boolean }[]
  >([])
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [dependency, setDependency] = useState<string>('')
  const [customConfigs, setCustomConfigs] = useState<Record<number, any>>({})
  const [loading, setLoading] = useState(false)
  const [addingDependency, setAddingDependency] = useState(false)

  const handleAddDependency = () => {
    if (dependency.trim() === '') {
      alert('Please enter a valid dependency.')
      return
    }
    setAddedDependencies((prev) => [
      ...prev,
      { name: dependency, shouldExpand: false },
    ])
    setDependency('')
  }

  const handleRemoveDependency = (index: number) => {
    setAddedDependencies((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleExpand = (index: number) => {
    setAddedDependencies((prev: Dependency[]) =>
      prev.map((dep, i) =>
        i === index ? { ...dep, shouldExpand: !dep.shouldExpand } : dep,
      ),
    )
    setAddingDependency(!addingDependency)
  }

  const handleCheck = (index: number) => {
    const variableName = customConfigs[index]?.variableName
    const keyMapping = customConfigs[index]?.keyMapping

    if (variableName && keyMapping) {
      setCustomConfigs((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          saved: true, // Mark as saved
        },
      }))
      setAddingDependency(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Please fill all fields.',
        duration: 2000,
      })
    }
  }

  const handleCross = (index: number) => {
    setCustomConfigs((prev) => {
      const updatedConfigs = { ...prev }
      delete updatedConfigs[index]
      return updatedConfigs
    })
    toggleExpand(index)
    setAddingDependency(false)
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    setCustomConfigs((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
        saved: false,
      },
    }))
  }

  useEffect(() => {
    setLoading(true)
    if (data) {
      // Prefill simple fields
      setValue('name', data?.name)
      setValue('description', data?.description)
      setValue('shared_instructions', data?.shared_instructions)
      setValue('message_template', data?.message_template)

      if (data?.agent_class) {
        setSelectedAgent(data.agent_class)
      }

      // Prefill tools
      const prefillTools = data?.tools?.map((tool: any) => tool) || []
      setSelectedTools(prefillTools)

      // Prefill dependencies
      if (data?.dependencies) {
        setAddedDependencies(
          data.dependencies.map((dependency: string) => ({
            name: dependency,
            shouldExpand: !!data.expansion_config?.array_mapping?.[dependency],
          })),
        )
      }

      if (
        data?.expansion_config?.identifiers &&
        data?.expansion_config?.array_mapping
      ) {
        const configs: Record<number, any> = {}

        data?.dependencies?.forEach((dependency: string, index: number) => {
          const mappedKey = Object.keys(
            data?.expansion_config?.array_mapping || {},
          ).find(
            (key) => data?.expansion_config?.array_mapping[key] === dependency,
          )

          if (mappedKey) {
            const keyMapping = Object.keys(
              data?.expansion_config?.identifiers || {},
            ).find((key) => {
              const identifierValue = data?.expansion_config?.identifiers[key]
              return identifierValue && identifierValue.includes(mappedKey)
            })

            if (keyMapping) {
              configs[index] = {
                variableName: dependency,
                keyMapping,
                saved: true,
              }
            } else {
              console.log(`No keyMapping found for dependency: ${dependency}`)
            }
          } else {
            console.log(`No mapping found for dependency: ${dependency}`)
          }
        })

        setCustomConfigs(configs)
      }
      setLoading(false)
    } else {
      reset()
      setSelectedTools([])
      setAddedDependencies([])
      setCustomConfigs({})
      setLoading(false)
    }
  }, [data, setValue, reset])

  const selectedResultKeys: string[] = allTools
    ?.filter((tool: Tool) => selectedTools?.includes(tool?.name))
    ?.flatMap((tool: Tool) => tool?.result_keys)

  const onSubmit = async (submitData: any) => {
    setLoading(true)

    const dependencies = addedDependencies?.map((dependency) => dependency.name)

    const expansionConfig: {
      type: string
      identifiers: Record<string, string>
      array_mapping: Record<string, string>
    } = {
      type: 'array',
      identifiers: {},
      array_mapping: {},
    }

    Object.entries(customConfigs).forEach(([index, config]) => {
      if (config.saved) {
        expansionConfig.identifiers[
          config.keyMapping
        ] = `${config.variableName}.${config.keyMapping}`
        expansionConfig.array_mapping[config.variableName] =
          addedDependencies[index as any]?.name || 'unknown'
      }
    })

    const payload = {
      name: submitData.name,
      description: submitData.description,
      shared_instructions: submitData.shared_instructions,
      message_template: submitData.message_template,
      tools: selectedTools || [],
      dependencies: dependencies || [],
      agent_class: selectedAgent || '',
      result_keys: selectedResultKeys || [],
      expansion_config: expansionConfig,
    }

    if (data) {
      const response = await updateTask(data?.id, payload)
      if (response.success) {
        console.log('Task updated successfully:', response.data)
        reset()
        toast({
          title: 'Task updated successfully',
          duration: 2000,
        })
        setLoading(false)

        router.push(`/tasks`)
      } else {
        console.error('Failed to update task:', response.error)
        toast({
          variant: 'destructive',
          title: 'Failed to update task',
          duration: 2000,
        })
        setLoading(false)
      }
    } else {
      const response = await addTask(payload)
      if (response.success) {
        console.log('Task added successfully:', response.data)
        toast({
          title: 'Task added successfully',
          duration: 2000,
        })
        setLoading(false)
        reset()
        router.push(`/tasks`)
      } else {
        console.error('Failed to add task:', response.error)
        toast({
          variant: 'destructive',
          title: 'Failed to add task',
          duration: 2000,
        })
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    router.push(`/tasks`)
  }

  return (
    <div>
      <div className="h-full w-full">
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
              id="description"
              rows={4}
              {...register('description')}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Shared Instructions</Label>
            <Textarea
              placeholder="Type shared instructions here"
              id="shared_instructions"
              rows={12}
              {...register('shared_instructions')}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Message Template</Label>
            <Textarea
              placeholder="Make your message template"
              id="message_template"
              rows={12}
              {...register('message_template')}
            />
          </div>
          <div className="flex w-full gap-4 responsiveClass">
            <div className="w-full">
              <Label htmlFor="message">Agents</Label>
              <Select
                value={selectedAgent}
                onValueChange={(value) => {
                  if (value !== selectedAgent && value) {
                    setSelectedAgent(value)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select agent">
                    {selectedAgent || 'Select agent'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from(new Set(agents as string[]))
                      ?.filter((agent: string) => agent)
                      ?.map((agent: string, i: number) => (
                        <SelectItem key={i} value={agent}>
                          {agent}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="message">Tools</Label>
              <MultiSelect
                options={allTools?.map((tool: any) => ({
                  label: tool?.name,
                  value: tool?.name,
                }))}
                onValueChange={setSelectedTools}
                defaultValue={selectedTools}
                placeholder="Select Tools"
                variant="inverted"
                maxCount={5}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="returnKeys">Result Keys</Label>
            <div className="mt-[16px] flex flex-wrap gap-2">
              {selectedResultKeys.map((resultKey, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer">
                  {resultKey}
                </Badge>
              ))}
            </div>
          </div>
          <Label htmlFor="message">Dependencies</Label>
          <div className="flex items-center gap-3 responsiveClass">
            <Input
              type="text"
              id="dependency"
              placeholder="Enter task dependency here"
              value={dependency}
              onChange={(e) => setDependency(e.target.value)}
            />
            <Button
              className="headerBtn"
              type="button"
              onClick={handleAddDependency}
            >
              Add Dependency
            </Button>
          </div>
          <div className="w-full flex flex-col gap-4">
            {addedDependencies?.map((dependency, index) => (
              <div className="w-full flex-col" key={index}>
                <div className="responsiveClass flex w-full gap-4 justify-between">
                  <Label htmlFor="message">{dependency?.name}</Label>
                  <div className="flex items-center space-x-2">
                    {!dependency.shouldExpand &&
                      !customConfigs[index]?.saved && (
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          should expand
                        </label>
                      )}
                    {!dependency.shouldExpand &&
                      !customConfigs[index]?.saved && (
                        <Checkbox
                          id={`expand-${index}`}
                          checked={dependency.shouldExpand}
                          onClick={() => toggleExpand(index)}
                        />
                      )}
                    {!dependency.shouldExpand && (
                      <Trash2
                        height={16}
                        width={16}
                        className="cursor-pointer"
                        onClick={() => handleRemoveDependency(index)}
                      />
                    )}
                    {dependency.shouldExpand &&
                      !customConfigs[index]?.saved && (
                        <Check
                          height={16}
                          width={16}
                          className="cursor-pointer"
                          onClick={() => handleCheck(index)}
                        />
                      )}
                    {dependency.shouldExpand && (
                      <X
                        height={16}
                        width={16}
                        className="cursor-pointer"
                        onClick={() => handleCross(index)}
                      />
                    )}
                  </div>
                </div>
                {(dependency?.shouldExpand || customConfigs[index]?.saved) && (
                  <div className="flex w-full gap-3 mt-2 responsiveClass">
                    <div className="w-full">
                      {customConfigs[index]?.saved ? (
                        <div>
                          <span className="font-bold">Type: </span>
                          <span>array</span>
                        </div>
                      ) : (
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select agent">
                              array
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="array">array</SelectItem>{' '}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="w-full ">
                      {customConfigs[index]?.saved ? (
                        <div>
                          <span className="font-bold">Variable Name: </span>
                          <span>{customConfigs[index]?.variableName}</span>
                        </div>
                      ) : (
                        <Input
                          className="h-[40px]"
                          type="text"
                          id={`variableName-${index}`}
                          placeholder="Type variable name"
                          value={customConfigs[index]?.variableName || ''}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'variableName',
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                    <div className="w-full ">
                      {customConfigs[index]?.saved ? (
                        <div>
                          <span className="font-bold">Key Mapping: </span>
                          <span> {customConfigs[index]?.keyMapping}</span>
                        </div>
                      ) : (
                        <Input
                          className="h-[40px]"
                          type="text"
                          id={`keyMapping-${index}`}
                          placeholder="Key mapping text"
                          value={customConfigs[index]?.keyMapping || ''}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'keyMapping',
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end gap-2">
            <Button className="cancelBtn" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              disabled={loading || addingDependency}
              type="submit"
              className="headerBtn"
            >
              {data ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
