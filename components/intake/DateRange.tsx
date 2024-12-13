import React from "react";

type DateRangeProps = {
  dates: { startDate: string; endDate: string };
  onChange: (dates: { startDate: string; endDate: string }) => void;
  disableEndDate?: boolean;
};

export const DateRange = ({
  dates,
  onChange,
  disableEndDate = false,
}: DateRangeProps) => {
  return (
    <div className="date-range grid grid-cols-2 gap-4 mt-4">
      <div>
        <label
          htmlFor="start-date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={dates.startDate || ""}
          onChange={(e) => onChange({ ...dates, startDate: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label
          htmlFor="end-date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={dates.endDate || ""}
          onChange={(e) => onChange({ ...dates, endDate: e.target.value })}
          disabled={disableEndDate}
          className={`border border-gray-300 rounded px-2 py-1 w-full ${
            disableEndDate ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
};
