/**
 * Composable to handle Google Storage images with proxy fallback
 * This helps avoid 400 errors and CORS issues when loading images from Google Storage
 */
export const useGoogleStorageImage = () => {
  /**
   * Get the image URL, using proxy if needed
   * @param imageUrl - The original Google Storage URL
   * @param useProxy - Whether to use the proxy route (default: true)
   * @returns The processed image URL
   */
  const getImageUrl = (imageUrl: string | null | undefined, useProxy: boolean = true): string => {
    if (!imageUrl) {
      return '';
    }

    // If it's not a Google Storage URL, return as is
    if (!imageUrl.includes('storage.googleapis.com')) {
      return imageUrl;
    }

    // If proxy is disabled, return original URL
    if (!useProxy) {
      return imageUrl;
    }

    // Use the proxy route to avoid CORS and 400 errors
    // Remove https:// from the URL as the proxy will add it
    const path = imageUrl.replace(/^https?:\/\//, '');
    return `/api/images/${path}`;
  };

  /**
   * Check if an URL is from Google Storage
   */
  const isGoogleStorageUrl = (url: string | null | undefined): boolean => {
    return !!url && url.includes('storage.googleapis.com');
  };

  return {
    getImageUrl,
    isGoogleStorageUrl
  };
};

