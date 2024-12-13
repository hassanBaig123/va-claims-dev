import { fetchDataFromSource } from '../fetch/client';
import { operationMapping } from '../operations/mapping';
import { SourceConfiguration } from '../../../models/data/source';
import { Operations } from '../../../models/data/operations';

const datasetRegistry: { [key: string]: any[] } = {};

export async function processData(sourceConfig: SourceConfiguration): Promise<any[]> {
  let data = await fetchDataFromSource(sourceConfig);
  datasetRegistry["initial"] = data; // Save initial data

  for (const operation of sourceConfig.operations) {
    if (isOperationValid(operation)) {
      data = await executeOperation(data, operation); // Pass current data to the next operation
    }
  }

  return data; // Return the final processed data
}

async function executeOperation(data: any[], operation: Operations.BaseOperation): Promise<any[]> {
  const operationFunction = operationMapping[operation.type];
  if (operationFunction) {
    return await operationFunction(data, operation); // Execute operation on current data
  } else {
    throw new Error(`Operation type '${operation.type}' is not supported.`);
  }
}

function isOperationValid(operation: any): operation is Operations.Operation {
  return operation && typeof operation.type === 'string' && operationMapping.hasOwnProperty(operation.type);
}