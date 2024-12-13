import { Metadata } from "next"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import React from "react"
import KanbanBoard from "@/components/admin/kanban-board"
import { getFormsBacklog } from "@/utils/data/forms/getFormsBacklog"
import { getReportsBacklog } from "@/utils/data/reports/getReportsBacklog"
import SessionMonitorModal from "@/components/SessionMonitorModal"

export const metadata: Metadata = {
  title: "Backlog",
  description: "Backlog page for the admin dashboard",
}

async function getData() {
    const forms = await getFormsBacklog()
    const reports = await getReportsBacklog()
   
    if (!forms) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return {forms, reports}
  }

export default async function BacklogPage() {
    const {forms, reports} = await getData()

  return (
    <div className="flex-1 space-y-4 pl-8 pt-6">
        <div className="flex flex-wrap items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Backlog</h2>
        </div>
        <div className="gap-4">
            <Card>
                    <CardContent className="pl-0 overflow-scroll">
                    <div className="flex flex-row divide-x-2 w-full h-[calc(100vh-250px)]">
                    <KanbanBoard forms={forms} reports={reports} />
                    </div>
                </CardContent>
            </Card>
        </div>
        <SessionMonitorModal />
    </div>
  )
};