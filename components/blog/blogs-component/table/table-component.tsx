import React from 'react'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

const TableComponent: React.FC<TableProps> = ({ children, ...props }) => {
  return (
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  )
}

export default TableComponent
