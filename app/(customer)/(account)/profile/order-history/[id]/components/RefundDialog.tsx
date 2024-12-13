import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuery } from 'react-query'
import { getCustomerPaymentRefund } from '@/actions/stripe/read.actions'

interface RefundDialogProps {
  orderNumber: string
  totalAmount: number
  onRefundSubmit: (amount: number, reason: string) => void
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  isRefunding: boolean
  customerId: string
  productId: string
}

const RefundDialog: React.FC<RefundDialogProps> = ({
  orderNumber,
  totalAmount,
  onRefundSubmit,
  setIsOpen,
  isOpen,
  isRefunding,
  customerId,
  productId,
}) => {
  const [refundAmount, setRefundAmount] = useState(
    (totalAmount / 100).toFixed(2),
  )
  const [refundedTotal, setRefundedTotal] = useState('0.00')
  const [refundReason, setRefundReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRefundSubmit(Number(refundAmount), refundReason)
  }

  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      const parts = value.split('.')
      if (parts.length > 1) {
        // If there's a decimal point, limit to two decimal places
        const integerPart = parts[0]
        const decimalPart = parts[1].slice(0, 2)
        const newValue = `${integerPart}.${decimalPart}`
        if (Number(newValue) <= totalAmount) {
          setRefundAmount(newValue)
        }
      } else {
        // If no decimal point, just check if it's less than or equal to total amount
        if (Number(value) <= totalAmount) {
          setRefundAmount(value)
        }
      }
    }
  }

  const { data: refundData, isLoading: isRefundDataLoading } = useQuery({
    queryKey: ['refundData'],
    queryFn: () => getCustomerPaymentRefund(customerId, productId),
    enabled: !!customerId && !!productId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data?.refunds?.length || 0 > 0) {
        const totalRefundedAmount = data?.refunds
          .filter((item) => item.status === 'succeeded')
          .reduce((prev, curr) => prev + curr.amount, 0)

        if (totalRefundedAmount) {
          setRefundedTotal((totalRefundedAmount / 100).toFixed(2))
        }
      }
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Refund for Order #{orderNumber}</DialogTitle>
          <DialogDescription>
            Enter the refund details below. The maximum refund amount is $
            {(totalAmount / 100).toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Total Refund</Label>
          <div className="col-span-3">
            : ${(totalAmount / 100).toFixed(2)} / ${refundedTotal}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="refundAmount" className="text-right">
                Amount
              </Label>
              <Input
                id="refundAmount"
                type="text"
                inputMode="decimal"
                value={refundAmount}
                onChange={handleRefundAmountChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="refundReason" className="text-right">
                Reason
              </Label>
              <Input
                id="refundReason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button
                disabled={isRefunding || isRefundDataLoading}
                type="submit"
              >
                {isRefunding ? 'Refunding..' : 'Submit Refund'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RefundDialog
