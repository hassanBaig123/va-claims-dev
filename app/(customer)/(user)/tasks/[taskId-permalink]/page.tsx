import React from 'react'
import AddTasksPage from '@/components/tasks-page/userAddTasksComponent'

export default async function CourseContent({ params }: any) {
  const taskId = params['taskId-permalink']

  return <AddTasksPage taskId={taskId} />
}
