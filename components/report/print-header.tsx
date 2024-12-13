import React from 'react';

interface PrintHeaderProps {
  headerText: string;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ headerText }) => {
  return (
    <div className="print:block absolute hidden top-5 w-full">
      <h2 className="print:text-sm print:font-semibold print:text-center print:py-2 text-slate-900 font-semibold text-center py-2">
        {headerText}
      </h2>
    </div>
  );
};

export default PrintHeader;
