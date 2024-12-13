import React from 'react';
import { TypographyP } from './p';

interface NumberedListProps {
  items: string[];
}

const NumberedList: React.FC<NumberedListProps> = ({ items }) => {
  return (
    <ol className="space-y-4 pl-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-4 text-gray-700 font-semibold">
            {index + 1}
          </span>
          <TypographyP className="flex-grow">{item}</TypographyP>
        </li>
      ))}
    </ol>
  );
};

export default NumberedList;