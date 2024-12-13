import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'

type MultiSelectProps = {
  options: string[]
  placeholder?: string
  value: string[]
  onChange: (value: string[]) => void
}

export const MultiSelect = ({
  options,
  placeholder,
  value,
  onChange,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]
    onChange(newValue)
  }

  const removeOption = (option: string) => {
    const newValue = value.filter((item) => item !== option)
    onChange(newValue)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer bg-white"
        onClick={() => options.length > 0 && setIsOpen(!isOpen)}
        aria-disabled={options.length === 0}
      >
        <span className="text-sm">
          {value.length > 0
            ? `${value.length} selected ${placeholder}`
            : `Select ${placeholder ? placeholder : 'options'}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => {}}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((item) => (
            <div
              key={item}
              className="flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1"
            >
              <span>{item}</span>
              <X
                className="w-4 h-4 ml-1 cursor-pointer"
                onClick={() => removeOption(item)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
