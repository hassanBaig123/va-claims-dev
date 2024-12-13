import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Pen, Trash2 } from 'lucide-react'
 
import { Badge } from '@/components/ui/badge'
import { DataTable } from './data-table'
import { AddToolDialog } from './add-tools/add-tools'
import { getTools } from '@/api-services/tools'
import { DelToolDialog } from './delete-tools/del-tools'

import './tools-style.css'

const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<any | null>(null)
  const [selectedToolForDel, setSelectedToolForDel] = useState<any | null>(null)
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string | ''>('')

  const fetchTools = async () => {
    setLoading(true)
    const data = await getTools(search) // Pass the search term
    if (data) {
      setTools(data)
    } else {
      setError('Failed to fetch tools')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await getTools(search)
      if (data) {
        setTools(data)
      } else {
        setError('Failed to fetch tools')
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
    result_keys: any
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
      id: 'result_keys',
      header: () => <div className="text-left">Result Keys</div>,
      cell: ({ row }) => {
        return (
          <div className="returnKeysDiv">
            {row && row?.original?.result_keys?.length
              ? row?.original?.result_keys?.map((e: any, index: any) => (
                  <Badge key={index} variant="outline">
                    {e && e}
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
        <span className="heading">Tools ({tools.length})</span>
        <AddToolDialog
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          onSuccess={fetchTools}
          existingToolNames={tools && tools?.map((tool) => tool.name)}
        />
        <DelToolDialog
          selectedTool={selectedToolForDel}
          setSelectedTool={setSelectedToolForDel}
          onSuccess={fetchTools}
        />
      </div>
      <div>
        <DataTable
          setSearch={setSearch}
          search={search}
          columns={columns}
          data={tools}
        />
      </div>
    </div>
  )
}

export default Tools
