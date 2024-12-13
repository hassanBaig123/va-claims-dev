import { Card, CardContent } from '@/components/ui/card'
import KanbanBoard from '@/components/admin/kanban-board'
import SessionMonitorModal from '@/components/SessionMonitorModal'
import ClientSearchBox from './SearchBox'
import { getData } from '@/utils/data/forms/getFormsIndividualBacklog'

export default async function BacklogPage({
  searchParams,
}: {
  searchParams: { query?: string }
}) {
  const query = searchParams.query
  let { forms, reports } = await getData(query)

  return (
    <div className="flex-1 space-y-4 pl-8 pt-6">
      <div className="flex flex-wrap items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Backlog</h2>
        <ClientSearchBox defaultQuery={query} />
      </div>
      <div className="gap-4">
        <Card>
          <CardContent className="pl-0 overflow-scroll">
            <div className="flex flex-row divide-x-2 w-full h-[calc(100vh-250px)]">
              <KanbanBoard forms={forms} reports={reports} query={query} />
            </div>
          </CardContent>
        </Card>
      </div>
      <SessionMonitorModal />
    </div>
  )
}
