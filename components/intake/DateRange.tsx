type DateRangeProps = {
  dates: { startDate: string, endDate: string };
  onChange: (dates: { startDate: string, endDate: string }) => void;
};
  
  export const DateRange = ({ dates, onChange }: DateRangeProps) => (
    <div className="date-range">
      <input
        type="date"
        value={dates.startDate || ''}
        onChange={(e) => onChange({ ...dates, startDate: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1 w-full mt-2"
      />
      <input
        type="date"
        value={dates.endDate || ''}
        onChange={(e) => onChange({ ...dates, endDate: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1 w-full mt-2"
      />
    </div>
  );