import { createHmac } from 'crypto';

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

// Helper function to get header case-insensitively
function getHeader(headers: Record<string, string>, name: string): string | undefined {
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  return undefined;
}

// Helper function to verify signature
function verifySignature(
  timestamp: string,
  xInfo: string,
  signature: string,
  secret: string
): boolean {
  try {
    if (!secret) {
      console.error('Secret is missing for signature verification');
      return false;
    }
    const message = `${timestamp}:${xInfo}`;
    const hmac = createHmac('sha256', secret);
    hmac.update(message);
    const expectedSignature = hmac.digest('hex');
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Helper function to validate x-info structure
function validateXInfo(xInfo: string): boolean {
  try {
    const info = JSON.parse(xInfo);
    // Check required fields
    return !!(
      info.deviceId &&
      info.deviceFingerprint &&
      typeof info.deviceId === 'string' &&
      typeof info.deviceFingerprint === 'string'
    );
  } catch (error) {
    console.error('x-info validation error:', error);
    return false;
  }
}

export default defineEventHandler(async (event) => {
  try {
    // خُد الـ path بعد /api
    const config = useRuntimeConfig();
    
    // Validate config
    if (!config) {
      console.error('❌ Server configuration is missing');
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error'
      });
    }
    
    const backendUrl = config.qydhaapiBase;
    if (!backendUrl) {
      console.error('❌ Backend URL not configured');
      throw createError({
        statusCode: 500,
        statusMessage: 'Backend URL not configured'
      });
    }
    
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
    
    // ===== VALIDATION: Ensure request is from website =====
    // Use case-insensitive header lookup
    const xInfo = getHeader(headers, 'x-info') || headers['x-info'];
    const xTimestamp = getHeader(headers, 'x-timestamp') || headers['x-timestamp'];
    const xSignature = getHeader(headers, 'x-signature') || headers['x-signature'];
    
    // Debug logging
    console.log('🔍 [API Proxy] Validation Check:', {
      method,
      path,
      hasXInfo: !!xInfo,
      hasXTimestamp: !!xTimestamp,
      hasXSignature: !!xSignature,
      timestamp: xTimestamp,
      secretExists: !!config.public?.qydhaToken,
      allHeaders: Object.keys(headers).filter(k => k.toLowerCase().startsWith('x-'))
    });
    
    // Check required headers exist
    if (!xInfo || !xTimestamp || !xSignature) {
      console.warn('⚠️ [API Proxy] Missing required headers:', {
        hasXInfo: !!xInfo,
        hasXTimestamp: !!xTimestamp,
        hasXSignature: !!xSignature,
        receivedHeaders: Object.keys(headers).filter(k => k.toLowerCase().includes('x-'))
      });
      throw createError({
        statusCode: 403,
        statusMessage: 'Missing required headers: x-info, x-timestamp, or x-signature',
        data: {
          hasXInfo: !!xInfo,
          hasXTimestamp: !!xTimestamp,
          hasXSignature: !!xSignature,
          receivedHeaders: Object.keys(headers).filter(k => k.toLowerCase().includes('x-'))
        }
      });
    }
    
    // Validate timestamp (must be within last 5 minutes, not in future)
    const timestamp = parseInt(xTimestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTime - timestamp);
    
    if (isNaN(timestamp) || timestamp > currentTime + 60 || timeDiff > 300) {
      console.warn('⚠️ [API Proxy] Invalid timestamp:', {
        timestamp,
        currentTime,
        timeDiff,
        isExpired: timeDiff > 300,
        isFuture: timestamp > currentTime + 60,
        isNaN: isNaN(timestamp)
      });
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid or expired timestamp',
        data: {
          timestamp,
          currentTime,
          timeDiff,
          isExpired: timeDiff > 300,
          isFuture: timestamp > currentTime + 60
        }
      });
    }
    
    // Validate x-info structure
    if (!validateXInfo(xInfo)) {
      console.warn('⚠️ [API Proxy] Invalid x-info structure:', {
        xInfoPreview: xInfo.substring(0, 100),
        xInfoLength: xInfo.length
      });
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid x-info structure',
        data: { 
          xInfoPreview: xInfo.substring(0, 100),
          xInfoLength: xInfo.length
        }
      });
    }
    
    // Verify signature
    const secret = config.public?.qydhaToken || 'default-secret';
    if (!secret || secret === 'default-secret') {
      console.warn('⚠️ [API Proxy] Using default secret - change in production!');
    }
    
    if (!verifySignature(xTimestamp, xInfo, xSignature, secret)) {
      // Recalculate for debugging
      const message = `${xTimestamp}:${xInfo}`;
      const hmac = createHmac('sha256', secret);
      hmac.update(message);
      const expectedSig = hmac.digest('hex');
      
      console.warn('⚠️ [API Proxy] Signature mismatch:', {
        receivedSignature: xSignature.substring(0, 20) + '...',
        expectedSignature: expectedSig.substring(0, 20) + '...',
        messageLength: message.length,
        secretLength: secret.length
      });
      
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid request signature',
        data: {
          receivedSignature: xSignature.substring(0, 20) + '...',
          expectedSignature: expectedSig.substring(0, 20) + '...',
          messageLength: message.length
        }
      });
    }
    
    console.log('✅ [API Proxy] Validation passed, forwarding request');
    // ===== END VALIDATION =====
  
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
      const contentType = headers['content-type'] || headers['Content-Type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        // Parse multipart form data using H3's built-in parser
        try {
          const formData = await readMultipartFormData(event);
          
          if (formData && formData.length > 0) {
            // Reconstruct FormData for forwarding
            const forwardedFormData = new FormData();
            
            for (const part of formData) {
              if (!part.name) continue;
              
              const partName = part.name;
              
              if (part.filename) {
                const uint8Array = new Uint8Array(part.data);
                const blob = new Blob([uint8Array], { 
                  type: part.type || 'application/octet-stream' 
                });
                forwardedFormData.append(partName, blob, part.filename);
              } else {
                const value = part.data.toString('utf-8');
                forwardedFormData.append(partName, value);
              }
            }
            
            body = forwardedFormData;
            delete processedHeaders['content-type'];
          } else {
            body = await readRawBody(event);
          }
        } catch (error) {
          console.error('❌ [API Proxy] Error parsing multipart form data:', error);
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
        // Wrap readBody in try-catch to prevent 500 errors
        try {
          body = await readBody(event);
        } catch (bodyError: any) {
          // If body is already consumed or empty, that's okay for some requests
          if (bodyError.message?.includes('already consumed') || 
              bodyError.message?.includes('stream') ||
              bodyError.message?.includes('body already')) {
            console.log('ℹ️ [API Proxy] Body already consumed, continuing without body');
            body = undefined;
          } else {
            console.error('❌ [API Proxy] Error reading body:', bodyError);
            throw createError({
              statusCode: 400,
              statusMessage: 'Error reading request body',
              data: bodyError.message
            });
          }
        }
      }
    }
  
    console.log(`📤 [API Proxy] Forwarding ${method} request to: ${backendUrl}/${path}`);
    try {
      const response = await $fetch(`${backendUrl}/${path}`, {
        method,
        body,
        headers: processedHeaders,
        timeout: 60000, // 60 seconds timeout for large multipart
        retry: 1, // Retry once on failure
      });
      
      console.log('✅ [API Proxy] Response received successfully');
      return response;
    } catch (err: any) {
      console.error('❌ [API Proxy] Proxy error:', {
        code: err.code,
        statusCode: err.statusCode,
        message: err.message,
        statusMessage: err.statusMessage
      });
      
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
  } catch (error: any) {
    // Catch any unhandled errors and return proper error response
    if (error.statusCode) {
      // This is already a createError, re-throw it
      throw error;
    }
    
    // Unexpected error - log it and return 500
    console.error('❌ [API Proxy] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: error.message || 'An unexpected error occurred'
    });
  }
});
