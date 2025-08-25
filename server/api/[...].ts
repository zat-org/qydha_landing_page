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
  const path = event.node.req.url!.replace(/^\/api/, "");

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

  // ابعته للباك إند الحقيقي
  const response = await $fetch(`${backendUrl}${path}`, {
    method,
    body: ["GET","HEAD"].includes(method!)?undefined : await readBody(event),
    headers,
  });
  return response;
});
