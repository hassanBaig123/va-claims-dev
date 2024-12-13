import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Pen, Trash2 } from 'lucide-react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { DataTable } from './data-table'
import { AddTasksGroupDialog } from './add-tasks-group/add-tasks-group'
import { getTools } from '@/api-services/tools'
import { DelTasksGroupDialog } from './delete-tasks-group/del-tasks-group'

import './tasksGroup-style.css'
import { getNodes } from '@/api-services/tasks'

const TasksGroup: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<any | null>(null)
  const [selectedToolForDel, setSelectedToolForDel] = useState<any | null>(null)
  const [tasksGroup, setTasksGroup] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string | ''>('')

  const fetchNodes = async () => {
    setLoading(true)
    const result = await getNodes('', search)
    if (result && result.tasksGroup) {
      setTasksGroup(result.tasksGroup)
    } else {
      setError('Failed to fetch tasks group')
    }
    if (result && result.tasks) {
      setTasks(result.tasks)
    } else {
      setError('Failed to fetch tasks group')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      const result = await getNodes('', search)
      if (result) {
        setTasksGroup(result.tasksGroup)
      } else {
        setError('Failed to fetch tasks')
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handleEditClick = (row: any) => {
    setSelectedTool(row?.original)
  }

  const handleDelClick = (row: any) => {
    setSelectedToolForDel(row?.original)
  }

  const columns: ColumnDef<{
    name: string
    description: string
    tasks: any
  }>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <div className="returnKeysDiv">
            <span>{row?.original?.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        return (
          <div className="returnKeysDiv">
            <span>{row?.original?.description}</span>
          </div>
        )
      },
    },
    {
      id: 'tasks',
      header: () => <div className="text-left">Tasks</div>,
      cell: ({ row }) => {
        return (
          <div className="returnKeysDiv">
            {row && row?.original?.tasks?.length
              ? row?.original?.tasks?.map((e: any, index: any) => (
                  <Badge key={index} variant="outline">
                    {e && e?.name}
                  </Badge>
                ))
              : '-'}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="actionsDiv">
            <div onClick={() => handleEditClick(row)}>
              <Pen height={16} width={16} className="cursor-pointer" />
            </div>
            <div onClick={() => handleDelClick(row)}>
              <Trash2 height={16} width={16} className="cursor-pointer" />
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <div className="wrapper">
      <div className="headerDiv">
        <span className="heading">Tasks Groups ({tasksGroup.length})</span>
        <AddTasksGroupDialog
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          onSuccess={fetchNodes}
          existingToolNames={
            tasksGroup && tasksGroup?.map((group) => group.name)
          }
          allTask={tasks}
        />
        <DelTasksGroupDialog
          selectedTool={selectedToolForDel}
          setSelectedTool={setSelectedToolForDel}
          onSuccess={fetchNodes}
        />
      </div>
      <div>
        <DataTable
          setSearch={setSearch}
          search={search}
          columns={columns}
          data={tasksGroup}
        />
      </div>
    </div>
  )
}

export default TasksGroup
