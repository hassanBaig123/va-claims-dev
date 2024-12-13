'use client'
import { getOrderHistory } from '@/actions/order.server'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/utils/formatter'
import React, { useEffect, useState } from 'react'
import Loader from '@/components/global/Loader'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { getValidID } from '@/utils/helpers'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import ThreeDotActions from './components/ThreeDotActions'
import EachHistoryData from './components/EachHistoryData'

import './installment-history.css'

export type CustomerHistoryData = {
  amount: number
  id: number
  package_id: string
  purchase_date: string
  user_id: string
  user: {}[]
  metaData?: { subscriptionId?: any }
}
const supabase = createClient()

const InstallmentHistoryPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { user, inspectUserId, isAdmin, isLoading, setAdminInspectUserId } =
    useSupabaseUser()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [historyData, setHistoryData] = useState<CustomerHistoryData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (isLoading) {
        return
      }

      if (sessionError || !session) {
        router.push('/login')
        return
      }
      if (!user) {
        router.push('/not-authorized')
        return
      }
      let validatedUserId: string | null = null
      if (inspectUserId) {
        validatedUserId = inspectUserId
      } else {
        //if there is not inspectUserId we take it from the URL
        validatedUserId = getValidID(params.id)

        //if validatedUserId is not valid we take if from user?.id
        if (!validatedUserId && user?.id) {
          validatedUserId = getValidID(user.id)
        }
      }

      // Populate data
      if (validatedUserId) {
        // if URL id is not the same then the user
        if (user.id !== validatedUserId) {
          //check if user is admin
          if (!isAdmin) {
            router.push('/not-authorized')
            return
          } else {
            //is admin
            if (validatedUserId !== params.id) {
              router.replace(`/profile/${validatedUserId}`)
            }
            //set validatedUserId
            setAdminInspectUserId(validatedUserId)
          }
        }

        const { data } = await getOrderHistory(validatedUserId)
        if (data) {
          setHistoryData(data)
        }
      }

      setIsPageLoading(false)
    }

    fetchData()
  }, [
    params.id,
    router,
    user,
    inspectUserId,
    isAdmin,
    isLoading,
    setAdminInspectUserId,
  ])

  const installments = historyData?.filter(
    (item) => item.metaData && item.metaData.subscriptionId,
  )

  const dateString = installments && installments[0]?.purchase_date
  const dateObject = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
  const firstInstallmentOn = dateObject
    .toLocaleDateString('en-GB', options)
    .replace(',', '')

  const firstInstallmentDate = new Date(firstInstallmentOn)

  const formatDate = (date: Date): string =>
    date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(',', '')

  interface InstallmentDate {
    label: string
    date: string
    status: string
  }

  const getInstallmentDates = (
    startDate: Date,
    numberOfInstallments: number,
  ): string[] => {
    return Array.from({ length: numberOfInstallments }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + (i + 1) * 30)
      return formatDate(date)
    })
  }

  // Get formatted installment dates
  const [formattedSecond, formattedThird, formattedFourth] =
    getInstallmentDates(firstInstallmentDate, 3)

  if (isLoading || isPageLoading) {
    return (
      <div className="bg-white flex items-center justify-center fixed z-50 w-[75%] h-[400px]">
        <Loader /> <span>Loading...</span>
      </div>
    )
  }

  if (!historyData || historyData.length === 0) {
    return (
      <div className="bg-white flex items-top justify-center min-h-screen  z-50 w-full">
        No Payment history found
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Payments history</h3>
          <p className="text-sm text-muted-foreground"></p>
        </div>
        <Separator />
        <div className="installmentsPlansInfo">
          {[
            {
              label: '1st Payment',
              date: firstInstallmentOn,
              status: 'PAID',
            },
            { label: '2nd Payment', date: formattedSecond },
            { label: '3rd Payment', date: formattedThird },
            { label: '4th Payment', date: formattedFourth },
          ].map(({ label, date, status }, index) => (
            <div className={`planRow`} key={index}>
              <div className="planRowColumn">{label}</div>
              <div className="planRowColumn">
                ${(installments[0]?.amount / 100).toFixed(2)}
              </div>
              <div className="planRowColumn">on {date}</div>
              <div className="planRowColumn">
                <div
                  className={`pill ${
                    index < installments.length ? 'paid' : 'unpaid'
                  }`}
                >
                  <span>{index < installments.length ? 'PAID' : 'UNPAID'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstallmentHistoryPage
