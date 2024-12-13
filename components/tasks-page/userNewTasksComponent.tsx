import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Pen, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { DataTable } from './data-table'
import { DelTaskDialog } from './delete-tasks/del-task'

import './tasks-style.css'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { getNodes } from '@/api-services/tasks'

const TasksPage: React.FC = () => {
  const router = useRouter()
  const [selectedRowForDel, setSelectedRowForDel] = useState<any | null>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string | ''>('')

  const fetchNodes = async () => {
    setLoading(true)
    const result = await getNodes(search, '')
    if (result) {
      setTasks(result.tasks)
    } else {
      setError('Failed to fetch tasks')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      const result = await getNodes(search, '')
      if (result) {
        setTasks(result.tasks)
      } else {
        setError('Failed to fetch tasks')
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handleAddTaskClick = (course_id: string) => {
    router.push(`/tasks/${course_id}`)
  }

  const handleEditClick = (row: any) => {
    router.push(`/tasks/${row?.original?.id}`)
  }

  const handleDelClick = (row: any) => {
    setSelectedRowForDel(row?.original)
  }

  const columns: ColumnDef<{
    name: string
    description: string
    agent_class: string
    tools: any
  }>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="returnKeysDiv">
          <span>{row?.original?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="returnKeysDiv">
          <span>{row?.original?.description}</span>
        </div>
      ),
    },
    {
      accessorKey: 'agent_class',
      header: 'Agents',
      cell: ({ row }) => (
        <div className="returnKeysDiv">
          <span>{row?.original?.agent_class}</span>
        </div>
      ),
    },
    {
      id: 'tools',
      header: () => <div className="text-left">Tools</div>,
      cell: ({ row }) => (
        <div className="returnKeysDiv">
          {row?.original?.tools?.length
            ? row?.original?.tools?.map((e: any, index: any) => (
                <Badge key={index} variant="outline">
                  {e}
                </Badge>
              ))
            : '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="actionsDiv">
          <div onClick={() => handleEditClick(row)}>
            <Pen height={16} width={16} className="cursor-pointer" />
          </div>
          <div onClick={() => handleDelClick(row)}>
            <Trash2 height={16} width={16} className="cursor-pointer" />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="wrapper">
      <div className="headerDiv">
        <span className="heading">Tasks ({tasks.length})</span>
        <div>
          <Button
            onClick={() => handleAddTaskClick('add')}
            className="headerBtn"
          >
            Create New Task
          </Button>
        </div>
        <DelTaskDialog
          selectedRow={selectedRowForDel}
          setSelectedRow={setSelectedRowForDel}
          onSuccess={fetchNodes}
        />
      </div>
      <div>
        <DataTable
          setSearch={setSearch}
          search={search}
          columns={columns}
          data={tasks}
        />
      </div>
    </div>
  )
}

export default TasksPage
