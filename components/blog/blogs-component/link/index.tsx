import React from 'react'
import Link from 'next/link'

interface LinkComponentProps {
  href: string
  children: React.ReactNode
  underline?: boolean
}

const LinkComponent: React.FC<LinkComponentProps> = ({
  href,
  children,
  underline,
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-600 ${underline ? 'underline' : ''}`}
    >
      {children}
    </Link>
  )
}

export default LinkComponent
