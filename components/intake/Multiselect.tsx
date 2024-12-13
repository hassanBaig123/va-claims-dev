type MultiSelectProps = {
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
  };
  
  export const MultiSelect = ({ options, value, onChange }: MultiSelectProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
      onChange(selectedOptions);
    };
  
    return (
      <select multiple value={value} onChange={handleChange} className="border border-gray-300 rounded px-2 py-1 w-full mt-2">
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };