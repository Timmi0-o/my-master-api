import { Module } from '@nestjs/common';
import { CHECKSUM_CALCULATOR_PORT_TOKEN } from '../../../application/ports/i-checksum-calculator.port';
import { MIME_DETECTOR_PORT_TOKEN } from '../../../application/ports/i-mime-detector.port';
import type { IChecksumCalculatorPort } from '../../../application/ports/i-checksum-calculator.port';
import type { IMimeDetectorPort } from '../../../application/ports/i-mime-detector.port';
import { FileUploadedUseCase } from '../../../application/use-cases/file/file-uploaded.use-case';
import { FILE_REPOSITORY_TOKEN } from '../../../domain/repositories/file/file.repository.tokens';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import { InternalWebhookGuard } from '../../../presentation/guards/internal-webhook.guard';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [
    InternalWebhookGuard,
    {
      provide: FileUploadedUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        mimeDetector: IMimeDetectorPort,
        checksumCalculator: IChecksumCalculatorPort,
      ) =>
        new FileUploadedUseCase(fileRepo, mimeDetector, checksumCalculator),
      inject: [
        FILE_REPOSITORY_TOKEN,
        MIME_DETECTOR_PORT_TOKEN,
        CHECKSUM_CALCULATOR_PORT_TOKEN,
      ],
    },
  ],
  exports: [FileUploadedUseCase, InternalWebhookGuard],
})
export class FilesInternalModule {}
