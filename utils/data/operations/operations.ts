import { Operations } from '../../../models/data/operations';

export function applyReduce(data: any[], operation: Operations.ReduceOperation): any {
  return data.reduce(operation.reducer, operation.initialValue);
}

export function applyFind(data: any[], operation: Operations.FindOperation): any {
  return data.find(item => new Function('item', `return ${operation.criteria};`)(item));
}

export function applyFindIndex(data: any[], operation: Operations.FindIndexOperation): number {
  return data.findIndex(item => new Function('item', `return ${operation.criteria};`)(item));
}

export function applyEvery(data: any[], operation: Operations.EveryOperation): boolean {
  return data.every(item => new Function('item', `return ${operation.criteria};`)(item));
}

function comparisonFunction(item: any, field: string, operation: 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual', value: any) {
    switch (operation) {
      case 'equals':
        return item[field] === value;
      case 'greaterThan':
        return item[field] > value;
      case 'lessThan':
        return item[field] < value;
      case 'greaterThanOrEqual':
        return item[field] >= value;
      case 'lessThanOrEqual':
        return item[field] <= value;
      default:
        throw new Error(`Unsupported comparison operation: ${operation}`);
    }
  }


export function applyFilter(data: any[], operation: Operations.FilterOperation): any[] {
  console.log(`Applying filter with criteria: ${JSON.stringify(operation.criteria)}`);
  // Check if the criteria is a simple string or a complex object
  if (typeof operation.criteria === 'string') {
    // Existing simple string-based filtering logic
    console.log(`Filtering with simple string criteria: ${operation.criteria}`);
    return data.filter(item => new Function('item', `return ${operation.criteria};`)(item));
  } else {
    // New complex filtering logic
    console.log(`Filtering with complex object criteria of kind: ${operation.criteria.kind}`);
    switch (operation.criteria.kind) {
      case 'regex':
        const regex = new RegExp(operation.criteria.value as string);
        console.log(`Filtering with regex: ${regex}`);
        return data.filter(item => regex.test(item.toString()));
      case 'dateRange':
        const [startDate, endDate] = operation.criteria.value as [string, string];
        console.log(`Filtering with date range: ${startDate} to ${endDate}`);
        return data.filter(item => {
          const date = new Date(item);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });
      case 'number':
        const number = operation.criteria.value as number;
        console.log(`Filtering for number: ${number}`);
        return data.filter(item => item === number);
      case 'numericRange':
        const [min, max] = operation.criteria.value as [number, number];
        console.log(`Filtering with numeric range: ${min} to ${max}`);
        return data.filter(item => item >= min && item <= max);
      case 'string':
        console.log(`Filtering for string includes: ${operation.criteria}`);
        return data.filter(item => item.includes(operation.criteria as string));
      case 'customFunction':
        if (typeof operation.criteria === 'function') {
          console.log(`Filtering with custom function`);
          return data.filter((item: any) => (operation.criteria.valueOf as Function)(item));
        } else {
          throw new Error(`Expected a function for customFunction criteria, received ${typeof operation.criteria}`);
        }
      case 'fieldComparison':
        const { field, operation: compOperation, compareValue } = operation.criteria.value as Operations.FieldComparisonValue;
        console.log(`Filtering with field comparison: ${field} ${compOperation} ${compareValue}`);
        return data.filter(item => comparisonFunction(item, field, compOperation, compareValue));
      default:
        throw new Error(`Unsupported filter kind: ${operation.criteria.kind}`);
    }
  }
}

export function applyMap(data: any[], mapOperation: Operations.MapOperation): any[] {
  console.log(`Starting map operation with transformation: ${mapOperation.transformation.trim()}`);
  console.log(`Data length: ${data.length}`);
  console.log(`Data: ${JSON.stringify(data)}`);
  
  // Convert the string to a function
  try {
    // Directly use the transformation string as the function body.
    // Note: This assumes the transformation is a single expression arrow function.
    const transformationFunction = new Function('item', `return (${mapOperation.transformation.trim()})(item);`);
    console.log(`Transformation function created successfully.`);
    
    // Apply the transformation function to each item in the data array
    const result = data.map((item) => {
      try {
        // Now, transformationFunction directly applies the transformation to item.
        return transformationFunction(item);
      } catch (error) {
        console.error("Error applying map transformation:", error);
        return item; // Or handle the error as appropriate.
      }
    });

    console.log(`Map operation completed successfully.`);
    console.log(`Result:`, result);
    return result;
  } catch (error) {
    console.error(`Error creating transformation function:`, error);
    throw error; // Rethrow to ensure the error is not silently ignored
  }
}

export function applySort(data: any[], operation: Operations.SortOperation): any[] {
  if (!operation.field) {
    throw new Error("Sort operation must specify a 'field' to sort by.");
  }

  // Handle ascending and descending order directly
  if (operation.order === 'asc' || operation.order === 'desc') {
    return data.sort((a, b) => {
      let comparison = 0;
      if (a[operation.field] < b[operation.field]) {
        comparison = -1;
      } else if (a[operation.field] > b[operation.field]) {
        comparison = 1;
      }
      // Reverse the comparison for descending order
      return operation.order === 'desc' ? comparison * -1 : comparison;
    });
  } else if (typeof operation.order === 'object' && operation.order.function) {
    // Handle custom compare function
    // Caution: Using new Function() can be risky if the function string comes from an untrusted source
    const compareFunction = new Function(...operation.order.parameters, operation.order.function);
    console.log("Starting custom sort operation with provided compare function.");
    const sortedData = data.sort((a, b) => {
      const result = compareFunction(a, b);
      console.log(`Comparing ${JSON.stringify(a)} and ${JSON.stringify(b)}, result: ${result}`);
      return result;
    });
    console.log("Custom sort operation completed.");
    return sortedData;
  } else {
    throw new Error("Invalid sort order specified.");
  }
}

export function applyGroupBy(data: any[], operation: Operations.GroupByOperation): { [key: string]: any[] } {
  return data.reduce((acc, item) => {
    const key = typeof operation.key === 'function' ? operation.key(item) : item[operation.key];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function applyDistinct(data: any[], operation: Operations.DistinctOperation): any[] {
  const keyFn: (item: any) => string = typeof operation.key === 'function' 
    ? operation.key 
    : (item: any) => {
        const key = operation.key as string;
        return item[key]?.toString() ?? '';
      };
  const unique = new Map();
  return data.filter(item => {
    const key = keyFn(item);
    if (unique.has(key)) {
      return false;
    } else {
      unique.set(key, true);
      return true;
    }
  });
}

export function applyAggregate(data: any[], aggregation: Operations.AggregateOperation): Operations.AggregatedResult {
  console.log(`Starting aggregation with ${data.length} items.`);
  const result: Operations.AggregatedResult = {};

  // Since we're now dealing with a single aggregation operation, we no longer need to loop through an array of operations
  for (const agg of aggregation.aggregations) {
    console.log(`Processing aggregation: ${agg.operation} on field: ${agg.field}`);
    console.log(`Data:`, data);
    switch (agg.operation) {
      case 'average':
        const sumForAverage = data.reduce((acc, item) => {
          const valueToAdd = item[agg.field] || 0;
          return acc + valueToAdd;
        }, 0);
        const countForAverage = data.length;
        const average = countForAverage > 0 ? sumForAverage / countForAverage : 0;
        console.log(`Calculated average for field ${agg.field}: ${average}`);
        result[agg.as] = average;
        break;
      case 'max':
        const max = data.reduce((acc, item) => {
          const value = item[agg.field];
          return acc === undefined || value > acc ? value : acc;
        }, undefined); // Start with undefined to handle empty arrays correctly
        console.log(`Calculated max for field ${agg.field}: ${max}`);
        result[agg.as] = max;
        break;
      case 'min':
        const min = data.reduce((acc, item) => {
          const value = item[agg.field];
          return acc === undefined || value < acc ? value : acc;
        }, undefined); // Start with undefined to handle empty arrays correctly
        console.log(`Calculated min for field ${agg.field}: ${min}`);
        result[agg.as] = min;
        break;
      default:
        console.warn(`Unsupported aggregation operation: ${agg.operation}`);
    }
  }
  
  console.log(`Aggregation result:`, result);
  return result;
}

// Newly implemented operations based on the instructions
export function applyPivot(data: any[], operation: Operations.PivotOperation): { [key: string]: { [key: string]: any } } {
  const result: { [key: string]: { [key: string]: any } } = {};
  data.forEach(item => {
    const rowKey = item[operation.rowKey];
    const columnKey = item[operation.columnKey];
    const value = item[operation.valueKey];
    if (!result[rowKey]) result[rowKey] = {};
    result[rowKey][columnKey] = value;
  });
  return result;
}

export function applyUnpivot(data: any[], operation: Operations.UnpivotOperation): any[] {
  const result: any[] = []; // Explicitly type 'result' as 'any[]'
  data.forEach(item => {
    operation.keys.forEach(key => {
      const newObj = { [operation.valueKey]: item[key], ...item };
      delete newObj[key];
      result.push(newObj);
    });
  });
  return result;
}

export function applyJoin(data: any[], operation: Operations.JoinOperation): any[] {
  return data.filter(item => operation.target.some(targetItem => item[operation.joinKey] === targetItem[operation.joinKey]));
}

export function applyUnion(data: any[][], operation: Operations.UnionOperation): any[] {
  return operation.sources.flat();
}

export function applyIntersect(data: any[][], operation: Operations.IntersectOperation): any[] {
  return operation.sources.reduce((acc, curr) => acc.filter(item => curr.includes(item)));
}

export function applyExcept(data: any[], operation: Operations.ExceptOperation): any[] {
  return operation.source.filter(item => !operation.exclude.includes(item));
}

export function applySplit(data: any[], operation: Operations.SplitOperation): [any[], any[]] {
  return data.reduce(([pass, fail], item) => operation.criteria(item) ? [[...pass, item], fail] : [pass, [...fail, item]], [[], []]);
}

export function applyBucketize(data: any[], operation: Operations.BucketizeOperation): { [key: string]: any[] } {
    return Object.keys(operation.buckets).reduce<{ [key: string]: any[] }>((acc, key) => {
      const filterFunction = operation.buckets[key];
      if (typeof filterFunction === 'function') {
        acc[key] = data.filter(filterFunction);
      }
      return acc;
    }, {});
  }

  export function applySum(data: any[], operation: Operations.SumOperation): number {
    return data.reduce((acc, item) => acc + item[operation.field], 0);
  }
  
  export function applyCount(data: any[], operation: Operations.CountOperation): number {
    console.log(`Starting applyCount with data length: ${data.length} and operation:`, operation);

    // Initialize count
    let count = 0;

    // Iterate over each item in the data
    data.forEach((item, index) => {
      console.log(`Processing item at index ${index}:`, item);

      // Initialize a flag to determine if the item meets the criteria
      let meetsCriteria = true;

      // Check if a criteria is specified and if the item meets it
      if (operation.criteria && !item.hasOwnProperty(operation.criteria)) {
        console.log(`Item at index ${index} does not have the specified criteria property: ${operation.criteria}`);
        meetsCriteria = false;
      } else {
        console.log(`Item at index ${index} meets the criteria property check.`);
      }

      // Check if a condition is specified and if the item meets it
      if (meetsCriteria && operation.condition) {
        try {
          const conditionFunction = new Function('item', `return ${operation.condition};`);
          meetsCriteria = conditionFunction(item);
          console.log(`Item at index ${index} meets the condition: ${meetsCriteria}`);
        } catch (error) {
          console.error(`Error evaluating condition for item at index ${index}:`, error);
          meetsCriteria = false;
        }
      }

      // If the item meets both criteria and condition, increment the count
      if (meetsCriteria) {
        count++;
        console.log(`Item at index ${index} meets all criteria and conditions. Incrementing count to ${count}.`);
      } else {
        console.log(`Item at index ${index} does not meet all criteria and conditions. Count remains at ${count}.`);
      }
    });

    console.log(`Final count after processing all items: ${count}`);
    // Return the final count
    return count;
  }
  
  export function applyMax(data: any[], operation: Operations.MaxOperation): any {
    return data.reduce((max, item) => item[operation.field] > max ? item[operation.field] : max, data[0][operation.field]);
  }
  
  export function applyMin(data: any[], operation: Operations.MinOperation): any {
    return data.reduce((min, item) => item[operation.field] < min ? item[operation.field] : min, data[0][operation.field]);
  }
  
  // Example for applying a conditional operation
  export function applyConditional(data: any[], operation: Operations.ConditionalOperation): any[] {
    return data.map(item => {
      for (const condition of operation.conditions) {
        if (new Function('item', `return ${condition.condition};`)(item)) {
          return condition.result;
        }
      }
      return operation.defaultResult;
    });
  }
