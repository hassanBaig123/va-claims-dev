import React from 'react'

interface Heading1Props {
  children: React.ReactNode
  italic?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
}

const Heading1: React.FC<Heading1Props> = ({
  children,
  italic,
  bold,
  underline,
  strikeThrough,
}) => {
  const headingClasses = `
    text-5xl text-black
    ${italic ? 'italic' : ''}
    ${bold ? 'font-semibold' : 'font-light'}
    ${underline ? 'underline' : ''}
    ${strikeThrough ? 'line-through' : ''}
  `

  return <h1 className={headingClasses}>{children}</h1>
}

export default Heading1
