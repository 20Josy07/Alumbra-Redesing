/** Tamaño máximo del archivo original (2 MB). */
export const MAX_AVATAR_FILE_BYTES = 2 * 1024 * 1024;

/** Límite del data URL en Firestore (~330 KB binarios, margen bajo 1 MiB/doc). */
export const MAX_AVATAR_DATA_URL_LENGTH = 450_000;

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

export function isAllowedAvatarType(type: string): boolean {
  return (ALLOWED_TYPES as readonly string[]).includes(type);
}

/** Comprime y recorta (cuadrado) a `size` px; devuelve JPEG en base64 (data URL). */
export function compressImageToDataUrl(
  file: File,
  size = 256,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read_error'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('image_error'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas_error'));

        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);
        while (dataUrl.length > MAX_AVATAR_DATA_URL_LENGTH && q > 0.45) {
          q -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', q);
        }
        if (dataUrl.length > MAX_AVATAR_DATA_URL_LENGTH) {
          return reject(new Error('too_large'));
        }
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
