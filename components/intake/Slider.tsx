type SliderProps = {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
  };
  
  export const Slider = ({ min, max, value, onChange }: SliderProps) => (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="slider"
    />
  );