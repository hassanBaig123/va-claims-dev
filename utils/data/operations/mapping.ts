import * as processing from './operations';
import { Operations } from '../../../models/data/operations';

type OperationFunction<T> = (data: any[], operation: T) => any;

export const operationMapping: { [K in Operations.OperationType]: OperationFunction<any> } = {
  filter: processing.applyFilter as OperationFunction<Operations.FilterOperation>,
  map: processing.applyMap as OperationFunction<Operations.MapOperation>,
  sort: processing.applySort as OperationFunction<Operations.SortOperation>,
  reduce: processing.applyReduce as OperationFunction<Operations.ReduceOperation>,
  find: processing.applyFind as OperationFunction<Operations.FindOperation>,
  findIndex: processing.applyFindIndex as OperationFunction<Operations.FindIndexOperation>,
  every: processing.applyEvery as OperationFunction<Operations.EveryOperation>,
  groupBy: processing.applyGroupBy as OperationFunction<Operations.GroupByOperation>,
  distinct: processing.applyDistinct as OperationFunction<Operations.DistinctOperation>,
  aggregate: processing.applyAggregate as OperationFunction<Operations.AggregateOperation>,
  pivot: processing.applyPivot as OperationFunction<Operations.PivotOperation>,
  unpivot: processing.applyUnpivot as OperationFunction<Operations.UnpivotOperation>,
  join: processing.applyJoin as OperationFunction<Operations.JoinOperation>,
  union: processing.applyUnion as OperationFunction<Operations.UnionOperation>,
  intersect: processing.applyIntersect as OperationFunction<Operations.IntersectOperation>,
  except: processing.applyExcept as OperationFunction<Operations.ExceptOperation>,
  split: processing.applySplit as OperationFunction<Operations.SplitOperation>,
  bucketize: processing.applyBucketize as OperationFunction<Operations.BucketizeOperation>,
  min: processing.applyMin as OperationFunction<Operations.MinOperation>,
  max: processing.applyMax as OperationFunction<Operations.MaxOperation>,
  sum: processing.applySum as OperationFunction<Operations.SumOperation>,
  count: processing.applyCount as OperationFunction<Operations.CountOperation>, 
  conditional: processing.applyConditional as OperationFunction<Operations.ConditionalOperation>
};

