import React from 'react'

interface ListComponentProps {
  ordered: boolean
  children: React.ReactNode
}

const ListComponent: React.FC<ListComponentProps> = ({ ordered, children }) => {
  return (
    <>
      {ordered ? (
        <ol className="my-2 text-black list-decimal">{children}</ol>
      ) : (
        <ul className="my-2 text-black list-disc">{children}</ul>
      )}
    </>
  )
}

export default ListComponent
