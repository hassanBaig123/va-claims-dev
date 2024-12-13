import React from 'react'

interface Heading7Props {
  children: React.ReactNode
  italic?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
}

const Heading7: React.FC<Heading7Props> = ({
  children,
  italic,
  bold,
  underline,
  strikeThrough,
}) => {
  const headingClasses = `
    text-xs text-black
    ${italic ? 'italic' : ''}
    ${bold ? 'font-semibold' : 'font-light'}
    ${underline ? 'underline' : ''}
    ${strikeThrough ? 'line-through' : ''}
  `

  return <h6 className={headingClasses}>{children}</h6>
}

export default Heading7
