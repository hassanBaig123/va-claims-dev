import React from 'react'

interface Heading6Props {
  children: React.ReactNode
  italic?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
}

const Heading6: React.FC<Heading6Props> = ({
  children,
  italic,
  bold,
  underline,
  strikeThrough,
}) => {
  const headingClasses = `
    text-sm text-black
    ${italic ? 'italic' : ''}
    ${bold ? 'font-semibold' : 'font-light'}
    ${underline ? 'underline' : ''}
    ${strikeThrough ? 'line-through' : ''}
  `

  return <h6 className={headingClasses}>{children}</h6>
}

export default Heading6
