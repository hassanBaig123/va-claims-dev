import React from 'react'

interface ParagraphProps {
  children: React.ReactNode
}

const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
  return <p className="my-4 font-light leading-normal"> {children}</p>
}

export default Paragraph
