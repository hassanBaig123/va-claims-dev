import React from 'react'

interface QuoteProps {
  children: React.ReactNode
}

const Quote: React.FC<QuoteProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center gap-2 border-l-4 border-gray-500 bg-gray-800 p-5">
      {' '}
      <p className="text-white font-normal leading-normal"> {children}</p>
    </div>
  )
}

export default Quote
