import React from 'react';
import { TypographyH3 } from './h3';
import { TypographyP } from './p';

export interface RatingCriterion {
  rating: string;
  criteria: string | string[]; // Can be single string or array of criteria
  notes?: string;
  alternatives?: {
    description: string;
    criteria: string[];
  }[];
  measurements?: {
    type: string;
    value: string;
    description?: string;
  }[];
}

interface RatingTableProps {
  title: string;
  description?: string;
  diagnosticCode: string;
  criteria: RatingCriterion[];
}

const RatingTable: React.FC<RatingTableProps> = ({
  title,
  description,
  diagnosticCode,
  criteria
}) => {
  return (
    <div className="mb-6">
      <TypographyH3>
        {title} (Code {diagnosticCode})
      </TypographyH3>
      {description && (
        <TypographyP className="text-sm text-gray-600 mb-4">
          {description}
        </TypographyP>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-slate-500 px-4 py-2 text-left font-bold w-24">
                Rating
              </th>
              <th className="border-slate-500 px-4 py-2 text-left font-bold">
                Criteria
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, idx) => (
              <tr 
                key={idx} 
                className="m-0 border-t p-0 even:bg-[#F3F4F6]"
              >
                <td className="border px-4 py-2 text-left align-top">
                  {criterion.rating}
                </td>
                <td className="border px-4 py-2 text-left">
                  {/* Handle single criterion */}
                  {typeof criterion.criteria === 'string' && (
                    <div>{criterion.criteria}</div>
                  )}
                  
                  {/* Handle multiple criteria */}
                  {Array.isArray(criterion.criteria) && (
                    <ul className="list-disc list-inside">
                      {criterion.criteria.map((item, i) => (
                        <li key={i} className="mb-1">{item}</li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Handle measurements if present */}
                  {criterion.measurements && criterion.measurements.length > 0 && (
                    <div className="mt-2">
                      <div className="font-semibold">Measurements:</div>
                      <ul className="list-disc list-inside">
                        {criterion.measurements.map((measurement, i) => (
                          <li key={i}>
                            {measurement.type}: {measurement.value}
                            {measurement.description && 
                              ` - ${measurement.description}`
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Handle alternative criteria */}
                  {criterion.alternatives && criterion.alternatives.length > 0 && (
                    <div className="mt-2">
                      {criterion.alternatives.map((alt, i) => (
                        <div key={i} className="mb-2">
                          <div className="font-semibold">
                            {alt.description}:
                          </div>
                          <ul className="list-disc list-inside">
                            {alt.criteria.map((item, j) => (
                              <li key={j} className="ml-4">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Handle additional notes */}
                  {criterion.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      Note: {criterion.notes}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatingTable;