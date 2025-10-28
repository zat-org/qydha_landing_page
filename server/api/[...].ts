function normalizeHeaders(
  headers: Record<string, string | string[] | undefined>
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      normalized[key] = value.join(",");
    } else if (value !== undefined) {
      normalized[key] = value;
    }
  }
  return normalized;
}

function convertMultipartToFormData(multipartData: any[]): FormData {
  const formData = new FormData();
  
  for (const item of multipartData) {
    if (item.data && item.name) {
      // Handle file uploads
      if (item.filename) {
        const blob = new Blob([item.data], { type: item.type || 'application/octet-stream' });
        formData.append(item.name, blob, item.filename);
      } else {
        // Handle regular form fields
        formData.append(item.name, item.data.toString());
      }
    }
  }
  
  return formData;
}

// Alternative: Pass multipart data directly without conversion
function createMultipartBody(multipartData: any[]): any {
  // Return the multipart data as-is for $fetch to handle
  return multipartData;
}
export default defineEventHandler(async (event) => {
  // خُد الـ path بعد /api
  const config = useRuntimeConfig();
  const backendUrl = config.qydhaapiBase;
  const path = event.node.req.url!.replace(/^\/api\/?/, "");
  const method = event.node.req.method as
    | "GET"
    | "HEAD"
    | "PATCH"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | undefined;
  
  const headers = normalizeHeaders(event.node.req.headers);
  console.log(`Method: ${method}, Path: ${path}`);
  
  let body: any = undefined;
  let processedHeaders = { ...headers };
  // Remove hop-by-hop and problematic headers; let client compute them
  delete processedHeaders["content-length"]; // size may change when streaming
  delete processedHeaders["connection"];
  delete processedHeaders["transfer-encoding"];
  delete processedHeaders["accept-encoding"]; // avoid compressed upstream response issues
  delete processedHeaders["host"]; // undici will set host
  delete processedHeaders["expect"]; // avoid 100-continue handshake stalls
  
  // Handle body based on method and content type
  if (!["GET", "HEAD"].includes(method!)) {
    if (headers['content-type']?.includes('multipart/form-data')) {
      // For multipart requests, read the raw body to preserve the original format
      try {
        body = await readRawBody(event);
        // Keep the original content-type header with boundary
        // Don't modify headers for multipart requests
      } catch (error) {
        console.error('Error reading multipart form data:', error);
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid multipart form data'
        });
      }
    } else {
      body = await readBody(event);
    }
  }
  
  // console.log(`Forwarding to: ${backendUrl}/${path}`);
  
  try {
    const response = await $fetch(`${backendUrl}/${path}`, {
      method,
      body,
      headers: processedHeaders,
      timeout: 60000, // 60 seconds timeout for large multipart
      retry: 1, // Retry once on failure
    });
    
    // console.log('Response received successfully');
    return response;
  } catch (err: any) {
    console.error('Proxy error:', err);
    
    // Handle specific error types
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      throw createError({
        statusCode: 504,
        statusMessage: 'Gateway Timeout - Backend server is not responding'
      });
    }
    
    if (err.statusCode) {
      throw createError({
        statusCode: err.statusCode,
        statusMessage: err.statusMessage || 'Backend Error',
        data: err.data || err.message
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: err.message || 'Unknown error occurred'
    });
  }
});
