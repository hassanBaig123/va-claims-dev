import { Operations } from './operations';

// Define interfaces for request bodies that might be used with POST and PUT requests
interface RequestBody {
    contentType: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';
    content: any; // This could be a string, object, or FormData depending on the contentType
  }

// Define the SourceOptions interface
interface SourceOptions {
  pollingInterval: number; // Interval in milliseconds to poll the source
  maxBatchSize: number;    // Maximum number of items to process in a single batch
  batchInterval: number;   // Interval in milliseconds between processing batches
  requestTimeout: number;  // Timeout in milliseconds for each request to the source
  retryAttempts: number;   // Number of retry attempts for failed requests
  retryDelay: number;      // Delay in milliseconds between retry attempts
}

export interface DataSource {
  type: 'uri' | 'flatFile' | 'dataset';
  source: string;
}

// Extend the SourceConfiguration interface to include SourceOptions
// Extend the SourceConfiguration interface to include method-specific properties
export interface SourceConfiguration {
    uri: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    operations: Operations.Operation[];
    options?: SourceOptions;
    headers?: Map<string, string>;
    body?: RequestBody; // Optional body for POST and PUT requests
  }