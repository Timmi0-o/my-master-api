import {
  FileStatus,
  IMAGE_VARIANT_WEBP_MIME_TYPE,
  buildImageVariantObjectKey,
  shouldGenerateImageVariants,
  type IImageVariantsMap,
} from '../../../domain/entities/file';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import { parseS3Url } from '../../../infrastructure/utils/parse-s3-url';
import type { IProcessImageVariantsApplicationInput } from '../../dtos/file/process-image-variants.input';
import type { IProcessImageVariantsApplicationOutput } from '../../dtos/file/process-image-variants.output';
import type { IImageVariantsProcessorPort } from '../../ports/i-image-variants-processor.port';
import type { IObjectStoragePort } from '../../ports/i-object-storage.port';

export class ProcessImageVariantsUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly objectStorage: IObjectStoragePort,
    private readonly imageVariantsProcessor: IImageVariantsProcessorPort,
  ) {}

  async execute(
    input: IProcessImageVariantsApplicationInput,
  ): Promise<IProcessImageVariantsApplicationOutput> {
    const file = await this.fileRepository.findEntityById(input.fileId);
    if (!file) {
      return { processed: false, reason: 'FILE_NOT_FOUND' };
    }

    if (!shouldGenerateImageVariants(file.fileType, file.mimeType)) {
      if (file.status !== FileStatus.READY) {
        await this.fileRepository.update(file.id, {
          status: FileStatus.READY,
          metadata: {
            ...(file.metadata ?? {}),
          },
        });
      }
      return { processed: false, reason: 'VARIANTS_NOT_REQUIRED' };
    }

    if (!input.force && file.status === FileStatus.READY) {
      return { processed: false, reason: 'ALREADY_READY' };
    }

    const parsed = parseS3Url(file.fileUrl);
    if (!parsed) {
      await this.markProcessingError(
        file.id,
        file.metadata,
        'INVALID_FILE_URL',
      );
      return { processed: false, reason: 'INVALID_FILE_URL' };
    }

    const bucket = parsed.bucket ?? this.objectStorage.getDefaultBucket();

    try {
      const originalBuffer = await this.objectStorage.getObjectBuffer(
        parsed.key,
        bucket,
      );
      const processedVariants =
        await this.imageVariantsProcessor.processVariants(originalBuffer);

      const variants: Partial<IImageVariantsMap> = {};

      for (const processedVariant of processedVariants) {
        const variantObjectKey = buildImageVariantObjectKey(
          parsed.key,
          processedVariant.quality,
        );

        await this.objectStorage.putObject({
          objectKey: variantObjectKey,
          body: processedVariant.buffer,
          contentType: IMAGE_VARIANT_WEBP_MIME_TYPE,
          bucket,
        });

        variants[processedVariant.quality] = {
          fileUrl: this.objectStorage.buildS3FileUrl(variantObjectKey, bucket),
          width: processedVariant.width,
          height: processedVariant.height,
          mimeType: IMAGE_VARIANT_WEBP_MIME_TYPE,
        };
      }

      const nextMetadata: Record<string, unknown> = {
        ...(file.metadata ?? {}),
        variants,
      };
      delete nextMetadata.processingError;

      await this.fileRepository.update(file.id, {
        status: FileStatus.READY,
        metadata: nextMetadata,
      });

      return { processed: true };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'UNKNOWN_PROCESSING_ERROR';
      await this.markProcessingError(file.id, file.metadata, message);
      throw error;
    }
  }

  private async markProcessingError(
    fileId: string,
    metadata: Record<string, unknown> | null,
    processingError: string,
  ): Promise<void> {
    await this.fileRepository.update(fileId, {
      metadata: {
        ...(metadata ?? {}),
        processingError,
      },
    });
  }
}
