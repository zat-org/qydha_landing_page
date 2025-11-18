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
      // Parse multipart form data using H3's built-in parser
      try {
        const formData = await readMultipartFormData(event);
        
        if (formData && formData.length > 0) {
          // Reconstruct FormData for forwarding
          const forwardedFormData = new FormData();
          
          for (const part of formData) {
            if (!part.name) continue; // Skip parts without a name
            
            const partName = part.name; // Type guard
            
            if (part.filename) {
              // Handle file uploads - convert Buffer to Uint8Array for Blob
              const uint8Array = new Uint8Array(part.data);
              const blob = new Blob([uint8Array], { 
                type: part.type || 'application/octet-stream' 
              });
              forwardedFormData.append(partName, blob, part.filename);
            } else {
              // Handle regular form fields - convert buffer to string
              const value = part.data.toString('utf-8');
              forwardedFormData.append(partName, value);
            }
          }
          
          body = forwardedFormData;
          // Remove Content-Type header - let $fetch set it with correct boundary
          delete processedHeaders['content-type'];
        } else {
          // If parsing returns null/empty, fallback to raw body
          console.warn('Multipart parsing returned empty, using raw body');
          body = await readRawBody(event);
        }
      } catch (error) {
        console.error('Error parsing multipart form data:', error);
        // Fallback: try to read raw body and forward as-is
        try {
          body = await readRawBody(event);
        } catch (rawError) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid multipart form data'
          });
        }
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
