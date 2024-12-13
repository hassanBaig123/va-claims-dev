'use client'

import React, { useState, useEffect } from 'react'
import useSupabaseClient from '@/utils/supabase/client'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

interface GoldAvailabilityProps {
  className?: string
  maxDailyPurchases: number
}

const GoldAvailability: React.FC<GoldAvailabilityProps> = ({
  className,
  maxDailyPurchases,
}) => {
  const [availableSlots, setAvailableSlots] = useState<number | null>(null)
  const [nextAvailableTime, setNextAvailableTime] = useState<number | null>(
    null,
  )
  const supabase = useSupabaseClient()

  useEffect(() => {
    const fetchAvailability = async () => {
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const goldPackages = (await getPurchaseProducts('old-products'))?.filter(
        (pkg) => pkg?.metadata?.tier === 'gold',
      )

      const { data, error } = await supabase
        .from('purchases')
        .select('purchase_date')
        .in(
          'package_id',
          goldPackages.map((pkg) => pkg.id),
        )
        .gte('purchase_date', twentyFourHoursAgo.toISOString())
        .order('purchase_date', { ascending: true })

      if (error) {
        console.error('Error fetching purchases:', error)
        return
      }

      const purchasesCount = data.length
      const remainingSlots = maxDailyPurchases - purchasesCount

      setAvailableSlots(Math.max(0, remainingSlots))

      if (remainingSlots <= 0 && data.length > 0) {
        const oldestPurchase = new Date(data[0].purchase_date)
        const timeDiff =
          24 * 60 * 60 * 1000 - (now.getTime() - oldestPurchase.getTime())
        setNextAvailableTime(timeDiff)
      } else {
        setNextAvailableTime(null)
      }
    }

    fetchAvailability()
    const interval = setInterval(fetchAvailability, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [supabase, maxDailyPurchases])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (nextAvailableTime !== null) {
      timer = setInterval(() => {
        setNextAvailableTime((prev) =>
          prev !== null ? Math.max(0, prev - 1000) : null,
        )
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [nextAvailableTime])

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (60 * 60 * 1000))
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((ms % (60 * 1000)) / 1000)

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (availableSlots === null) {
    return null // or a loading state
  }

  return (
    <div className={className}>
      {availableSlots > 0 ? (
        <p className="text-sm font-normal text-red-600">
          Only {availableSlots - 3} left
        </p>
      ) : (
        <p>
          0 purchase slots available.
          {nextAvailableTime !== null &&
            nextAvailableTime > 0 &&
            ` The next purchase will be available in ${formatTime(
              nextAvailableTime,
            )}`}
        </p>
      )}
    </div>
  )
}

export default GoldAvailability
