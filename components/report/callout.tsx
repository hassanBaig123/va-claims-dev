import React from 'react';

interface CalloutProps {
  title: string;
  text: string;
  className?: string;
}

const Callout: React.FC<CalloutProps> = ({ title, text, className }) => {
  return (
    <div className={`bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 ${className}`}>
      <h4 className="font-bold">{title}</h4>
      <p>{text}</p>
    </div>
  );
};

export default Callout;