import type { IMAGE_VARIANT_WEBP_MIME_TYPE } from './image-variants.constants';
import type { ImageVariantQuality } from './image-variants.constants';

export type IImageVariantDescriptor = {
  fileUrl: string;
  width: number;
  height: number;
  mimeType: typeof IMAGE_VARIANT_WEBP_MIME_TYPE;
};

export type IImageVariantsMap = Record<
  ImageVariantQuality,
  IImageVariantDescriptor
>;
