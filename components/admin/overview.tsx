"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import classNames from "@/utils/classNames";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const currentMonth = new Date().getMonth();
//const data = Array.from({ length: 12 }).map((_, i) => {
//  const monthIndex = (currentMonth + i + 1) % 12;
//  const monthName = monthNames[monthIndex];
//  return {
//    name: monthName,
//    total: Math.floor(Math.random() * 5000) + 1000,
//  };
//});

export type SalesDataItem = {
  name: string;
  total: number;
};

type Last12MonthsSalesProps = {
  monthlyData: SalesDataItem[]; // Array of monthly sales data
  quarterlyData: SalesDataItem[]; // Array of quarterly aggregated sales data
};

export function Last12MonthsSales({
  monthlyData,
  quarterlyData,
}: Last12MonthsSalesProps) {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [enabled, setEnabled] = useState(false);

  console.log("Monthly", monthlyData);
  console.log("Quarterly", quarterlyData);

  const handleToggle = () => {
    setIsQuarterly(!isQuarterly);
  };

  const getNumberOfSales = (payload: any[]) => {
    const total = payload[0].value;
    return `${total / 1000}k`;
  };

  const ToolTipProps = {
    active: true,
    payload: [{ value: 1000 }],
    label: "Jan",
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className=" bg-white p-2 rounded-lg shadow w-full">
          <p className="label grid grid-cols-2 justify-between">
            <span className="font-medium">Date :</span>
            <span className="ml-4">{`${label}`}</span>
          </p>
          <p className="intro grid grid-cols-2 justify-between">
            <span className="font-medium">Total sales :</span>
            {/* <span className="ml-4">{getNumberOfSales(payload)}</span> */}
            <span className="ml-4">{`$${payload[0].value}`}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <label
          htmlFor="toggleData"
          className="flex items-center cursor-pointer"
        >
          {/* <div className="relative">
          <input type="checkbox" id="toggleData" className="sr-only" onChange={handleToggle} />
          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
        </div> */}
          <Switch
            checked={isQuarterly}
            onChange={handleToggle}
            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-black p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            <span
              aria-hidden="true"
              className={classNames(
                isQuarterly ? "translate-x-7" : "translate-x-0",
                "pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out"
              )}
            />
          </Switch>
          <div className="ml-3 text-gray-700 font-medium">Toggle Quarterly</div>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={isQuarterly ? quarterlyData : monthlyData}>
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,.5)" }}
            content={<CustomTooltip active={false} payload={[]} label={""} />}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />

          <Bar dataKey="total" radius={[4, 4, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
