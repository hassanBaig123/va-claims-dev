export interface Question {
  id: string
  label: string
  component: string
  options?: string[]
  required?: boolean
}

export interface QuestionsPage {
  pageNumber: number
  questions: Question[]
  conditional?: {
    field: string
    value: string
  }
  categories?: string[]
}
