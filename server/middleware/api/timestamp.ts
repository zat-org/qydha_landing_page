// server/middleware/timestamp.ts
import { defineEventHandler, getHeader, createError } from "h3";

export default defineEventHandler((event) => {
  const url = event.node.req.url || "";
  if (!url.startsWith("/api")) { 
    return;
  }

  if (url.startsWith("/_nuxt") || url.startsWith("/__nuxt") || url.startsWith("/api/_nuxt_icon")) {
    return;
  }

  // ✅ Or skip static/public files
  if (url.startsWith("/_ipx") || url.startsWith("/_content") || url.startsWith("/favicon")) {
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
  const diff =Math.abs( now - Number(ts));
  console.log(isNaN(diff) ||  diff < 180)
  if (isNaN(diff) ||  diff > 180) {
    // 3 minutes max
    throw createError({ statusCode: 400, statusMessage: "Request expired" });
  }
});
