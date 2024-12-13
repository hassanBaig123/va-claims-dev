'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import TasksPage from '@/components/tasks-page/userNewTasksComponent'

const Tasks = () => {
  const router = useRouter()

  return (
    <div>
      <TasksPage />
    </div>
  )
}

export default Tasks
