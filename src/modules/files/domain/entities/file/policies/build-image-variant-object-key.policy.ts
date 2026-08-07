import {
  IMAGE_VARIANT_NAME_PREFIXES,
  type ImageVariantQuality,
} from './image-variants.constants';

export function buildImageVariantObjectKey(
  originalObjectKey: string,
  variantQuality: ImageVariantQuality,
): string {
  const lastSlashIndex = originalObjectKey.lastIndexOf('/');
  const directory =
    lastSlashIndex >= 0 ? originalObjectKey.slice(0, lastSlashIndex + 1) : '';
  const fileName =
    lastSlashIndex >= 0
      ? originalObjectKey.slice(lastSlashIndex + 1)
      : originalObjectKey;

  const lastDotIndex = fileName.lastIndexOf('.');
  const baseNameWithoutExtension =
    lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;

  return `${directory}${IMAGE_VARIANT_NAME_PREFIXES[variantQuality]}${baseNameWithoutExtension}.webp`;
}
