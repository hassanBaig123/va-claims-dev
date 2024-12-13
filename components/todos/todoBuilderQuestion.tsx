'use client'
// UserTodoComponent.tsx
import React from 'react'
import { getUserData, getUserForms } from '@/utils/todos/dataAccessClient'

import './todo-styles.css'

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/pro-light-svg-icons'

interface SupplementalForm {
  id: string
  title: string | null
  status: 'created' | 'submitted' | 'submission_approved'
}

interface TodoSupplementalRowProps {
  formState: string | undefined
  supplementalForms: SupplementalForm[]
  intakeStatus: string
}

export default async function UserTodoBuilderQuestionComponent() {
  const userData = await getUserData()

  if (!userData) {
    return (
      <div className="w-full">
        <div className="w-full">
          Please log in to view your todo list. If you're already logged in,
          there might be an issue loading your data. Try refreshing the page or
          contact support if the problem persists.
        </div>
      </div>
    )
  }

  const userForms = await getUserForms(userData.id)

  console.log(userForms, 'userFormsuserFormsuserForms')

  const supplementalForms = userForms.filter(
    (form) => form.type === 'supplemental',
  )

  const getFormMessage = (form: SupplementalForm): string => {
    switch (form.status) {
      case 'created':
        return 'Please complete this form.'
      case 'submitted':
        return 'Your form has been submitted and is under review.'
      case 'submission_approved':
        return 'This form has been completed and approved.'
      default:
        return 'Form status is unknown.'
    }
  }

  return (
    <div className="wrapperBuilder">
      <div className="header" style={{ marginBottom: '40px' }}>
        <h1 className="headerTex">Detail Builder Questions</h1>
      </div>
      {supplementalForms.map((form, index) => (
        <div
          key={form.id}
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg`}
          style={{ marginBottom: '20px', gap: '10px' }}
        >
          <div>
            <h3 className="text-lg font-lexend-deca">{form.title}</h3>
            <p className="pl-4 sm:pl-0 text-sm text-gray-600">
              {getFormMessage(form)}
            </p>
          </div>
          {form.status === 'created' && (
            <Link
              href={`/supplemental/${form.id}`}
              className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white border border-gray-300 rounded-md px-4 py-2"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="mr-2"
                height={20}
                width={20}
              />
              Start Form
            </Link>
          )}
          {form.status === 'submitted' && (
            <p className="mt-2 sm:mt-0 text-blue-600 font-semibold">
              Your form is being reviewed.
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
