import { Textarea } from "../ui/textarea";

// TextInput.tsx
type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TextInput = ({ value, onChange, placeholder }: TextInputProps) => (
  <Textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    aria-rowspan={4}
    className="border border-gray-300 bg-gray rounded px-2 py-1 w-full mt-2 h-32"
  />
);

