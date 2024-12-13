import React from 'react';
import { TypographyH2 } from './h2';
import { TypographyP } from './p';

interface StandardOperatingProcedureProps {
  steps: string | string[];
}

const StandardOperatingProcedure: React.FC<StandardOperatingProcedureProps> = ({ steps }) => {
  const stepsArray = Array.isArray(steps) ? steps : steps.split('\n').filter(step => step.trim() !== '');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm my-3" style={{pageBreakBefore: 'always'}}>
      <TypographyH2>Using Your VetVictory Claim Guide</TypographyH2>
      <ol className="space-y-4 pl-0 mt-4">
        {stepsArray.map((step, index) => (
          <li key={index} className="flex items-center my-2">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-4 text-gray-700 font-semibold">
              {index + 1}
            </span>
            <TypographyP className="flex-grow">{step}</TypographyP>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StandardOperatingProcedure;