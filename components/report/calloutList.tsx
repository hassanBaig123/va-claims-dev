import React from 'react';

interface CalloutListProps {
  title: string;
  texts: string[];
}

const TypographyListCallout: React.FC<CalloutListProps> = ({ title, texts }) => {
    return (
      <aside className="float-right max-w-xs p-4 m-2 border border-gray-300 bg-blue-50 print:bg-gray-50">
        <h4 className="font-bold">{title}</h4>
        <ul className="list-disc list-inside">
          {texts.map((text: string, index: number) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </aside>
    );
  };
  
  export default TypographyListCallout;