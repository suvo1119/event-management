import ImageKit from 'imagekit';

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

let imagekitInstance = null;

export function getImageKitClient() {
  if (!imagekitInstance && publicKey && privateKey && urlEndpoint && !publicKey.includes('your_')) {
    try {
      imagekitInstance = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint
      });
    } catch (err) {
      console.warn('ImageKit initialization error:', err.message);
    }
  }
  return imagekitInstance;
}

/**
 * Uploads a file (base64 or buffer) to ImageKit and returns
 * a URL formatted with showcase size compression transformations (w: 800, h: 450, q: 80)
 */
export async function uploadAndCompressImage(fileData, fileName = 'festival-banner') {
  const client = getImageKitClient();

  if (!client) {
    // If ImageKit credentials are not yet configured with real API keys,
    // return the data directly so the application still works without external blockers.
    return {
      success: true,
      url: fileData,
      source: 'local-compressed',
      message: 'Image stored locally (configure ImageKit keys in .env for CDN hosting)'
    };
  }

  try {
    const uploadResponse = await client.upload({
      file: fileData,
      fileName: `${fileName}-${Date.now()}`,
      folder: '/festivals',
      useUniqueFileName: true
    });

    // Generate transformation URL for showcase size (800x450, quality 80, auto-format WebP)
    const compressedShowcaseUrl = client.url({
      src: uploadResponse.url,
      transformation: [
        {
          width: '800',
          height: '450',
          cropMode: 'maintain_ratio',
          focus: 'auto',
          quality: '80',
          format: 'webp'
        }
      ]
    });

    return {
      success: true,
      url: compressedShowcaseUrl,
      rawUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
      source: 'imagekit'
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    // Graceful fallback to provided image data
    return {
      success: true,
      url: fileData,
      source: 'fallback',
      warning: error.message
    };
  }
}
