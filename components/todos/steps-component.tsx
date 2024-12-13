'use client'
import React, { useEffect, useState } from 'react'
import './todo-styles.css'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

interface StepProps {
  steps: { id: number; label: string; content: React.ReactNode }[]
  nextStepMessage: string
  openAccordionItem: string
  stepStatuses: any
}

const StepComponent: React.FC<StepProps> = ({
  steps,
  openAccordionItem,
  stepStatuses,
}) => {
  const foundIndex = steps.findIndex((step) => step.label === openAccordionItem)
  const [currentStep, setCurrentStep] = useState(1)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 550)
  }

  useEffect(() => {
    handleResize() // Initialize on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getTabStyles = (stepId: number) => {
    const isActive = currentStep === stepId
    const isPrevious = stepId < currentStep

    return {
      background: isActive ? '#06173c' : isPrevious ? '#DEDEE04D' : '',
      borderRadius: isActive ? '0px 20px 0px 0px' : '',
      color: isActive ? 'white' : isPrevious ? '#0D1F3F' : '',
      cursor: isActive || stepId == 4 ? 'pointer' : 'default',
    }
  }

  const getResponsiveTabStyles = (stepId: number) => {
    const isActive = currentStep === stepId
    const isPrevious = stepId < currentStep

    return {
      background: isActive ? '#06173c' : isPrevious ? 'transparent' : '',
      borderRadius: isActive && stepId < 3 ? '0px 20px 0px 0px' : '',
      color: isActive ? 'white' : isPrevious ? '#0D1F3F' : '',
      cursor: isActive || stepId == 4 ? 'pointer' : 'default',
    }
  }

  useEffect(() => {
    foundIndex > -1 && setCurrentStep(foundIndex)
  }, [steps.length, openAccordionItem])

  return (
    <div>
      <div className="stepsDiv">
        {isMobileView ? (
          <>
            {steps.slice(0, 3).map((step, index) => (
              <div
                key={step?.label}
                style={getResponsiveTabStyles(index)}
                onClick={() => setCurrentStep(index)}
                className={`${step.id === 0 ? 'stepsTabFirst' : 'stepsTab'}`}
              >
                Step {index + 1}
                {stepStatuses[step?.label] && (
                  <Image
                    className="ml-[5px] green-tick"
                    src={'/icons/green-tick.svg'}
                    alt={'green-tick'}
                    height={24}
                    width={24}
                  />
                )}
              </div>
            ))}
            {steps.length > 3 && (
              <div
                className="dropdown-icon"
                onClick={() => setDropdownVisible((prev) => !prev)}
              >
                <ChevronDown height={24} width={24} />
                {dropdownVisible && (
                  <div className="dropdown">
                    {steps.slice(3).map((step, index) => (
                      <div
                        key={step?.label}
                        style={getResponsiveTabStyles(index + 3)}
                        onClick={() => {
                          setDropdownVisible(false)
                          setTimeout(() => {
                            setCurrentStep(index + 3)
                          }, 0)
                        }}
                        className="dropdown-item"
                      >
                        Step {index + 4}
                        {stepStatuses[step?.label] && (
                          <Image
                            className="ml-[5px] green-tick"
                            src={'/icons/green-tick.svg'}
                            alt={'green-tick'}
                            height={24}
                            width={24}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          steps?.map((step, index) => (
            <div
              key={step?.label}
              style={getTabStyles(index)}
              onClick={() => setCurrentStep(index)}
              className={`${step.id === 0 ? 'stepsTabFirst' : 'stepsTab'}`}
            >
              Step {index + 1}
              {stepStatuses[step?.label] && (
                <Image
                  className="ml-[5px] green-tick"
                  src={'/icons/green-tick.svg'}
                  alt={'green-tick'}
                  height={24}
                  width={24}
                />
              )}
            </div>
          ))
        )}
      </div>
      <div className="stepsContent" style={{ width: '100%' }}>
        {steps
          .filter((step, index) => index === currentStep)
          .map((step) => (
            <div key={step.id} style={{ width: '100%' }}>
              {step.content}
            </div>
          ))}
      </div>
      {dropdownVisible && (
        <div
          onClick={() => setDropdownVisible(false)}
          className="backdropDiv"
        ></div>
      )}
    </div>
  )
}

export default StepComponent
