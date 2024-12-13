'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useMutation } from 'react-query'
import { QuestionFactory } from '@/components/intake/QuestionFactory'
import { Progress } from '@/components/ui/progress'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import FullScreenLoader from '@/components/partials/FullScreenLoader'
import { useRouter } from 'next/navigation'
import { questionnaireDataset_Supplementary } from '@/constants'

interface FormState {
  condition: any
  questions: Question[]
  answers: AnswersState
}

const SupplementalForm = ({ params }: { params: { formId: string } }) => {
  const { user } = useSupabaseUser()
  const router = useRouter()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [allPages, setAllPages] = useState<Page[]>(
    questionnaireDataset_Supplementary.pages,
  ) // Define the state for all pages
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [formId, setFormId] = useState<string | null>(null)
  const [title, setTitle] = useState()

  const [conditionCategory, setConditionCategory] =
    useState<string>('categories')

  const initializeQuestions = useCallback(() => {
    return questionnaireDataset_Supplementary.pages.flatMap(
      (page): Question[] => {
        if (!page.conditional) return page.questions
        return []
      },
    )
  }, [])

  const [formState, setFormState] = useState<FormState>({
    condition: { label: '', category: '' },
    questions: questionnaireDataset_Supplementary.pages[0].questions,
    answers: {},
  })

  const displayedPages = useMemo(() => {
    const filteredPages = allPages.filter((page) => {
      if (!page.categories) return true
      return page.categories.includes(conditionCategory)
    })
    const conditionMetPages = filteredPages.filter((page) => {
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
    if (currentPageIndex === 0 && !conditionMetPages[1]) {
      return [filteredPages[0]]
    }
    return conditionMetPages
  }, [allPages, conditionCategory, formState.answers, currentPageIndex])

  const currentPage = useMemo(() => {
    const page = displayedPages[currentPageIndex]
    return page
  }, [displayedPages, currentPageIndex])

  const isPageComplete = useCallback(
    (page: Page) => {
      return page.questions.every((question) => {
        if (question.required === false) return true
        const answer = formState?.answers[question.id]
        return answer !== undefined && answer !== ''
      })
    },
    [formState?.answers],
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
    setFormState((prevState) => ({
      ...prevState,
      questions: questionnaireDataset_Supplementary.pages.flatMap(
        (page): Question[] => {
          if (!page.conditional) return page.questions
          const conditionMet = Array.isArray(
            prevState.answers[page.conditional.field],
          )
            ? prevState.answers[page.conditional.field].includes(
                page.conditional.value,
              )
            : prevState.answers[page.conditional.field] ===
              page.conditional.value
          return conditionMet ? page.questions : []
        },
      ),
    }))
  }, [formState.answers])

  const onChange = useCallback((questionId: string, newAnswer: any) => {
    setFormState((prevState: any) => {
      const updatedAnswers = {
        ...prevState?.answers,
        [questionId]: newAnswer,
      }
      const updatedQuestions = questionnaireDataset_Supplementary.pages.flatMap(
        (page): Question[] => {
          if (!page.conditional) return page.questions
          const conditionMet = Array.isArray(
            updatedAnswers[page.conditional.field],
          )
            ? updatedAnswers[page.conditional.field].includes(
                page.conditional.value,
              )
            : updatedAnswers[page.conditional.field] === page.conditional.value
          return conditionMet ? page.questions : []
        },
      )
      return {
        ...prevState,
        answers: updatedAnswers,
        questions: updatedQuestions,
      }
    })
  }, [])

  // We are putting the form data in as questions with the question/answer within the formstate
  const {
    mutate: submitForm,
    isLoading: isSubmitting,
    error: submitError,
    isSuccess,
  } = useMutation(
    async (form: any) => {
      setProgress(50)
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
      onSuccess: () => {
        setProgress(100)
      },
      onError: (error) => {
        console.error('Error submitting form:', error)
        // Handle submission error (e.g., show an error message)
        setProgress(0)
      },
      onSettled: (data, error) => {
        // console.log('Form submitted successfully:', data)
        router.push('/builder-questions')
      },
    },
  )

  const handleSubmit = useCallback(() => {
    if (!formState || !formId) return

    const formData = {
      id: formId,
      status: 'submitted',
      type: 'supplemental',
      user_id: user?.id,
      title: title,
      questions: formState.questions.map((question) => ({
        question: question,
        answer: formState.answers[question.id] || '',
      })),
      condition: formState.condition,
    }
    // console.log('Submitting form:', formData)
    submitForm(formData)
  }, [formState, formId, submitForm, user?.id, title])

  const goToPage = useCallback(
    (direction: 'next' | 'previous') => {
      setCurrentPageIndex((prevIndex) => {
        if (direction === 'next') {
          const nextIndex = Math.min(prevIndex + 1, displayedPages.length - 1)
          return nextIndex
        } else {
          return Math.max(prevIndex - 1, 0)
        }
      })
    },
    [displayedPages.length, handleSubmit],
  )

  const retrieveFormMutation = useMutation(
    async (formId: string) => {
      const response = await fetch(`/api/form/${formId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch form')
      }
      return await response.json()
    },
    {
      onSuccess: (data) => {
        if (data.decrypted_form) {
          const parsedForm = JSON.parse(data.decrypted_form)
          setFormId(data.id)
          const conditionCategory =
            parsedForm.condition.category || 'defaultCategory'
          setConditionCategory(conditionCategory)
          setTitle(data.title)
          console.log({
            condition: {
              label: parsedForm?.condition?.label,
              category: parsedForm?.condition?.category,
            },
          })
          setFormState((prevState) => ({
            ...prevState,
            condition: {
              label: parsedForm?.condition?.label,
              category: parsedForm?.condition?.category,
            },
          }))
          if (parsedForm.questions) {
            const answers = parsedForm.questions.reduce(
              (acc: any, question: any) => {
                acc[question.id] = question.answer
                return acc
              },
              {},
            )
            setFormState((prevState) => ({
              ...prevState,
              questions: initializeQuestions(),
              answers: answers,
            }))
          }
          setIsLoading(false)
        } else {
          console.error('Error retrieving form')
          setIsLoading(false)
        }
      },
      onError: (error) => {
        setIsLoading(false)
        console.error('Error retrieving form:', error)
      },
    },
  )

  useEffect(() => {
    if (!user) return

    if (!params.formId) {
      router.push('/todos')
    } else {
      setIsLoading(true)
      retrieveFormMutation.mutate(params.formId)
    }
  }, [user, params.formId, router])

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!currentPage) {
    console.log('No currentPage found')
    return <div>No questions available.</div>
  }

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
        {/* Header */}
        <section className="bg-white shadow-sm p-4">
          <div className="container mx-auto">
            <h1 className="text-center text-2xl mb-2">{title}</h1>
            <p className="text-center text-gray-600 mb-4 max-w-lg mx-auto w-full">
              This form helps us gather additional information about your
              condition.
            </p>
            {currentPageIndex !== 0 &&
              currentPageIndex !== displayedPages.length - 1 && (
                <>
                  <Progress value={progress} className="w-full rounded-full" />
                  <div className="text-center mt-2">
                    <span className="font-semibold">
                      {Math.round(progress)}%
                    </span>{' '}
                    - Page {currentPageIndex + 1} of {displayedPages.length}
                  </div>
                </>
              )}
          </div>
        </section>

        {/* Main content */}
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto shadow-md border border-gray-100 bg-white rounded-lg p-6">
            {displayedPages.map(
              (page, pageIndex) =>
                currentPageIndex === pageIndex && (
                  <div key={page.pageNumber} className="mb-6">
                    {page.questions.map(
                      (
                        question: { id: React.Key | null | undefined },
                        index: any,
                      ) => (
                        <div key={question.id} className="mb-6">
                          <QuestionFactory
                            question={question}
                            value={
                              formState?.answers[question.id as string] ?? ''
                            }
                            onChange={(answer) =>
                              onChange(question.id as string, answer)
                            }
                            formState={formState}
                          />
                        </div>
                      ),
                    )}
                  </div>
                ),
            )}
          </div>
        </main>

        {/* Footer */}
        <section className="bg-white shadow-sm p-4 mt-auto border-t border-t-gray-100">
          <div className="container mx-auto flex justify-center space-x-4">
            {currentPageIndex !== 0 && (
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
            )}
            {currentPageIndex === displayedPages.length - 1 &&
              !displayedPages[currentPageIndex + 1] && (
                <button
                  onClick={handleSubmit}
                  disabled={
                    !isPageComplete(currentPage) || isSubmitting || isSuccess
                  }
                  className={`px-6 py-2 rounded-full text-white transition-colors ${
                    !isPageComplete(currentPage) || isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            {currentPageIndex !== displayedPages.length - 1 && (
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

export default SupplementalForm
