'use client'

import React, { useEffect, useState } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AddTaskDialog } from './add-tasks/add-task'

import './tasks-style.css'
import { getNodes, getTaskById } from '@/api-services/tasks'
import { getTools } from '@/api-services/tools'

interface AddTasksPageProps {
  taskId: string
}

const AddTasksPage: React.FC<AddTasksPageProps> = ({ taskId }) => {
  const [taskData, setTaskData] = useState<any | null>(null)
  const [agents, setAgents] = useState<any | null>(null)
  const [tools, setTools] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchTaskData = async () => {
    if (taskId === 'add') return

    const task = await getTaskById(taskId)
    if (task) {
      setTaskData(task)
    } else {
      console.error('Task not found')
    }
  }

  const fetchTools = async () => {
    const data = await getTools()
    if (data) {
      setTools(data)
    } else {
      setError('Failed to fetch tools')
    }
  }

  const fetchNodes = async () => {
    const result = await getNodes()
    if (result && result.agentClasses) {
      setAgents(result.agentClasses)
    } else {
      setError('Failed to fetch tasks')
    }
  }

  useEffect(() => {
    fetchNodes()
    fetchTaskData()
    fetchTools()
  }, [taskId])

  return (
    <>
      <div className="wrapper">
        <div className="headerDiv mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Task</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <AddTaskDialog
            data={taskData} 
            agents={agents}
            allTools={tools}
          />
        </div>
      </div>
    </>
  )
}

export default AddTasksPage
