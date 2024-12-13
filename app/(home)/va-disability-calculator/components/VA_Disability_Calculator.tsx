'use client'

import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface Condition {
  name: string
  category: string
  rating: number
}

const conditionsList: Condition[] = [
  { name: 'Loss of Vision', category: 'Physical', rating: 0 },
  { name: 'Hearing Loss', category: 'Physical', rating: 0 },
  { name: 'Chronic Pain', category: 'Physical', rating: 0 },
  { name: 'Mobility Impairment', category: 'Physical', rating: 0 },
  { name: 'Respiratory Issues', category: 'Physical', rating: 0 },
  { name: 'PTSD', category: 'Mental Health', rating: 0 },
  { name: 'Depression', category: 'Mental Health', rating: 0 },
  { name: 'Anxiety Disorders', category: 'Mental Health', rating: 0 },
  { name: 'Diabetes', category: 'Other Conditions', rating: 0 },
  { name: 'Heart Disease', category: 'Other Conditions', rating: 0 },
  // New Conditions
  { name: 'No Bilateral Factor', category: 'Additional Factors', rating: 0 },
  { name: 'Left Leg', category: 'Additional Factors', rating: 0 },
  { name: 'Right Leg', category: 'Additional Factors', rating: 0 },
  { name: 'Left Arm', category: 'Additional Factors', rating: 0 },
  { name: 'Right Arm', category: 'Additional Factors', rating: 0 },
  { name: 'Bilateral Upper', category: 'Additional Factors', rating: 0 },
  { name: 'Bilateral Lower', category: 'Additional Factors', rating: 0 },
  { name: 'Back', category: 'Additional Factors', rating: 0 },
]

const ratingOptions = [
  { label: '0%', value: 0 },
  { label: '10%', value: 10 },
  { label: '20%', value: 20 },
  { label: '30%', value: 30 },
  { label: '40%', value: 40 },
  { label: '50%', value: 50 },
  { label: '60%', value: 60 },
  { label: '70%', value: 70 },
  { label: '80%', value: 80 },
  { label: '90%', value: 90 },
  { label: '100%', value: 100 },
]

// Mock compensation rates per 10% disability
const compensationRates: Record<number, number> = {
  0: 0,
  10: 144.14,
  20: 288.28,
  30: 432.42,
  40: 576.56,
  50: 720.7,
  60: 864.84,
  70: 1008.98,
  80: 1153.12,
  90: 1297.26,
  100: 1441.4,
}

const VA_Disability_Calculator: React.FC = () => {
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([])
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})
  const [result, setResult] = useState<number | null>(null)
  const [dependents, setDependents] = useState({
    childrenUnder18: 0,
    children18To23: 0,
    parents: 0,
  })
  const [maritalStatus, setMaritalStatus] = useState<string>('SINGLE')
  const [isAnnual, setIsAnnual] = useState<boolean>(false)
  const [compensation, setCompensation] = useState<number>(0)

  // Calculate total disability rating based on VA's combined rating formula
  const calculateTotal = () => {
    const ratingsArray = Object.values(ratings).sort((a, b) => b - a)
    let total = 0

    ratingsArray.forEach((rating) => {
      total = Math.ceil(total + rating - (total * rating) / 100)
      console.log('Total: ', total)
    })

    const finalRating = Math.round(total)
    setResult(finalRating)
    calculateCascadingPercentage(finalRating)
  }

  function calculateCascadingPercentage(...values: number[]) {
    // Guard clause for empty input
    if (values.length === 0) return 0
    // Sort values in descending order
    const sortedValues = values.sort((a, b) => b - a)
    // Initialize with first calculation (100 - first number)
    let result = 100 - sortedValues[0]
    // Process remaining values as percentages of previous remainder
    for (let i = 1; i < sortedValues.length; i++) {
      result = result - Math.ceil(result * (sortedValues[i] / 100))
      console.log('Result: ', result)
    }
    // Convert to final percentage (subtract from 100)
    result = 100 - result

    if (result < 1) {
      result = 1
    }
    // Round up to next multiple of 10
    const finalResult = Math.ceil(result / 10) * 10
    console.log(finalResult)
    if (finalResult <= 1) {
      return 1
    }
    return Math.ceil(finalResult / 10) * 10
  }
  // Test cases
  console.log(calculateCascadingPercentage(70, 50)) // Output: 90
  console.log(calculateCascadingPercentage(70, 50, 50, 10, 10)) // Output: 100

  // // Calculate compensation based on total rating and additional factors
  // const calculateCompensation = (totalRating: number) => {
  //   // Basic compensation based on disability rating
  //   let baseCompensation = 0
  //   if (totalRating >= 10 && totalRating <= 100) {
  //     // Assuming compensationRates are per 10%
  //     const key = Math.floor(totalRating / 10) * 10
  //     baseCompensation = compensationRates[key] || 0
  //   }

  //   // Additional compensation for dependents
  //   const { childrenUnder18, children18To23, parents } = dependents
  //   let additional = 0
  //   additional += childrenUnder18 * 50 // $50 per child under 18
  //   additional += children18To23 * 75 // $75 per child 18-23
  //   additional += parents * 100 // $100 per dependent parent

  //   // Additional compensation for marital status
  //   if (maritalStatus === 'MARRIED') {
  //     additional += 200 // $200 for being married
  //   }

  //   let totalCompensation = baseCompensation + additional

  //   // No need to multiply by 12 here; handle in display based on isAnnual
  //   // We'll keep baseCompensation and additional as monthly, and handle annual in display

  //   // Round to two decimal places
  //   totalCompensation = Math.round(totalCompensation * 100) / 100

  //   setCompensation(totalCompensation)
  // }

  const handleCheckboxChange = (condition: Condition) => {
    if (selectedConditions.find((c) => c.name === condition.name)) {
      setSelectedConditions(
        selectedConditions.filter((c) => c.name !== condition.name),
      )
      const updatedRatings = { ...ratings }
      delete updatedRatings[condition.name]
      setRatings(updatedRatings)
    } else {
      setSelectedConditions([...selectedConditions, condition])
    }
  }

  const handleRatingChange = (conditionName: string, value: number) => {
    setRatings({ ...ratings, [conditionName]: value })
  }

  // Auto calculate whenever ratings, dependents, maritalStatus, or isAnnual change
  useEffect(() => {
    if (selectedConditions.length === 0) {
      setResult(null)
      setCompensation(0)
      return
    }
    calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratings, dependents, maritalStatus])

  return (
    <div className="min-h-screen mt-28 bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Input Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <form>
              {/* Step 1 - Add Disabilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Step 1: Add Disabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    'Physical',
                    'Mental Health',
                    'Other Conditions',
                    'Additional Factors',
                  ].map((category) => (
                    <div key={category}>
                      <h3 className="text-xl font-medium mb-2">{category}</h3>
                      <div className="space-y-3">
                        {conditionsList
                          .filter(
                            (condition) => condition.category === category,
                          )
                          .map((condition) => (
                            <div
                              key={condition.name}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={condition.name}
                                  checked={selectedConditions.some(
                                    (c) => c.name === condition.name,
                                  )}
                                  onCheckedChange={() =>
                                    handleCheckboxChange(condition)
                                  }
                                />
                                <Label htmlFor={condition.name}>
                                  {condition.name}
                                </Label>
                              </div>
                              {selectedConditions.some(
                                (c) => c.name === condition.name,
                              ) && (
                                <Select
                                  value={
                                    ratings[condition.name]?.toString() || '0'
                                  }
                                  onValueChange={(value) =>
                                    handleRatingChange(
                                      condition.name,
                                      Number(value),
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ratingOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value.toString()}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Step 2 - Additional Factors */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Step 2: Add Additional Factors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="childrenUnder18">Children Under 18</Label>
                    <Input
                      type="number"
                      id="childrenUnder18"
                      value={dependents.childrenUnder18}
                      onChange={(e) =>
                        setDependents((prev) => ({
                          ...prev,
                          childrenUnder18: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="children18To23">Children 18 to 23</Label>
                    <Input
                      type="number"
                      id="children18To23"
                      value={dependents.children18To23}
                      onChange={(e) =>
                        setDependents((prev) => ({
                          ...prev,
                          children18To23: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="parents">Dependent Parents</Label>
                    <Input
                      type="number"
                      id="parents"
                      value={dependents.parents}
                      onChange={(e) =>
                        setDependents((prev) => ({
                          ...prev,
                          parents: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select
                      value={maritalStatus}
                      onValueChange={(value) => setMaritalStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="MARRIED">Married</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Output Section */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col">
            {/* Compensation Switcher */}
            <div className="mb-6 flex items-center justify-between">
              <Label htmlFor="compensationToggle">
                Show Annual Compensation
              </Label>
              <Switch
                id="compensationToggle"
                checked={isAnnual}
                onCheckedChange={() => setIsAnnual(!isAnnual)}
              />
            </div>

            {/* Result */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Disability Percentage Circle */}
              <div className="w-40 h-40 mb-6">
                <CircularProgressbar
                  value={result || 0}
                  text={`${result || 0}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: `rgba(59, 130, 246, ${(result || 0) / 100})`,
                    textColor: '#1D4ED8',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>

              {/* Compensation Display */}
              <div className="text-center">
                <p className="text-xl font-medium mb-2">
                  {isAnnual
                    ? `Annual Compensation: $${(compensation * 12).toFixed(2)}`
                    : `Monthly Compensation: $${compensation.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VA_Disability_Calculator
