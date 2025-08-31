// server/middleware/timestamp.ts
import { defineEventHandler, getHeader, createError } from "h3";

export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api")) { 
    return;
  }
  const ts = getHeader(event, "X-Timestamp");

  if (!ts) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing X-Timestamp",
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const diff = now - Number(ts);

  if (isNaN(diff) || diff > 180) {
    // 3 minutes max
    throw createError({ statusCode: 401, statusMessage: "Request expired" });
  }
});
