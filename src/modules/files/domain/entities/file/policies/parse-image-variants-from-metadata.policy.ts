import { IMAGE_VARIANT_QUALITIES } from './image-variants.constants';
import { IMAGE_VARIANT_WEBP_MIME_TYPE } from './image-variants.constants';
import type {
  IImageVariantDescriptor,
  IImageVariantsMap,
} from './i-image-variant.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseImageVariantDescriptor = (
  value: unknown,
): IImageVariantDescriptor | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { fileUrl, width, height, mimeType } = value;

  if (
    typeof fileUrl !== 'string' ||
    fileUrl.trim().length === 0 ||
    typeof width !== 'number' ||
    !Number.isFinite(width) ||
    width <= 0 ||
    typeof height !== 'number' ||
    !Number.isFinite(height) ||
    height <= 0 ||
    mimeType !== IMAGE_VARIANT_WEBP_MIME_TYPE
  ) {
    return null;
  }

  return {
    fileUrl,
    width,
    height,
    mimeType: IMAGE_VARIANT_WEBP_MIME_TYPE,
  };
};

export function parseImageVariantsFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): IImageVariantsMap | null {
  if (!metadata) {
    return null;
  }

  const variantsValue = metadata.variants;
  if (!isRecord(variantsValue)) {
    return null;
  }

  const parsedEntries: Partial<IImageVariantsMap> = {};

  for (const quality of IMAGE_VARIANT_QUALITIES) {
    const descriptor = parseImageVariantDescriptor(variantsValue[quality]);
    if (!descriptor) {
      return null;
    }
    parsedEntries[quality] = descriptor;
  }

  return parsedEntries as IImageVariantsMap;
}

export function listImageVariantFileUrlsFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): string[] {
  const variants = parseImageVariantsFromMetadata(metadata);
  if (!variants) {
    return [];
  }

  return IMAGE_VARIANT_QUALITIES.map((quality) => variants[quality].fileUrl);
}
