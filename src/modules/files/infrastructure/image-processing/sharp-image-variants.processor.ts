import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import type {
  IImageVariantProcessResult,
  IImageVariantsProcessorPort,
} from '../../application/ports/i-image-variants-processor.port';
import {
  IMAGE_VARIANT_LONG_EDGE_PIXELS,
  IMAGE_VARIANT_QUALITIES,
  IMAGE_VARIANT_WEBP_QUALITY,
} from '../../domain/entities/file';

@Injectable()
export class SharpImageVariantsProcessor implements IImageVariantsProcessorPort {
  async processVariants(
    originalImageBuffer: Buffer,
  ): Promise<IImageVariantProcessResult[]> {
    const results: IImageVariantProcessResult[] = [];

    for (const quality of IMAGE_VARIANT_QUALITIES) {
      const longEdgePixels = IMAGE_VARIANT_LONG_EDGE_PIXELS[quality];
      const transformed = sharp(originalImageBuffer, {
        failOn: 'none',
      }).rotate();

      const resized = transformed.resize({
        width: longEdgePixels,
        height: longEdgePixels,
        fit: 'inside',
        withoutEnlargement: true,
      });

      const { data, info } = await resized
        .webp({ quality: IMAGE_VARIANT_WEBP_QUALITY })
        .toBuffer({ resolveWithObject: true });

      results.push({
        quality,
        buffer: data,
        width: info.width,
        height: info.height,
      });
    }

    return results;
  }
}
