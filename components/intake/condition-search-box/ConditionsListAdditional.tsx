'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { PurchaseProduct } from '@/components/learn-more/paypal'
import { getPurchaseProducts } from '@/utils/data/products/product-utils-client'

interface ConditionDetails {
  currentDiagnosis: string
  disabilityRating: number | string
  serviceConnected: string
  nexusLetter: boolean
  personalStatement: boolean
}

interface Condition {
  label: string
  value: string
  code: string
  details?: ConditionDetails
}

interface ConditionsListProps {
  conditionsList: Condition[]
  handleDialogOpen: (condition: Condition) => void
  removeCondition: (value: string) => void
  setIsEditModal: React.Dispatch<React.SetStateAction<boolean>>
  updateConditionDetail: (
    conditionValue: string,
    fieldName: keyof ConditionDetails,
    checked: boolean,
  ) => void // Add this line
}

export const ConditionsList: React.FC<ConditionsListProps> = ({
  conditionsList,
  handleDialogOpen,
  removeCondition,
  setIsEditModal,
  updateConditionDetail,
}) => {
  const [additionalLetterProducts, setAdditionalLetterProducts] = useState<
    PurchaseProduct[] | []
  >()

  const findProduct = (name: string) =>
    additionalLetterProducts?.find((product) => product?.name === name)
  const nexusLetterProduct = findProduct('Nexus Letter')
  const personalStatementProduct = findProduct('Personal Statement')

  const totalPrice = conditionsList.reduce((acc, condition) => {
    if (condition.details) {
      if (condition.details.nexusLetter && nexusLetterProduct) {
        acc += +nexusLetterProduct?.price || 0
      }
      if (condition.details.personalStatement && personalStatementProduct) {
        acc += +personalStatementProduct.price || 0
      }
    }
    return acc
  }, 0)

  useEffect(() => {
    getPurchaseProducts('stripe-additional', setAdditionalLetterProducts)
  }, [])

  return (
    <div className="space-y-4">
      {conditionsList?.length > 0 && (
        <table className="min-w-full table-auto bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Name
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Nexus ($97.00)
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Personal S ($97.00)
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {conditionsList.map((condition) => (
              <tr key={condition.code} className="border-t">
                <td className="px-4 py-2 text-gray-800 font-medium">
                  {condition.label}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nexusLetter"
                        checked={condition?.details?.nexusLetter}
                        onCheckedChange={(checked) => {
                          if (
                            !checked &&
                            !condition?.details?.personalStatement
                          ) {
                            return
                          }
                          updateConditionDetail(
                            condition.value,
                            'nexusLetter',
                            !!checked,
                          )
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-gray-800">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="personalStatement"
                        checked={condition?.details?.personalStatement}
                        onCheckedChange={(checked) => {
                          if (!checked && !condition?.details?.nexusLetter) {
                            return
                          }
                          updateConditionDetail(
                            condition.value,
                            'personalStatement',
                            !!checked,
                          )
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        handleDialogOpen(condition)
                        setIsEditModal(true)
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => removeCondition(condition.value)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="border-t">
              <td colSpan={3} className="text-right font-bold px-4 py-2">
                Total Price:
              </td>
              <td className="text-right font-bold px-4 py-2">
                ${totalPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
