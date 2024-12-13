type NumberInputProps = {
    value: number;
    onChange: (value: number) => void;
  };
  
  export const NumberInput = ({ value, onChange }: NumberInputProps) => (
    <input
      type="number"
      className="border border-gray-300 rounded px-2 py-1 w-full mt-2"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );