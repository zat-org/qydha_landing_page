export interface ParsedGoogleMapsLocation {
  latitude: number;
  longitude: number;
  name: string | null;
}

const COORD_PAIR =
  /(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/;

function decodePlaceName(value: string): string {
  return decodeURIComponent(value.replace(/\+/g, " ")).trim();
}

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function toCoords(lat: number, lng: number): ParsedGoogleMapsLocation | null {
  if (!isValidCoordinate(lat, lng)) return null;
  return { latitude: lat, longitude: lng, name: null };
}

function extractName(url: URL): string | null {
  const placeMatch = url.pathname.match(/\/place\/([^/]+)/i);
  if (placeMatch?.[1]) {
    return decodePlaceName(placeMatch[1]);
  }

  const searchMatch = url.pathname.match(/\/search\/([^/]+)/i);
  if (searchMatch?.[1] && !COORD_PAIR.test(searchMatch[1])) {
    return decodePlaceName(searchMatch[1]);
  }

  const query = url.searchParams.get("q") ?? url.searchParams.get("query");
  if (query && !COORD_PAIR.test(query)) {
    return decodePlaceName(query);
  }

  return null;
}

function extractCoordinates(url: URL): { lat: number; lng: number } | null {
  const dataParam = url.pathname + url.search;
  const pinMatch = dataParam.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i);
  if (pinMatch) {
    const lat = Number(pinMatch[1]);
    const lng = Number(pinMatch[2]);
    if (isValidCoordinate(lat, lng)) return { lat, lng };
  }

  const atMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
  if (atMatch) {
    const lat = Number(atMatch[1]);
    const lng = Number(atMatch[2]);
    if (isValidCoordinate(lat, lng)) return { lat, lng };
  }

  for (const key of ["q", "query", "ll", "center"]) {
    const value = url.searchParams.get(key);
    if (!value) continue;

    const pairMatch = value.match(COORD_PAIR);
    if (pairMatch) {
      const lat = Number(pairMatch[1]);
      const lng = Number(pairMatch[2]);
      if (isValidCoordinate(lat, lng)) return { lat, lng };
    }
  }

  return null;
}

function isGoogleMapsHost(hostname: string): boolean {
  return (
    hostname === "maps.google.com" ||
    hostname === "www.google.com" ||
    hostname === "google.com" ||
    hostname === "maps.app.goo.gl" ||
    hostname === "goo.gl" ||
    hostname.endsWith(".google.com")
  );
}

export function isShortGoogleMapsUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return (
      url.hostname === "maps.app.goo.gl" ||
      (url.hostname === "goo.gl" && url.pathname.length > 1)
    );
  } catch {
    return false;
  }
}

export async function resolveGoogleMapsUrl(input: string): Promise<string> {
  const trimmed = input.trim();

  if (!isShortGoogleMapsUrl(trimmed)) {
    return trimmed;
  }

  const { resolvedUrl } = await $fetch<{ resolvedUrl: string }>(
    "/api/maps/resolve",
    { query: { url: trimmed } },
  );

  return resolvedUrl;
}

export function parseGoogleMapsUrl(input: string): ParsedGoogleMapsLocation | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!isGoogleMapsHost(url.hostname)) {
    return null;
  }

  const coords = extractCoordinates(url);
  if (!coords) return null;

  const name = extractName(url);

  return {
    latitude: coords.lat,
    longitude: coords.lng,
    name,
  };
}

export async function parseGoogleMapsUrlAsync(
  input: string,
): Promise<ParsedGoogleMapsLocation | null> {
  const resolvedUrl = await resolveGoogleMapsUrl(input);
  return parseGoogleMapsUrl(resolvedUrl);
}
