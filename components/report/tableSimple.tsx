export function TypographyTable({ data }: { data: { headers: string[]; rows: any[][] } }) {
    return (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="m-0 border-t p-0 even:bg-muted">
              {data.headers.map((header) => (
                <th key={header} className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index} className="m-0 border-t p-0 even:bg-muted">
                {row.map((cell) => (
                  <td key={cell} className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    )
}