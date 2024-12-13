type CheckboxProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  };
  
  export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox"
      />
      <span className="ml-2">{label}</span>
    </label>
  );