import {
  FileStatus,
  FileType,
  shouldGenerateImageVariants,
} from '../../../domain/entities/file';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IChecksumCalculatorPort } from '../../ports/i-checksum-calculator.port';
import type { IImageVariantsQueuePort } from '../../ports/i-image-variants-queue.port';
import type { IMimeDetectorPort } from '../../ports/i-mime-detector.port';
import type { IFileUploadedApplicationInput } from '../../dtos/file/file-uploaded.input';

export class FileUploadedUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly mimeDetector: IMimeDetectorPort,
    private readonly checksumCalculator: IChecksumCalculatorPort,
    private readonly imageVariantsQueue: IImageVariantsQueuePort,
  ) {}

  async execute(input: IFileUploadedApplicationInput): Promise<void> {
    const file = await this.fileRepository.findEntityByUrl(input.fileUrl);
    if (!file) {
      return;
    }

    const mimeType = await this.mimeDetector.detect(file);
    const checksum = await this.checksumCalculator.getChecksum(file);
    const resolvedMimeType = mimeType ?? file.mimeType;

    await this.fileRepository.update(file.id, {
      mimeType: resolvedMimeType,
      fileSize: BigInt(input.size),
      checksum: checksum ?? file.checksum,
      metadata: {
        etag: input.eTag,
        location: input.location,
        ...(input.userMetadata ?? {}),
      },
      status: FileStatus.UPLOADED,
    });

    if (file.fileType === FileType.IMAGE) {
      if (shouldGenerateImageVariants(file.fileType, resolvedMimeType)) {
        await this.imageVariantsQueue.enqueueProcessImageVariants({
          fileId: file.id,
        });
        return;
      }

      await this.fileRepository.update(file.id, {
        status: FileStatus.READY,
      });
    }
  }
}
