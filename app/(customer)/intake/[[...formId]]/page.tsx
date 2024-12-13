'use client'
import { QuestionFactory } from '@/components/intake/QuestionFactory'
import { Progress } from '@/components/ui/progress'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { createClient } from '@/utils/supabase/client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'
import FullScreenLoader from '@/components/partials/FullScreenLoader'

const questionnaireDataset: { pages: Page[] } = {
  pages: [
    {
      pageNumber: 1,
      questions: [
        {
          id: 'military-status',
          label: 'Military Status',
          component: 'radio',
          options: ['Active Duty', 'Veteran'],
        },
        {
          id: 'job-title',
          label: 'Full Job Title (e.g. Infantryman not 11B)',
          component: 'text-area',
          placeholder: 'Infantryman',
        },
        {
          id: 'branch-of-service',
          label: 'Branch of Service',
          component: 'dropdown',
          options: ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force'],
        },
        {
          id: 'dates-of-service',
          label: 'Dates of Service',
          component: 'date-range',
        },
      ],
    },
    {
      pageNumber: 2,
      questions: [
        {
          id: 'diagnosed-conditions',
          label: 'What conditions are you diagnosed with?',
          component: 'condition-search',
          options: [], // Example conditions
          required: true
        },
      ],
      conditional: {
        field: 'military-status',
        value: 'Active Duty',
      },
    },
    {
      pageNumber: 3,
      questions: [
        {
          id: 'diagnosed-conditions',
          label: `List all the health conditions that you:
                  1.) Want to get service-connected (new conditions).
                  2.) Already have service-connected (rated by the VA).
                  Example: Back pain, PTSD, hearing loss, etc.`,
          component: 'condition-search',
          options: [],
          required: true
        },
        {
          id: 'additional-information',
          label:
            'Please provide any additional information that may be relevant to your claim.',
          component: 'text-area',
          required: false
        },
      ],
      conditional: {
        field: 'military-status',
        value: 'Veteran',
      },
    },
    //{
    //  pageNumber: 4,
    //  questions: [
    //    {
    //      id: 'condition-diagnosed-in-service',
    //      label: 'Was the condition diagnosed in service?',
    //      component: 'radio',
    //      options: ['Yes', 'No']
    //    },
    //    {
    //      id: 'current-diagnosis',
    //      label: 'Do you have a current diagnosis or doctor that would sign a nexus letter for the condition?',
    //      component: 'radio',
    //      options: ['Yes', 'No']
    //    },
    //    {
    //      id: 'condition-severity',
    //      label: 'The severity of the condition according to the 38CFR rating criteria',
    //      component: 'text-area'
    //    },
    //    {
    //      id: 'condition-impact',
    //      label: 'The impact of the condition on your life',
    //      component: 'text-area'
    //    },
    //    {
    //      id: 'condition-symptoms',
    //      label: 'The symptoms of the condition based on the 38 CFR criteria',
    //      component: 'multi-select',
    //      options: ['Symptom A', 'Symptom B', 'Symptom C']
    //    },
    //    {
    //      id: 'condition-duration',
    //      label: 'The duration of the condition',
    //      component: 'text-area'
    //    },
    //    {
    //      id: 'condition-frequency',
    //      label: 'The frequency of the condition',
    //      component: 'text-area'
    //    },
    //    {
    //      id: 'social-occupational-impairment',
    //      label: 'Social and occupational impairment based on the 38 CFR criteria',
    //      component: 'text-area'
    //    }
    //  ]
    //}
  ],
}

const Intake2 = ({ params }: { params: { formId: string } }) => {
  // console.log({ params })
  const { user } = useSupabaseUser()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const initializeQuestions = useCallback(() => {
    return questionnaireDataset.pages.flatMap((page): Question[] => {
      if (!page.conditional) return page.questions
      return []
    })
  }, [])

  const [formState, setFormState] = useState<FormState>({
    questions: initializeQuestions(),
    answers: {}
  })
  // console.log({ formState })
  const [allPages] = useState<Page[]>(questionnaireDataset.pages)
  const [progress, setProgress] = useState(0)
  const [formId, setFormId] = useState(null)

  const router = useRouter()

  const displayedPages = useMemo(() => {
    return allPages.filter((page) => {
      if (!page.conditional) return true
      const conditionMet = Array.isArray(
        formState.answers[page.conditional.field],
      )
        ? formState.answers[page.conditional.field].includes(
            page.conditional.value,
          )
        : formState.answers[page.conditional.field] === page.conditional.value
      return conditionMet
    })
  }, [allPages, formState.answers])

  const currentPage = useMemo(
    () => displayedPages[currentPageIndex],
    [displayedPages, currentPageIndex],
  )

  const isPageComplete = useCallback(
    (page: Page) => {
      return page.questions.every((question: any) => {
        const answer = formState.answers[question.id]
        
        if (question.required === false) {
          return true
        }
        
        if (question.component === 'condition-search') {
          // Check if the answer is an array and has at least one non-empty item
          return Array.isArray(answer) && answer.length > 0 && answer.some((item: any) => {
            if (typeof item === 'string') {
              return item.trim() !== ''
            } else if (typeof item === 'object' && item !== null) {
              // Assuming the item might be an object with a 'name' or 'value' property
              return (item.name && item.name.trim() !== '') || (item.value && item.value.trim() !== '')
            }
            return false
          })
        }
        
        // For other components
        if (Array.isArray(answer)) {
          return answer.length > 0
        }
        
        return answer !== undefined && answer !== '' && answer !== null
      })
    },
    [formState.answers],
  )

  const updateProgress = useCallback(() => {
    const totalPages = displayedPages.length
    const completedPages = currentPageIndex
    const newProgress = (completedPages / totalPages) * 100
    setProgress(newProgress)
  }, [displayedPages.length, currentPageIndex])

  useEffect(() => {
    updateProgress()
  }, [currentPageIndex, displayedPages, updateProgress])

  useEffect(() => {
    if (!user) return

    setIsLoading(true)

    if (formId == null) {
      // console.log(
      //   `Initializing form with user id and formId: ${user?.id} and ${formId}`,
      // )
      initializeFormMutation.mutate()
    } else if (formId) {
      // console.log(`Retrieving form with formId: ${formId}`)
      retrieveFormMutation.mutate(formId)
    }
  }, [user, formId])

  useEffect(() => {
    // Ensure currentPageIndex is valid when displayedPages changes
    if (currentPageIndex >= displayedPages.length) {
      setCurrentPageIndex(Math.max(displayedPages.length - 1, 0))
    }
  }, [displayedPages, currentPageIndex])

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      questions: questionnaireDataset.pages.flatMap((page): Question[] => {
        if (!page.conditional) return page.questions
        const conditionMet = Array.isArray(
          prevState.answers[page.conditional.field],
        )
          ? prevState.answers[page.conditional.field].includes(
              page.conditional.value,
            )
          : prevState.answers[page.conditional.field] === page.conditional.value
        return conditionMet ? page.questions : []
      }),
    }))
  }, [formState.answers])

  const onChange = useCallback((questionId: string, newAnswer: any) => {
    setFormState((prevState) => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [questionId]: newAnswer,
      },
    }))
  }, [])

  const goToPage = useCallback(
    (direction: 'next' | 'previous') => {
      setCurrentPageIndex((prevIndex) => {
        if (direction === 'next') {
          return Math.min(prevIndex + 1, displayedPages.length - 1)
        } else {
          return Math.max(prevIndex - 1, 0)
        }
      })
    },
    [displayedPages.length],
  )

  const initializeFormMutation = useMutation(() => {
    // console.log('Initializing form with user id:', user?.id)
    return fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form: {
          type: 'intake',
          title: 'Intake Sheet',
          status: 'created',
          user_id: user?.id,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFormId(data.id)
        // console.log('Form initialization response:', data)
        const answers =
          data.form && data.form.questions
            ? data.form.questions.reduce((acc: any, question: any) => {
                acc[question.question.id] = question.answer
                return acc
              }, {})
            : {}
        setFormState((prevState) => ({
          ...prevState,
          questions: initializeQuestions(),
          answers: answers,
        }))
        setIsLoading(false)
        // console.log('Form State:', formState)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error initializing form:', error)
      })
  })

  const {
    mutate: submitForm,
    isLoading: isSubmitting,
    error: submitError,
    isSuccess,
  } = useMutation(
    async (form: any) => {
      setProgress(75)
      const response = await fetch(`/api/form/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form: form }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit form')
      }
      return await response.json()
    },
    {
      onSuccess: (data) => {
        setProgress(100)
      },
      onError: (error) => {
        console.error('Error submitting form:', error)
        // Error is handled in the JSX
      },
      onSettled: (data, error) => {
        // console.log('Form submitted successfully:', data)
        router.push('/todos')
      },
    },
  )

  const retrieveFormMutation = useMutation(
    (formId: string) => {
      return fetch(`/api/form/${formId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    {
      onSuccess: (data) => {
        setIsLoading(false)
      },
      onError: (error) => {
        setIsLoading(false)
      },
    },
  )

  useEffect(() => {
    console.log('Current page:', currentPage)
    console.log('Form state:', formState)
    console.log('Is page complete:', isPageComplete(currentPage))
  }, [currentPage, formState, isPageComplete])

  const handleSubmit = useCallback(() => {
    if (!formState || !formId) return
    const formData = {
      id: formId,
      status: 'submitted',
      type: 'intake',
      title: 'Intake Form',
      questions: formState.questions.map((question) => ({
        question: question,
        answer: formState.answers[question.id] || '',
      })),
    }
    // console.log('Submitting form:', formData)
    submitForm(formData)
  }, [formState, formId, submitForm])

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!currentPage) {
    return <div>No questions available.</div>
  }

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
        {/* Header */}
        <section className="bg-white shadow-sm p-4">
          <div className="container mx-auto">
            <h1 className="text-center text-2xl mb-2">Intake Form</h1>
            <Progress value={progress} className="w-full rounded-full" />
            <div className="text-center mt-2">
              <span className="font-semibold">{Math.round(progress)}%</span> -
              Page {currentPageIndex + 1} of{' '}
              {displayedPages.length === 1 ? 2 : displayedPages.length}
            </div>
          </div>
        </section>

        {/* Main content */}
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto shadow-md border border-gray-100 bg-white rounded-lg p-6">
            {currentPage ? (
              currentPage.questions.map((question: { id: string }, index: any) => (
                <div key={question.id} className="mb-6">
                  <QuestionFactory
                    question={question}
                    value={formState.answers[question.id] || ''}
                    onChange={(answer) => onChange(question.id, answer)}
                    formState={formState as any}
                  />
                </div>
              ))
            ) : (
              <div className="text-center">Loading...</div>
            )}
          </div>
        </main>

        {/* Footer */}
        <section className="bg-white shadow-sm p-4 mt-auto border-t border-t-gray-100">
          <div className="container mx-auto flex justify-center space-x-4">
            <button
              onClick={() => goToPage('previous')}
              disabled={currentPageIndex === 0 || isSuccess}
              className={`px-6 py-2 rounded-full text-white transition-colors ${
                currentPageIndex === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              Previous
            </button>
            {currentPageIndex === displayedPages.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isPageComplete(currentPage) || isSubmitting || isSuccess}
                className={`px-6 py-2 rounded-full text-white transition-colors ${
                  !isPageComplete(currentPage) || isSubmitting || isSuccess
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            ) : (
              <button
                onClick={() => goToPage('next')}
                disabled={!isPageComplete(currentPage) || isSuccess}
                className={`px-6 py-2 rounded-full text-white transition-colors ${
                  !isPageComplete(currentPage)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Intake2
