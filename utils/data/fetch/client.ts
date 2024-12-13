import fetch, { RequestInit } from 'node-fetch';
import { SourceConfiguration } from '../../../models/data/source';

async function fetchDataWithRetry(sourceConfig: SourceConfiguration): Promise<any[]> {
    const { uri, options, headers, method, body } = sourceConfig;
    const attempts = options?.retryAttempts ?? 3;
    const delay = options?.retryDelay ?? 1000;
    const requestTimeout = options?.requestTimeout ?? 5000; // Default timeout

    for (let i = 0; i < attempts; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

            // Initialize headers as an empty object or convert existing headers
            let requestHeaders: Record<string, string> = headers ? Object.fromEntries(headers) : {};

            // Include the body for POST and PUT requests
            if (body && (method === 'POST' || method === 'PUT')) {
                const bodyContent = JSON.stringify(body.content);
                // Ensure the Content-Type header is set based on the body's contentType
                requestHeaders['Content-Type'] = body.contentType;

                // Prepare the request options including method, headers, and body
                const requestOptions: RequestInit = {
                    method: method,
                    signal: controller.signal,
                    headers: requestHeaders,
                    body: bodyContent,
                };

                const response = await fetch(uri, requestOptions);
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data from ${uri}. Status: ${response.status} ${response.statusText}`);
                }
                const data = await response.json() as any[];
                return data;
            } else {
                // Prepare the request options for methods without a body
                const requestOptions: RequestInit = {
                    method: method,
                    signal: controller.signal,
                    headers: requestHeaders,
                };

                const response = await fetch(uri, requestOptions);
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data from ${uri}. Status: ${response.status} ${response.statusText}`);
                }
                const data = await response.json() as any[];
                return data;
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} - Error fetching data: ${error}`);
            if (i < attempts - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error; // Rethrow error on last attempt
            }
        }
    }
    return []; // Fallback return, should not reach here due to throw
}

export async function fetchDataFromSource(sourceConfig: SourceConfiguration): Promise<any[]> {
    return fetchDataWithRetry(sourceConfig);
}