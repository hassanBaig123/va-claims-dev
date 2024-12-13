import { DataSource } from './source';

export module Operations {
  // Extend the operation type to include new operations
  export type OperationType = 'filter' | 'map' | 'sort' | 'reduce' | 'find' | 'findIndex' | 'every' | 'groupBy' | 'distinct' | 'aggregate' | 'pivot' | 'unpivot' | 'join' | 'union' | 'intersect' | 'except' | 'split' | 'bucketize' | 'sum' | 'count' | 'max' | 'min' | 'conditional'; // Add other operations as needed

  // Define a base interface for all operations, with a type to identify the operation
  export interface BaseOperation {
    id: string; // Unique identifier for the operation
    type: OperationType;
    input?: string[]; // Optional: keys of incoming datasets this operation depends on
  }

  // Define specific interfaces for each operation, extending the base interface
  export interface FilterOperation extends BaseOperation {
    type: 'filter';
    criteria: string | FilterCriteria; // Allow criteria to be a string or a more complex object
    condition?: { // Add this optional condition property
      field: string;
      operation: string;
      value: any;
    };
  }

  // Define a type for more complex filter criteria
  export type FilterCriteria = {
    kind: 'regex' | 'number' | 'dateRange' | 'numericRange' | 'string' | 'customFunction' | 'fieldComparison';
    value: string | number | [number, number] | [string, string] | Function | FieldComparisonValue; // Extend this based on the kind
  };
  
  export type FieldComparisonValue = {
    field: string;
    operation: 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
    compareValue: any;
  };

  export interface MapOperation extends BaseOperation {
    type: 'map';
    transformation: string;
  }

  export interface SortOperation extends BaseOperation {
    type: 'sort';
    field: string;
    order: 'asc' | 'desc' | CompareFunction;
  }

  export interface CompareFunction {
    function: string;
    parameters: string[];
  }

  export interface ReduceOperation extends BaseOperation {
    type: 'reduce';
    reducer: (accumulator: any, currentValue: any) => any;
    initialValue: any;
  }

  export interface FindOperation extends BaseOperation {
    type: 'find';
    criteria: string;
  }

  export interface FindIndexOperation extends BaseOperation {
    type: 'findIndex';
    criteria: string;
  }

  export interface EveryOperation extends BaseOperation {
    type: 'every';
    criteria: string;
  }

  export interface GroupByOperation extends BaseOperation {
    type: 'groupBy';
    key: string | ((item: any) => any);
  }

  export interface DistinctOperation extends BaseOperation {
    type: 'distinct';
    key: string | ((item: any) => any);
  }

  export interface AggregateOperation extends BaseOperation {
    type: 'aggregate';
    aggregations: Aggregation[];
  }

  export type Aggregation = {
    field: string; // Field to aggregate
    operation: 'sum' | 'count' | 'max' | 'min' | 'average'; // Include 'average'
    as: string; // Alias for the result
  };

  export interface AggregatedResult {
    [key: string]: any | undefined; // This allows indexing with a string to get a value of any type
  }

  export interface PivotOperation extends BaseOperation {
    type: 'pivot';
    rowKey: string;
    columnKey: string;
    valueKey: string;
  }

  export interface UnpivotOperation extends BaseOperation {
    type: 'unpivot';
    keys: string[];
    valueKey: string;
  }

  export interface JoinOperation extends BaseOperation {
    type: 'join';
    joinKey: string;
    target: any[];
  }

  export interface UnionOperation extends BaseOperation {
    type: 'union';
    sources: any[][];
  }

  export interface IntersectOperation extends BaseOperation {
    type: 'intersect';
    sources: any[][];
  }

  export interface ExceptOperation extends BaseOperation {
    type: 'except';
    source: any[];
    exclude: any[];
  }

  export interface SplitOperation extends BaseOperation {
    type: 'split';
    criteria: (item: any) => boolean;
  }

  export interface BucketizeOperation extends BaseOperation {
    type: 'bucketize';
    buckets: { [key: string]: (item: any) => boolean }; // This already looks correct, but ensure it's properly recognized in the context where it's used.
  }

  export interface SumOperation extends BaseOperation {
    type: 'sum';
    field: string; // Field to sum up
  }

  export interface CountOperation extends BaseOperation {
    type: 'count';
    criteria: string; // Field to count
    condition: string; // Optional condition to count specific items
  }

  export interface MaxOperation extends BaseOperation {
    type: 'max';
    field: string; // Field to find the max value
  }

  export interface MinOperation extends BaseOperation {
    type: 'min';
    field: string; // Field to find the min value
  }

  // Example for a conditional operation
  export interface ConditionalOperation extends BaseOperation {
    type: 'conditional';
    conditions: Array<{
      condition: string; // Logical condition
      result: any; // Result if condition is true
    }>;
    defaultResult: any; // Default result if no conditions are met
  }

  // Union type for all operations
  export type Operation = FilterOperation | MapOperation | SortOperation | ReduceOperation | FindOperation | FindIndexOperation | EveryOperation | GroupByOperation | DistinctOperation | AggregateOperation | PivotOperation | UnpivotOperation | JoinOperation | UnionOperation | IntersectOperation | ExceptOperation | SplitOperation | BucketizeOperation | SumOperation | CountOperation | MaxOperation | MinOperation | ConditionalOperation; // Add other operations as needed
}
