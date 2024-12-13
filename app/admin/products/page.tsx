import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PersonIcon } from '@radix-ui/react-icons'
import ProductsTable from '@/components/admin/products-table'
import AddProductDialog from '@/components/admin/add-product-dialog'

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-2 space-y-4 p-8 pt-6">
      <div className="col-span-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>
      <div className="grid gap-4 col-span-2">
        <Card>
          <CardContent>
            {/* <AddProductDialog /> */}
            <ProductsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
