const ALLOWED_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "maps.google.com",
  "www.google.com",
  "google.com",
]);

function isAllowedGoogleMapsUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return (
      url.protocol === "https:" &&
      (ALLOWED_HOSTS.has(url.hostname) || url.hostname.endsWith(".google.com"))
    );
  } catch {
    return false;
  }
}

function isResolvableShortUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return (
      url.hostname === "maps.app.goo.gl" ||
      (url.hostname === "goo.gl" && url.pathname.length > 1)
    );
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const url = String(getQuery(event).url ?? "").trim();

  if (!url || !isAllowedGoogleMapsUrl(url)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Google Maps URL",
    });
  }

  if (!isResolvableShortUrl(url)) {
    return { resolvedUrl: url };
  }

  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.url || !isAllowedGoogleMapsUrl(response.url)) {
    throw createError({
      statusCode: 422,
      statusMessage: "Could not resolve Google Maps short URL",
    });
  }

  return { resolvedUrl: response.url };
});
