import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/utils/formatter'
import ThreeDotActions from './ThreeDotActions'
import { CustomerHistoryData } from '../page'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import '../order-history.css'

interface Props {
  order: CustomerHistoryData
  handleClick?: any
}

const EachHistoryData: React.FC<Props> = ({ order, handleClick }) => {
  const { inspectUserId } = useSupabaseUser()

  const stripeCustomerId = JSON.parse(
    (order.user as any).payment_method,
  )?.stripeCustomerId

  return (
    <TableRow
      key={order.id}
      // className="cursor-pointer"
      style={{
        cursor: order?.metaData?.subscriptionId ? 'pointer' : 'default',
      }}
      onClick={order?.metaData?.subscriptionId ? handleClick : undefined}
    >
      {/* <TableCell className="text-left">{order.id}</TableCell> */}
      <TableCell className="text-left">
        {order.product?.name}{' '}
        {order?.metaData?.subscriptionId && `(Partial Payment)`}
      </TableCell>
      <TableCell className="text-left">
        ${(order.amount / 100).toFixed(2)}
      </TableCell>
      <TableCell className="text-left">
        {formatDate(order.purchase_date)}
      </TableCell>
      {inspectUserId && stripeCustomerId && (
        <TableCell className="text-left">
          <ThreeDotActions order={order} />
        </TableCell>
      )}
    </TableRow>
  )
}

export default EachHistoryData
