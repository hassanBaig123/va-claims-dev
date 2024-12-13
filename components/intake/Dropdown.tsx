type DropdownProps = {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  
  export const Dropdown = ({ options, value, onChange, placeholder }: DropdownProps) => (
    <select
      className="border border-gray-300 rounded px-2 py-1 w-full mt-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select an option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );