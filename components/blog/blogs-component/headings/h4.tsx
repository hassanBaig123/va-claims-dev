import React from 'react'

interface Heading4Props {
  children: React.ReactNode
  italic?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
}

const Heading4: React.FC<Heading4Props> = ({
  children,
  italic,
  bold,
  underline,
  strikeThrough,
}) => {
  const headingClasses = `
    text-2xl text-black
    ${italic ? 'italic' : ''}
    ${bold ? 'font-semibold' : 'font-light'}
    ${underline ? 'underline' : ''}
    ${strikeThrough ? 'line-through' : ''}
  `

  return <h4 className={headingClasses}>{children}</h4>
}

export default Heading4
