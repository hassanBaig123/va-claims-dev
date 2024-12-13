'use client'

import React, { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ConditionsList } from './condition-search-box/ConditionsListAdditional'

const conditions = require('../../conditions.json')

interface Condition {
  value: string
  label: string
  code: string
  description?: string
  system?: string
  details?: ConditionDetails
  keywords?: string[]
  category?: string
}

interface ConditionDetails {
  currentDiagnosis: string
  disabilityRating: number | string
  serviceConnected: string
  nexusLetter: boolean
  personalStatement: boolean
}

type ConditionSearchBoxProps = {
  options?: string[]
  value?: Condition[]
  onChange?: (value: Condition[]) => void
  placeholder?: string
}

export function ConditionSearchBoxAdditional({
  options,
  value,
  onChange,
  placeholder,
}: ConditionSearchBoxProps) {
  const [open, setOpen] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(
    null,
  )
  const [conditionsList, setConditionsList] = useState<Condition[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditModal, setIsEditModal] = useState(false)
  const [conditionDetails, setConditionDetails] = useState<ConditionDetails>({
    currentDiagnosis: '',
    disabilityRating: 0,
    serviceConnected: '',
    nexusLetter: true,
    personalStatement: false,
  })
  const [editingCondition, setEditingCondition] = useState<Condition | null>(
    null,
  )

  useEffect(() => {
    if (value) {
      setConditionsList(value)
    }
  }, [value])

  const handleSelect = (conditionValue: string) => {
    if (conditionValue === 'no_conditions') {
      setEditingCondition(null)
      setConditionsList([])
      onChange && onChange([])
      setSelectedCondition({
        value: 'no_conditions',
        label: 'No conditions',
        code: '',
        category: '',
      })
      setOpen(false)
      return
    }

    const selected = conditions.find(
      (condition: Condition) => condition.value === conditionValue,
    )
    if (selected && !conditionsList.some((c) => c.value === selected.value)) {
      setSelectedCondition(selected)
      handleDialogOpen(selected)
    }
    setOpen(false)
  }

  const handleDialogOpen = (condition: Condition | null) => {
    if (condition) {
      setEditingCondition(condition)
      const existingDetails = conditionsList.find(
        (c) => c.value === condition.value,
      )?.details
      setConditionDetails(
        existingDetails || {
          currentDiagnosis: '',
          disabilityRating: 0,
          serviceConnected: '',
          nexusLetter: true,
          personalStatement: false,
        },
      )
    } else {
      setEditingCondition(null)
      setConditionDetails({
        currentDiagnosis: '',
        disabilityRating: 0,
        serviceConnected: '',
        nexusLetter: true,
        personalStatement: false,
      })
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingCondition) {
      const updatedConditions = [...conditionsList]
      const index = updatedConditions.findIndex(
        (c) => c.value === editingCondition.value,
      )
      if (index !== -1) {
        updatedConditions[index] = {
          ...editingCondition,
          details: conditionDetails,
          category: editingCondition.category, // Ensure category is included
        }
      } else {
        updatedConditions.push({
          ...editingCondition,
          details: conditionDetails,
          category: editingCondition.category, // Ensure category is included
        })
      }
      setConditionsList(updatedConditions)
      setDialogOpen(false)
      setEditingCondition(null)
      setSelectedCondition(null)
      onChange && onChange(updatedConditions)
    }
  }

  const updateConditionDetail = (
    conditionValue: string,
    fieldName: keyof ConditionDetails,
    checked: boolean,
  ) => {
    setConditionsList((prevConditions) => {
      const updatedConditions = prevConditions.map((cond) =>
        cond.value === conditionValue
          ? {
              ...cond,
              details: {
                ...cond.details,
                [fieldName]: !!checked,
              },
            }
          : cond,
      ) as Condition[]

      if (onChange && updatedConditions) {
        onChange(updatedConditions)
      }

      return updatedConditions
    })
    // onChange && onChange(updatedConditions)
  }
  const removeCondition = (value: string) => {
    const updatedConditions = conditionsList.filter(
      (condition: Condition) => condition.value !== value,
    )
    setConditionsList(updatedConditions)
    onChange && onChange(updatedConditions)
  }

  return (
    <div className={'mt-2'}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            {isEditModal ? (
              <>
                <DialogTitle className="text-center mb-2.5">
                  Edit condition
                </DialogTitle>
                <DialogTitle>{editingCondition?.label}</DialogTitle>
              </>
            ) : (
              <>
                <DialogTitle className="text-center mb-2.5">
                  Add new condition
                </DialogTitle>
                <Popover open={open} onOpenChange={setOpen}>
                  <div className="grid grid-cols-2 items-center gap-4 w-1/2">
                    <Label htmlFor="chooseCondition" className="text-left">
                      Choose Condition
                    </Label>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[250px] justify-between"
                      >
                        {selectedCondition
                          ? selectedCondition.label
                          : placeholder || 'Select condition...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent
                    className="w-[200px] max-h-72 overflow-y-auto p-0"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <Command>
                      <CommandInput placeholder="Search conditions..." />
                      <CommandEmpty>No condition found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          key="no_conditions"
                          value="no_conditions"
                          onSelect={() => handleSelect('no_conditions')}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              conditionsList.length === 0
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          No conditions
                        </CommandItem>
                        {conditions.map(
                          (condition: Condition, index: number) => (
                            <CommandItem
                              key={`${
                                condition.code + index + condition.value
                              }`}
                              value={condition.value}
                              onSelect={() => handleSelect(condition.value)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  conditionsList.some(
                                    (c) => c.value === condition.value,
                                  )
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {condition.label}
                            </CommandItem>
                          ),
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            )}
            <DialogDescription>
              {(isEditModal ||
                (selectedCondition &&
                  selectedCondition.value !== 'no_conditions')) &&
                'Please provide details about this condition.'}
            </DialogDescription>
          </DialogHeader>
          {(isEditModal ||
            (selectedCondition &&
              selectedCondition.value !== 'no_conditions')) && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentDiagnosis" className="text-left">
                  Current Diagnosis
                </Label>
                <RadioGroup
                  id="currentDiagnosis"
                  value={conditionDetails.currentDiagnosis}
                  onValueChange={(value) =>
                    setConditionDetails({
                      ...conditionDetails,
                      currentDiagnosis: value,
                    })
                  }
                  className="flex col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="currentDiagnosisYes" />
                    <Label htmlFor="currentDiagnosisYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="currentDiagnosisNo" />
                    <Label htmlFor="currentDiagnosisNo">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="disabilityRating" className="text-left">
                  Disability Rating
                </Label>
                <Select
                  value={conditionDetails.disabilityRating.toString()}
                  onValueChange={(value) =>
                    setConditionDetails({
                      ...conditionDetails,
                      disabilityRating: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Not rated',
                      0,
                      10,
                      20,
                      30,
                      40,
                      50,
                      60,
                      70,
                      80,
                      90,
                      100,
                    ].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating}
                        {typeof rating === 'number' ? '%' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceConnected" className="text-left">
                  Service Connected
                </Label>
                <RadioGroup
                  id="serviceConnected"
                  value={conditionDetails.serviceConnected}
                  onValueChange={(value) =>
                    setConditionDetails({
                      ...conditionDetails,
                      serviceConnected: value,
                    })
                  }
                  className="flex col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="serviceConnectedYes" />
                    <Label htmlFor="serviceConnectedYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="serviceConnectedNo" />
                    <Label htmlFor="serviceConnectedNo">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center">
        <button
          id="next-button"
          onClick={() => {
            handleDialogOpen(null)
            setIsEditModal(false)
          }}
          className={`ml-auto px-4 py-2 rounded bg-green-500 text-white hover:bg-green-700`}
        >
          Add new condition
        </button>
      </div>
      <div className="mt-4">
        <ConditionsList
          conditionsList={conditionsList}
          handleDialogOpen={handleDialogOpen}
          removeCondition={removeCondition}
          setIsEditModal={setIsEditModal}
          updateConditionDetail={updateConditionDetail}
        />
      </div>
    </div>
  )
}
