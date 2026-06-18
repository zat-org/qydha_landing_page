/**
 * Composable to handle Google Storage image URLs.
 */
export const useGoogleStorageImage = () => {
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) {
      return '';
    }

    return imageUrl;
  };

  const isGoogleStorageUrl = (url: string | null | undefined): boolean => {
    return !!url && url.includes('storage.googleapis.com');
  };

  return {
    getImageUrl,
    isGoogleStorageUrl,
  };
};
