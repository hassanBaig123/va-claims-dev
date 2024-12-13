"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useState } from "react"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

export function Last12MonthsSales({ monthlyData, quarterlyData }: Last12MonthsSalesProps) {
  const [isQuarterly, setIsQuarterly] = useState(false);
  
  console.log("Monthly", monthlyData);
  console.log("Quarterly", quarterlyData);

  const handleToggle = () => {
    setIsQuarterly(!isQuarterly);
  }

  const getNumberOfSales = (payload: any[]) => {
    const total = payload[0].value;
    return `Number of sales: ${total / 1000}k`;
  }

  const ToolTipProps = {
    active: true,
    payload: [{ value: 1000 }],
    label: "Jan",
  };

  const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded-lg">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{getNumberOfSales(payload)}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
    <div className="flex justify-end mb-4">
      <label htmlFor="toggleData" className="flex items-center cursor-pointer">
        <div className="relative">
          <input type="checkbox" id="toggleData" className="sr-only" onChange={handleToggle} />
          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">
          Toggle Quarterly
        </div>
      </label>
    </div>
    
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={isQuarterly ? quarterlyData : monthlyData}>
        <Tooltip cursor={{ fill: "rgba(255,255,255,.5)" }} content={<CustomTooltip active={false} payload={[]} label={""} />} />
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
        
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          
        />
        
      </BarChart>
    </ResponsiveContainer>
    </>
  )
}
