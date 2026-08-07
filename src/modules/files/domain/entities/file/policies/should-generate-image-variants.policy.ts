import { FileType } from '../file.enums';
import { IMAGE_VARIANT_SKIP_MIME_TYPES } from './image-variants.constants';

export function shouldGenerateImageVariants(
  fileType: FileType,
  mimeType: string,
): boolean {
  if (fileType !== FileType.IMAGE) {
    return false;
  }

  const normalizedMimeType = mimeType.trim().toLowerCase().split(';')[0] ?? '';

  if (!normalizedMimeType.startsWith('image/')) {
    return false;
  }

  return !IMAGE_VARIANT_SKIP_MIME_TYPES.has(normalizedMimeType);
}
