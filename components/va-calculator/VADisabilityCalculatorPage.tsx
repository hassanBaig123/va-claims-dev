'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface Disability {
  id: number
  type: string
  percentage: number
}

const disabilityOptions = [
  'Right Arm',
  'Left Arm',
  'Right Leg',
  'Left Leg',
  'Right Foot',
  'Left Foot',
  'Back',
  'SSD',
  'PTSD',
  'Tinnitus',
  'Migraines',
  'Sleep Apnea',
  'Other',
]

// Base rates for Veteran Alone (2024 rates)
const baseRates: { [key: number]: number } = {
  10: 171.23,
  20: 338.49,
  30: 524.31,
  40: 755.28,
  50: 1075.16,
  60: 1361.88,
  70: 1716.28,
  80: 1995.01,
  90: 2241.91,
  100: 3737.85,
}

// Supplemental rates based on family composition (additional amounts)
interface SupplementalRates {
  [key: number]: {
    spouse: number
    spouseAidAttendance: number
    childUnder18: number
    childOver18: number
    parent: number
  }
}

const supplementalRates: SupplementalRates = {
  30: {
    spouse: 62.0,
    spouseAidAttendance: 57.0,
    childUnder18: 31.0,
    childOver18: 100.0,
    parent: 50.0,
  },
  40: {
    spouse: 83.0,
    spouseAidAttendance: 76.0,
    childUnder18: 41.0,
    childOver18: 133.0,
    parent: 67.0,
  },
  50: {
    spouse: 104.0,
    spouseAidAttendance: 95.0,
    childUnder18: 51.0,
    childOver18: 167.0,
    parent: 83.0,
  },
  60: {
    spouse: 125.0,
    spouseAidAttendance: 114.0,
    childUnder18: 62.0,
    childOver18: 200.0,
    parent: 100.0,
  },
  70: {
    spouse: 145.0,
    spouseAidAttendance: 134.0,
    childUnder18: 72.0,
    childOver18: 234.0,
    parent: 116.0,
  },
  80: {
    spouse: 166.0,
    spouseAidAttendance: 153.0,
    childUnder18: 82.0,
    childOver18: 267.0,
    parent: 133.0,
  },
  90: {
    spouse: 187.0,
    spouseAidAttendance: 172.0,
    childUnder18: 93.0,
    childOver18: 301.0,
    parent: 150.0,
  },
  100: {
    spouse: 208.4,
    spouseAidAttendance: 191.14,
    childUnder18: 103.55,
    childOver18: 334.49,
    parent: 166.0,
  },
}

const VADisabilityCalculatorPage: React.FC = () => {
  const [disabilities, setDisabilities] = useState<Disability[]>([])
  const [disabilityType, setDisabilityType] = useState('')
  const [otherDisability, setOtherDisability] = useState('')
  const [disabilityPercentage, setDisabilityPercentage] = useState<number[]>([
    10,
  ])
  const [isMarried, setIsMarried] = useState(false)
  const [spouseAid, setSpouseAid] = useState(false)
  const [hasChildren, setHasChildren] = useState(false)
  const [minorChildren, setMinorChildren] = useState(0)
  const [adultChildren, setAdultChildren] = useState(0)
  const [hasParentDependents, setHasParentDependents] = useState(false)
  const [parentDependents, setParentDependents] = useState(0)
  const [displayPercentage, setDisplayPercentage] = useState(0)

  // Function to calculate combined rating using VA math
  const calculateCombinedRating = (ratings: number[]): number => {
    if (ratings.length === 0) return 0
    let combined = ratings[0]
    for (let i = 1; i < ratings.length; i++) {
      combined = Math.ceil(combined + (ratings[i] * (100 - combined)) / 100)
      console.log("Combined: ", combined);
    }
    return combined
  }

  // Function to calculate bilateral factor
  const calculateBilateralFactor = (disabilities: Disability[]) => {
    // Group disabilities by limb type and side
    const limbDisabilities: {
      [key: string]: { left: number[]; right: number[] }
    } = {
      Arm: { left: [], right: [] },
      LowerExtremity: { left: [], right: [] },
    }
    const otherDisabilities: number[] = []

    disabilities.forEach((d) => {
      let side = ''
      if (d.type.startsWith('Left ')) {
        side = 'left'
      } else if (d.type.startsWith('Right ')) {
        side = 'right'
      }

      if (side) {
        if (d.type.includes('Arm')) {
          limbDisabilities.Arm[side as 'left' | 'right'].push(d.percentage)
        } else if (d.type.includes('Leg') || d.type.includes('Foot')) {
          limbDisabilities.LowerExtremity[side as 'left' | 'right'].push(d.percentage)
        }
      } else {
        otherDisabilities.push(d.percentage)
      }
    })

    let bilateralCombinedRatings: number[] = []
    let singleLimbDisabilities: number[] = []

    // For each limb type
    for (const limbType in limbDisabilities) {
      const sides = limbDisabilities[limbType as keyof typeof limbDisabilities]

      // Combine disabilities on the same side
      const leftCombined =
        sides.left.length > 0 ? calculateCombinedRating(sides.left) : null
      const rightCombined =
        sides.right.length > 0 ? calculateCombinedRating(sides.right) : null

      if (leftCombined != null && rightCombined != null) {
        // Both sides have disabilities, add to bilateral
        bilateralCombinedRatings.push(leftCombined)
        bilateralCombinedRatings.push(rightCombined)
      } else {
        // Only one side has disabilities, add to otherDisabilities
        if (leftCombined != null) {
          singleLimbDisabilities.push(leftCombined)
        }
        if (rightCombined != null) {
          singleLimbDisabilities.push(rightCombined)
        }
      }
    }

    let bilateralCombined = 0
    let bilateralFactor = 0

    if (bilateralCombinedRatings.length > 0) {
      // Combine all bilateral ratings
      bilateralCombined = calculateCombinedRating(bilateralCombinedRatings)
      // Apply bilateral factor
      bilateralFactor = bilateralCombined * 0.1
      bilateralCombined += bilateralFactor
    }

    // Combine other disabilities
    const allOtherDisabilities = [
      ...singleLimbDisabilities,
      ...otherDisabilities,
    ]

    return {
      bilateralCombined,
      bilateralFactor,
      otherDisabilities: allOtherDisabilities,
    }
  }

  // Function to calculate overall rating
  const calculateOverallRating = (): {
    combined: number
    rounded: number
    bilateralFactor: number
  } => {
    if (disabilities.length === 0)
      return { combined: 0, rounded: 0, bilateralFactor: 0 }

    const { bilateralCombined, bilateralFactor, otherDisabilities } =
      calculateBilateralFactor(disabilities)

    let combinedRating = bilateralCombined

    if (otherDisabilities.length > 0) {
      combinedRating = calculateCombinedRating([
        combinedRating,
        ...otherDisabilities,
      ])
    }

    const exactCombinedRating = combinedRating

    // Round to nearest whole number
    const roundedCombined = Math.round(combinedRating)

    // Round to nearest 10%
    const finalCombined = Math.round(roundedCombined / 10) * 10

    return {
      combined: exactCombinedRating,
      rounded: finalCombined,
      bilateralFactor,
    }
  }

  const handleAddDisability = () => {
    let type = disabilityType
    if (disabilityType === 'Other' && otherDisability.trim() !== '') {
      type = otherDisability.trim()
    }

    if (type && disabilityPercentage[0] > 0) {
      const newDisability: Disability = {
        id: Date.now(),
        type,
        percentage: disabilityPercentage[0],
      }
      setDisabilities([...disabilities, newDisability])
      setDisabilityType('')
      setOtherDisability('')
      setDisabilityPercentage([10])
    }
  }

  const handleRemoveDisability = (id: number) => {
    setDisabilities(disabilities.filter((d) => d.id !== id))
  }

  const {
    combined: combinedRating,
    rounded: roundedRating,
    bilateralFactor,
  } = calculateOverallRating()

  useEffect(() => {
    let start = displayPercentage
    const end = roundedRating
    if (start === end) return

    const increment = end > start ? 1 : -1
    const duration = 500
    const stepTime = Math.abs(Math.floor(duration / (end - start)))

    const timer = setInterval(() => {
      start += increment
      setDisplayPercentage(start)
      if (start === end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [roundedRating])

  // Function to estimate monthly payment
  const estimateMonthlyPayment = (): number => {
    const rating = roundedRating

    let basePayment = baseRates[rating] || 0

    if (rating < 30) {
      return basePayment
    }

    const rates = supplementalRates[rating] || {
      spouse: 0,
      spouseAidAttendance: 0,
      childUnder18: 0,
      childOver18: 0,
      parent: 0,
    }

    let payment = basePayment

    // Add for spouse
    if (isMarried) {
      payment += rates.spouse
      if (spouseAid) {
        payment += rates.spouseAidAttendance
      }
    }

    // Add for children under 18
    if (hasChildren && minorChildren > 0) {
      payment += rates.childUnder18 * minorChildren
    }

    // Add for children over 18 in school
    if (hasChildren && adultChildren > 0) {
      payment += rates.childOver18 * adultChildren
    }

    // Add for parent dependents
    if (hasParentDependents && parentDependents > 0) {
      payment += rates.parent * parentDependents
    }

    // Round to two decimal places
    return Math.round(payment * 100) / 100
  }

  const estimatedPayment = estimateMonthlyPayment()

  return (
    <div className="max-w-5xl mx-auto p-4 mt-24">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-4 text-center">
          VA Disability Calculator
        </h1>
        <p className="text-lg text-center">
          Our VA Disability Calculator helps you estimate your combined VA
          disability rating and monthly compensation. Simply add your
          disabilities, provide family details, and let our calculator do the
          math for you.
        </p>
      </section>

      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="md:w-1/2">
          {/* Disabilities Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Disabilities</h2>
            <div className="space-y-4">
              {/* Disability Type Selection */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="disabilityType">Disability Type</Label>
                <Select
                  onValueChange={(value) => setDisabilityType(value)}
                  value={disabilityType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Disability" />
                  </SelectTrigger>
                  <SelectContent>
                    {disabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specify Other Disability */}
              {disabilityType === 'Other' && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="otherDisability">Specify Disability</Label>
                  <Input
                    id="otherDisability"
                    placeholder="Enter Disability"
                    value={otherDisability}
                    onChange={(e) => setOtherDisability(e.target.value)}
                  />
                </div>
              )}

              {/* Disability Percentage Slider */}
              <div className="flex flex-col space-y-2">
                <Label>Disability Percentage: {disabilityPercentage[0]}%</Label>
                <Slider
                  value={disabilityPercentage}
                  onValueChange={(value) => setDisabilityPercentage(value)}
                  min={10}
                  max={100}
                  step={10}
                />
              </div>

              {/* Add Disability Button */}
              <Button
                onClick={handleAddDisability}
                variant={'default'}
                className={`w-full`}
                disabled={!disabilityType || disabilityPercentage[0] <= 0}
              >
                Add Disability
              </Button>
            </div>

            {/* List of Added Disabilities */}
            {disabilities.length > 0 && (
              <ul className="mt-6 space-y-2">
                {disabilities.map((disability) => (
                  <li
                    key={disability.id}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>
                      {disability.type}: {disability.percentage}%
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveDisability(disability.id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Family Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Family</h2>
            <div className="space-y-4">
              {/* Married Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isMarried"
                  checked={isMarried}
                  onCheckedChange={(checked) => {
                    setIsMarried(!!checked)
                    if (!checked) {
                      setSpouseAid(false)
                    }
                  }}
                />
                <Label htmlFor="isMarried">Married</Label>
              </div>

              {/* Spouse Requires Aid and Attendance */}
              {isMarried && (
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="spouseAid"
                    checked={spouseAid}
                    onCheckedChange={(checked) => setSpouseAid(!!checked)}
                  />
                  <Label htmlFor="spouseAid">
                    Spouse requires Aid and Attendance
                  </Label>
                </div>
              )}

              {/* Children Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasChildren"
                  checked={hasChildren}
                  onCheckedChange={(checked) => {
                    setHasChildren(!!checked)
                    if (!checked) {
                      setMinorChildren(0)
                      setAdultChildren(0)
                    }
                  }}
                />
                <Label htmlFor="hasChildren">Children</Label>
              </div>

              {/* Children Details */}
              {hasChildren && (
                <div className="ml-6 space-y-4">
                  {/* Minor Children */}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="minorChildren">Under 18:</Label>
                    <Input
                      id="minorChildren"
                      type="number"
                      value={minorChildren}
                      onChange={(e) => setMinorChildren(Number(e.target.value))}
                      min={0}
                      max={10}
                      className="w-20"
                    />
                  </div>

                  {/* Adult Children */}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="adultChildren">
                      18 & Over (in school):
                    </Label>
                    <Input
                      id="adultChildren"
                      type="number"
                      value={adultChildren}
                      onChange={(e) => setAdultChildren(Number(e.target.value))}
                      min={0}
                      max={10}
                      className="w-20"
                    />
                  </div>
                </div>
              )}

              {/* Parent Dependents Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasParentDependents"
                  checked={hasParentDependents}
                  onCheckedChange={(checked) => {
                    setHasParentDependents(!!checked)
                    if (!checked) {
                      setParentDependents(0)
                    }
                  }}
                />
                <Label htmlFor="hasParentDependents">Parent Dependents</Label>
              </div>

              {/* Parent Dependents Details */}
              {hasParentDependents && (
                <div className="ml-6 flex items-center space-x-2">
                  <Label htmlFor="parentDependents">
                    Number of Dependent Parents:
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setParentDependents(Number(value))
                    }
                    value={parentDependents.toString()}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={() => {
              setDisabilities([])
              setDisabilityType('')
              setOtherDisability('')
              setDisabilityPercentage([10])
              setIsMarried(false)
              setSpouseAid(false)
              setHasChildren(false)
              setMinorChildren(0)
              setAdultChildren(0)
              setHasParentDependents(false)
              setParentDependents(0)
              setDisplayPercentage(0)
            }}
            className="w-full"
          >
            Reset
          </Button>
        </div>

        {/* Right Side - Results */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex flex-col items-center justify-center space-y-6">
          {/* Monthly Payment */}
          <div className="text-center">
            <h3 className="text-xl font-semibold">
              Your Monthly Payment From The VA
            </h3>
            <p className="text-5xl font-bold mt-2">
              ${estimatedPayment.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              If approved & based on the criteria you selected
            </p>
          </div>

          {/* Percentage Circle */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="250" height="250">
                <circle
                  cx="125"
                  cy="125"
                  r="100"
                  stroke="#e6e6e6"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="125"
                  cy="125"
                  r="100"
                  stroke="#4f46e5"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="628"
                  strokeDashoffset={628 - (displayPercentage / 100) * 628}
                  transform="rotate(-90 125 125)"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{displayPercentage}%</span>
                <p className="text-base font-medium">Current Disability</p>
              </div>
            </div>

            {/* Combined Disability and Bilateral Factor */}
            <div className="mt-4 text-center">
              <p className="text-lg font-medium">
                Combined Disability: {combinedRating.toFixed(2)}%
              </p>
              {bilateralFactor > 0 && (
                <p className="text-sm text-gray-600">
                  A bilateral factor of {bilateralFactor.toFixed(2)}% was
                  applied
                </p>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center px-4">
            <h3 className="text-2xl font-semibold">
              Unhappy With Your VA Disability Rating?
            </h3>
            <p className="mt-2 text-lg font-bold">WE CAN HELP!</p>
            <Link href="/#pricing-section" passHref>
              <Button className="mt-4">Sign Up Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VADisabilityCalculatorPage