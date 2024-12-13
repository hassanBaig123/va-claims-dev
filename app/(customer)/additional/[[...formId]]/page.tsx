'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'

import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'
import { PurchaseProduct } from '@/components/learn-more/paypal'
import { QuestionFactory } from '@/components/intake/QuestionFactory'
import FullScreenLoader from '@/components/partials/FullScreenLoader'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

const questionnaireDataset: { pages: Page[] } = {
  pages: [
    {
      pageNumber: 1,
      questions: [
        {
          id: 'conditions',
          label:
            "Use the 'Add new condition' to select the condition and make your evidence selections for your Nexus Letters and Personal Statements.",
          component: 'condition-search-additional',
          options: [], // Example conditions
          required: true,
        },
      ],
    },
  ],
}

const Intake2 = ({ params }: { params: { formId: string } }) => {
  const router = useRouter()
  const { user } = useSupabaseUser()

  const [formId, setFormId] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [allPages] = useState<Page[]>(questionnaireDataset.pages)
  const [additionalLetterProducts, setAdditionalLetterProducts] = useState<
    PurchaseProduct[] | []
  >()

  const initializeQuestions = useCallback(() => {
    return questionnaireDataset.pages.flatMap((page): Question[] => {
      if (!page.conditional) return page.questions
      return []
    })
  }, [])

  const [formState, setFormState] = useState<FormState>({
    questions: initializeQuestions(),
    answers: {},
  })

  const findProduct = (name: string) =>
    additionalLetterProducts?.find((product) => product?.name === name)
  const nexusLetterProduct = findProduct('Nexus Letter')
  const personalStatementProduct = findProduct('Personal Statement')

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

        if (question.component === 'condition-search-additional') {
          // Check if the answer is an array and has at least one non-empty item
          return (
            Array.isArray(answer) &&
            answer.length > 0 &&
            answer.some((item: any) => {
              if (typeof item === 'string') {
                return item.trim() !== ''
              } else if (typeof item === 'object' && item !== null) {
                // Assuming the item might be an object with a 'name' or 'value' property
                return (
                  (item.name && item.name.trim() !== '') ||
                  (item.value && item.value.trim() !== '')
                )
              }
              return false
            })
          )
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
    getPurchaseProducts('stripe-additional', setAdditionalLetterProducts)
  }, [])

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
    return fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form: {
          type: 'additional',
          title: 'Purchase Additional Custom Evidence Templates',
          status: 'created',
          user_id: user?.id,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFormId(data.id)
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
        openDialog()
      },
    },
  )

  const openDialog = async () => {
    const products: any = []
    let totalPrice = 0
    const conditions = formState.answers['conditions']
    conditions.forEach((condition: any) => {
      if (condition.details?.nexusLetter) {
        products.push(nexusLetterProduct?.id)
        totalPrice += +(nexusLetterProduct?.price || 0)
      }
      if (condition.details?.personalStatement) {
        products.push(personalStatementProduct?.id)
        totalPrice += +(personalStatementProduct?.price || 0)
      }
    })

    try {
      const paramsCheckout = {
        products: JSON.stringify(products),
        isAdditionalLetterCheckout: 'true',
        conditions: JSON.stringify(
          conditions.map((condition: any) => {
            const products = []
            let type = null
            if (condition.details?.nexusLetter) {
              products.push(nexusLetterProduct?.id)
              type = 'nexus_letter'
            }
            if (condition.details?.personalStatement) {
              products.push(personalStatementProduct?.id)
              if (type) {
                type = 'both'
              } else {
                type = 'personal_statement'
              }
            }
            return {
              category: condition.category,
              label: condition.label,
              products: products,
              report_type: type,
            }
          }),
        ),
      }
      const qs = '?' + new URLSearchParams(paramsCheckout).toString()
      router.push('/checkout' + qs)
    } catch (error) {
      console.error('Error:', error)
    }
  }
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
    const formData = {
      id: formId,
      status: 'created',
      type: 'additional',
      title: 'Purchase Additional Custom Evidence Templates',
      questions: formState.questions.map((question) => ({
        question: question,
        answer: formState.answers[question.id] || '',
      })),
    }
    setProgress(100)
    setIsLoading(false)
    openDialog()
    // console.log('Submitting form data:', formData);
    // submitForm(formData)
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
        <section className="bg-white shadow-sm p-4 mt-8">
          <div className="container mx-auto">
            <h1 className="text-center text-2xl mb-2">
              Select custom evidence template conditions
            </h1>
          </div>
        </section>

        {/* Main content */}
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto shadow-md border border-gray-100 bg-white rounded-lg p-6">
            {currentPage ? (
              currentPage.questions.map(
                (question: { id: string }, index: any) => (
                  <div key={question.id} className="mb-6">
                    <QuestionFactory
                      question={question}
                      value={formState.answers[question.id] || ''}
                      onChange={(answer) => onChange(question.id, answer)}
                      formState={formState as any}
                    />
                  </div>
                ),
              )
            ) : (
              <div className="text-center">Loading...</div>
            )}
          </div>
        </main>

        {/* Footer */}
        <section className="bg-white shadow-sm p-4 mt-auto border-t border-t-gray-100">
          <div className="container mx-auto flex justify-center space-x-4">
            <button
              onClick={() => router.push('/todos')}
              className={`px-6 py-2 rounded-full text-white transition-colors bg-green-500 hover:bg-green-600`}
            >
              Back
            </button>
            {currentPageIndex === displayedPages.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isSuccess}
                className={`px-6 py-2 rounded-full text-white transition-colors ${
                  isSubmitting || isSuccess
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Proceed to payment'}
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
