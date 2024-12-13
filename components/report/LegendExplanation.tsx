import React from 'react'
import { TypographyP } from '@/components/report/p'

interface Category {
  color: string
  colorHex: string
  label: string
  description: string
}

interface LegendExplanationData {
  introduction: string
  categories: Category[]
}

interface LegendExplanationProps {
  data: LegendExplanationData
  className?: string
}

const LegendExplanation: React.FC<LegendExplanationProps> = ({ 
  data, 
  className = '' 
}) => {
  if (!data) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {data.introduction && <TypographyP>{data.introduction}</TypographyP>}
      {data.categories && data.categories.length > 0 && (
        <div className="space-y-2">
          {data.categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: category.colorHex }}
              />
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{category.label}:</span>{' '}
                {category.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LegendExplanation