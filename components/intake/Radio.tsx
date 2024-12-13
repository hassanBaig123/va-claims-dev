type RadioInputProps = {
    options: string[];
    value: string;
    onChange: (value: string) => void;
  };
  
  export const RadioInput = ({ options, value, onChange }: RadioInputProps) => (
    <div>
      {options.map((option, index) => (
        <label key={index} className="inline-flex items-center mr-4">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="form-radio"
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );