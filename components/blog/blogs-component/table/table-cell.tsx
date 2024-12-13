import React from 'react'

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  header?: boolean
}

const TableCellComponent: React.FC<TableCellProps> = ({
  children,
  header,
  ...props
}) => {
  const Tag = header ? 'th' : 'td'

  return (
    <Tag
      {...props}
      className={`border border-gray-300 px-2 py-2 text-white ${
        header ? 'font-semibold' : ''
      }`}
    >
      {children}
    </Tag>
  )
}

export default TableCellComponent
