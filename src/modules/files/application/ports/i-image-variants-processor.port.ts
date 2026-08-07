import type {
  IImageVariantsMap,
  ImageVariantQuality,
} from '../../domain/entities/file';

export type IImageVariantProcessResult = {
  quality: ImageVariantQuality;
  buffer: Buffer;
  width: number;
  height: number;
};

export interface IImageVariantsProcessorPort {
  processVariants(
    originalImageBuffer: Buffer,
  ): Promise<IImageVariantProcessResult[]>;
}

export const IMAGE_VARIANTS_PROCESSOR_PORT_TOKEN = Symbol(
  'IMAGE_VARIANTS_PROCESSOR_PORT_TOKEN',
);

export type { IImageVariantsMap };
