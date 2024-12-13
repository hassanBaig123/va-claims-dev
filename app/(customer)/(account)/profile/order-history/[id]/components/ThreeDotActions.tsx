import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, Undo2, TrashIcon } from 'lucide-react' // using Lucide Icons for example
import { CustomerHistoryData } from '../page'
import { useState } from 'react'
import RefundDialog from './RefundDialog'
import { refundCustomer } from '@/actions/stripe/create.actions'
import { useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

export default function ThreeDotActions({
  order,
}: {
  order: CustomerHistoryData
}) {
  const [openConfirm, setOpenConfirm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const customerId = JSON.parse(
    (order.user as any).payment_method,
  )?.stripeCustomerId
  const productId = order.package_id

  const handleRefund = () => {
    setOpenConfirm(true)
  }

  const refundMutation = useMutation({
    mutationFn: async ({
      customerId,
      packageId,
      refundAmount,
      refundReason,
    }: {
      customerId: string
      packageId: string
      refundAmount: number
      refundReason: string
    }) => {
      const { message } = await refundCustomer(
        customerId,
        packageId,
        refundAmount,
        refundReason,
      )
      if (message != 'ok') throw new Error(message)
      return message
    },
    onSuccess: (data) => {
      toast({
        description: 'Refund successful!',
      })
      queryClient.invalidateQueries({ queryKey: ['refundData'] })
      setOpenConfirm(false)
    },
    onError: (error: any) => {
      toast({
        description: error?.message || 'Something went wrong!',
      })
      console.error('Refund failed:', error)
    },
  })

  const onRefundSubmit = async (refundAmount: number, refundReason: string) => {
    refundMutation.mutate({
      customerId,
      packageId: productId,
      refundAmount,
      refundReason,
    })
  }

  return (
    <>
      <RefundDialog
        customerId={customerId}
        productId={productId}
        isOpen={openConfirm}
        setIsOpen={setOpenConfirm}
        onRefundSubmit={onRefundSubmit}
        orderNumber={`${order.id}`}
        totalAmount={order.amount}
        isRefunding={refundMutation.isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <EllipsisVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={5} className="w-40">
          <DropdownMenuItem
            onSelect={handleRefund}
            className="flex items-center space-x-2"
          >
            <Undo2 className="h-4 w-4" />
            <span>Refund</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
