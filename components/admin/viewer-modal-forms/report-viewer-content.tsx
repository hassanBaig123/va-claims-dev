import { useState, useEffect } from 'react'
import useSupabaseClient from '@/utils/supabase/client'
import { validateReport } from '@/lib/validations/report.validator'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from 'react-query'
 
interface ResearchReport {
  users: {
    full_name: string
    id: string
  }[]
  created_at: string
  updated_at: string
  decrypted_report: string
}
 
export const ReportViewerContent = ({ obj_id }: { obj_id: string }) => {
  const supabase = useSupabaseClient()
  const [isExpanded, setIsExpanded] = useState(true)
  const [validationResult, setValidationResult] = useState<any>(null)
  const { data, error, isLoading } = useQuery<ResearchReport, Error>(
    ['report', obj_id],
    async () => {
      const { data, error } = await supabase
        .from('decrypted_reports')
        .select('*, users:user_id (*)')
        .eq('id', obj_id)
        .single()
 
      if (error) throw error
 
      // Validate report when data is loaded
      if (data) {
        const reportData =
          typeof data.decrypted_report === 'string'
            ? JSON.parse(data.decrypted_report)
            : data.decrypted_report
        setValidationResult(validateReport(reportData))
      }
 
      return data
    },
  )
 
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data found</div>
 
  const reportData =
    typeof data.decrypted_report === 'string'
      ? JSON.parse(data.decrypted_report)
      : data.decrypted_report
 
  return (
    <div className="relative">
      {/* Sticky Header */}
      <div
        className={cn(
          'sticky top-0 z-10 bg-white shadow-sm transition-all duration-200',
          !isExpanded && 'shadow-md',
        )}
      >
        {/* Header Content */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div>
              <h3 className="font-medium">
                {/* TODO: Brayan, we need to implement it properly the users is an array I've just used the first index for now */}
                {data.users?.[0]?.full_name || 'Unknown User'}
              </h3>
              {!isExpanded && validationResult && (
                <span className="text-sm text-gray-500">
                  {validationResult.completionPercentage}% Complete
                </span>
              )}
            </div>
          </div>
 
          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="relative group">
              <Info className="w-5 h-5 text-gray-400 cursor-help" />
              <div className="absolute right-0 w-72 p-3 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
                <CustomerInfo data={data} />
                <ValidationSummary result={validationResult} />
              </div>
            </div>
          )}
        </div>
 
        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <CustomerInfo data={data} />
              <ValidationSummary result={validationResult} />
            </div>
          </div>
        )}
      </div>
 
      {/* Main Content */}
      <div className="mt-4">{/* Your existing report content here */}</div>
    </div>
  )
}
 
const CustomerInfo = ({ data }: { data: ResearchReport }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-sm text-gray-700">Customer Information</h4>
    <div className="space-y-1 text-sm">
      <p>
        {/* TODO: Brayan, we need to implement it properly the users is an array I've just used the first index for now */}
        ID: <span className="text-gray-600">{data.users?.[0]?.id}</span>
      </p>
      <p>
        Created:{' '}
        <span className="text-gray-600">
          {new Date(data.created_at).toLocaleDateString()}
        </span>
      </p>
      <p>
        Updated:{' '}
        <span className="text-gray-600">
          {new Date(data.updated_at).toLocaleDateString()}
        </span>
      </p>
    </div>
  </div>
)
 
const ValidationSummary = ({ result }: { result: any }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-sm text-gray-700">Report Status</h4>
    <div className="space-y-2">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Completion</span>
          <span className="text-sm font-medium">
            {result?.completionPercentage ?? 0}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${result?.completionPercentage ?? 0}%` }}
          />
        </div>
      </div>
 
      {/* Condition-specific issues */}
      {result?.warnings?.some((w: any) => w.path.includes('conditions')) && (
        <div className="mt-2">
          <h5 className="text-sm font-medium text-amber-600">
            Condition Issues:
          </h5>
          <ul className="list-disc list-inside text-xs text-amber-600">
            {result.warnings
              .filter((w: any) => w.path.includes('conditions'))
              .map((warning: any, index: number) => (
                <li key={index}>{warning.message}</li>
              ))}
          </ul>
        </div>
      )}
 
      {/* Other critical issues */}
      {result?.criticalErrors?.length > 0 && (
        <div className="text-xs text-red-500">
          {result.criticalErrors.length} critical issues found
        </div>
      )}
    </div>
  </div>
)
