/**
 * Compresses an image File using an in-browser Canvas
 * Resizes down to showcase dimensions (max 1200x675) with 0.8 quality compression
 * @param {File} file 
 * @param {Object} options
 * @returns {Promise<string>} Base64 data URL
 */
export function compressImageForShowcase(file, { maxWidth = 1200, maxHeight = 675, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed WebP or JPEG
        const mimeType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        const compressedBase64 = canvas.toDataURL(mimeType, quality);
        resolve(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
