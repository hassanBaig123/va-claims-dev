interface ServerSearchBoxProps {
  defaultQuery?: string;
}

export default function ServerSearchBox({ defaultQuery = '' }: ServerSearchBoxProps) {
  return (
    <form method="GET" action="">
      <input
        type="text"
        name="query"
        defaultValue={defaultQuery}
        placeholder="Search by name"
        className="border rounded px-2 py-1 w-[400px]"
      />
      <button type="submit" className="ml-2 px-4 py-1 bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  );
}
