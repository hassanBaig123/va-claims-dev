import React from 'react'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

const TableRowComponent: React.FC<TableRowProps> = ({ children, ...props }) => {
  return (
    <tr {...props} className="text-white">
      {children}
    </tr>
  )
}

export default TableRowComponent
