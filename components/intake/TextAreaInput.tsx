import React from 'react'
import { Textarea } from '@/components/ui/textarea'

type TextAreaInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const TextAreaInput = ({
  value,
  onChange,
  placeholder,
}: TextAreaInputProps) => (
  <Textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="min-h-[100px] w-full resize-y mt-2"
  />
)
