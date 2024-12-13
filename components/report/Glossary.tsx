import React from 'react';
import { TypographyH2 } from './h2';
import { TypographyH3 } from './h3';
import { TypographyP } from './p';

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface GlossaryProps {
  terms: GlossaryTerm[];
}

const Glossary: React.FC<GlossaryProps> = ({ terms }) => {
    return (
      <div className="bg-white py-5 print:break-before-page">
        <TypographyH2 className="mb-6 text-oxfordBlueNew">Glossary</TypographyH2>
        <div className="space-y-4">
          {terms.map((item, index) => (
            <div key={index} className="pb-4 border-b border-jordanium last:border-b-0">
              <div className="flex items-center gap-2 mb-1">
                <TypographyH3 className="text-lg font-bold text-oxfordBlueNew">{item.term}</TypographyH3>
                <div className="h-[1px] ml-4 w-8 bg-gray-300"></div>
              </div>
              <TypographyP className="text-lg text-text_2">{item.definition}</TypographyP>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Glossary;