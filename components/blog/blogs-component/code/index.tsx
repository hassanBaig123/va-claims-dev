import React from 'react'

interface CodeComponentProps {
  children: React.ReactNode
  italic?: boolean
  background?: boolean
}

const CodeComponent: React.FC<CodeComponentProps> = ({
  children,
  italic,
  background,
}) => {
  const baseClasses = 'flex items-center gap-2 justify-center rounded'
  const backgroundColorClass = background ? 'bg-black' : ''
  const textColorClass = italic
    ? 'text-[#023aff] font-light italic text-[22px]'
    : 'text-purple-500 text-[13px]'

  return (
    <p
      className={`${baseClasses} ${backgroundColorClass} ${textColorClass} font-mono`}
    >
      {children}
    </p>
  )
}

export default CodeComponent
