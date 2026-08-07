export const IMAGE_VARIANT_QUALITIES = ['small', 'medium', 'high'] as const;

export type ImageVariantQuality = (typeof IMAGE_VARIANT_QUALITIES)[number];

export const IMAGE_VARIANT_LONG_EDGE_PIXELS: Record<
  ImageVariantQuality,
  number
> = {
  small: 320,
  medium: 768,
  high: 1440,
};

export const IMAGE_VARIANT_WEBP_QUALITY = 72;

export const IMAGE_VARIANT_NAME_PREFIXES: Record<ImageVariantQuality, string> =
  {
    small: 'small_',
    medium: 'medium_',
    high: 'high_',
  };

export const IMAGE_VARIANT_WEBP_MIME_TYPE = 'image/webp' as const;

export const IMAGE_VARIANT_SKIP_MIME_TYPES = new Set(['image/gif']);
