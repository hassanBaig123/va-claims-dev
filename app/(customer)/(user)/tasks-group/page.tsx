'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import TasksGroup from '@/components/tasks-group-page/tasksGroupComponent'

const TasksGroupPage = () => {
  const router = useRouter()

  return (
    <div>
      <TasksGroup />
    </div>
  )
}

export default TasksGroupPage
