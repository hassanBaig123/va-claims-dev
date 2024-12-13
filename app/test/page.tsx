
import { processData } from "@/utils/data/process/process";
import { SourceConfiguration } from "@/models/data/source";

async function getData(url: string) {
  const res = await fetch(url);
  return res.json();
}

const sourceConfig: SourceConfiguration = {
  uri: "https://raw.githubusercontent.com/jamesplease/stock-market-data/main/data.json",
  method: "GET",
  operations: [
    {
      id: "YearFilter",
      type: "filter",
      criteria: {
        kind: "fieldComparison",
        value: {
          field: "year",
          operation: "equals",
          compareValue: 2000
        }
      }
    },
    {
      id: "AddInflationAdjustedComp",
      type: "map",
      transformation: `
        (item) => ({
          ...item,
          inflationAdjustedComp: item.comp * 1.03
        })
      `
    },
    {
      id: "aggregate",
      type: "aggregate",
      aggregations: [
        {
          field: "inflationAdjustedComp",
          operation: "average",
          as: "averageInflationAdjustedComp"
        },
        {
          field: "comp",
          operation: "average",
          as: "averageComp"
        }
      ]
    }
  ]
};

const DataDisplay = async () => {
  const data = await getData(sourceConfig.uri);

  if (!data) {
    console.error("DataDisplay component received undefined data");
    return <p>Error: Data is undefined</p>;
  }

  if (!Array.isArray(data)) {
    console.error(`DataDisplay component received non-array data of type ${typeof data}:`, data);
    return <p>Error: Invalid data format</p>;
  }

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <ul>
        {data.map((item, index) => {
          if (!item || typeof item !== 'object' || !item.year || !item.averageInflationAdjustedComp) {
            console.error(`Invalid item at index ${index}:`, item);
            return <li key={index}>Error: Invalid data item</li>;
          }

          return (
            <li key={index}>{`Year: ${item.year}, Average Inflation Adjusted Compensation: ${item.averageInflationAdjustedComp}`}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default function TestPage() {
  return <div><DataDisplay /></div>;
}

