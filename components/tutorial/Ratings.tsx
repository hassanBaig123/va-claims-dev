/**
 * v0 by Vercel.
 * @see https://v0.dev/t/zHEgOIc67jX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardContent, Card } from "@/components/ui/card"

export default function Component() {
  return (
    <Card className="max-w-4xl mx-auto shadow-md">
      <CardContent className="flex justify-between items-center">
        <div className="text-center p-6">
          <p className="text-3xl font-bold text-red-600">100%</p>
          <p className="text-sm text-gray-600">Committed to Serving Veterans</p>
        </div>
        <div className="border-r border-gray-300" />
        <div className="text-center p-6">
          <p className="text-3xl font-bold text-red-600">30%</p>
          <p className="text-sm text-gray-600">Average VA Rating Increase</p>
        </div>
        <div className="border-r border-gray-300" />
        <div className="text-center p-6">
          <p className="text-3xl font-bold text-red-600">{`>20K`}</p>
          <p className="text-sm text-gray-600">Veterans Helped</p>
        </div>
      </CardContent>
    </Card>
  )
}

