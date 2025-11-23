export default defineEventHandler(async (event) => {
  const path = event.node.req.url?.replace(/^\/api\/images\/?/, '') || '';
  
  // Only allow storage.googleapis.com URLs for security
  if (!path.includes('storage.googleapis.com')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid image URL. Only storage.googleapis.com URLs are allowed.'
    });
  }

  // Reconstruct the full URL
  const imageUrl = path.startsWith('http') ? path : `https://${path}`;
  
  try {
    // Fetch the image from Google Storage
    const response = await $fetch(imageUrl, {
      responseType: 'arrayBuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': 'https://qydha.com/'
      }
    });

    // Set appropriate headers for image response
    setHeader(event, 'Content-Type', getImageContentType(imageUrl));
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Access-Control-Allow-Methods', 'GET');
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    console.error('Error fetching image from Google Storage:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch image',
      data: error.message
    });
  }
});

function getImageContentType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'bmp': 'image/bmp'
  };
  return contentTypes[extension || ''] || 'image/jpeg';
}

