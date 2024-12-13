import React from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type RadioInputProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export const RadioInput = ({ options, value, onChange }: RadioInputProps) => (
  <RadioGroup
    value={value}
    onValueChange={onChange}
    className="flex items-center space-x-4 mt-2"
  >
    {options.map((option, index) => (
      <div key={index} className="flex items-center space-x-2">
        <RadioGroupItem value={option} id={`option-${index}`} />
        <Label htmlFor={`option-${index}`}>{option}</Label>
      </div>
    ))}
  </RadioGroup>
)
