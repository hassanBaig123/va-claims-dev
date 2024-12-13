import { Input } from "@/components/ui/input"

interface SearchProps {
  className?: string;
}

export function Search({ className }: SearchProps) {
  return (
    <div className={className}>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
