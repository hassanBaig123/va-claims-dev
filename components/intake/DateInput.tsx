type DateInputProps = {
    value: string;
    onChange: (value: string) => void;
  };
  
  export const DateInput = ({ value, onChange }: DateInputProps) => (
    <input
      type="date"
      className="border border-gray-300 rounded px-2 py-1 w-full mt-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );