import React from 'react'

interface Heading3Props {
  children: React.ReactNode
  italic?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
}

const Heading3: React.FC<Heading3Props> = ({
  children,
  italic,
  bold,
  underline,
  strikeThrough,
}) => {
  const headingClasses = `
    text-3xl text-black
    ${italic ? 'italic' : ''}
    ${bold ? 'font-semibold' : 'font-light'}
    ${underline ? 'underline' : ''}
    ${strikeThrough ? 'line-through' : ''}
  `

  return <h3 className={headingClasses}>{children}</h3>
}

export default Heading3
