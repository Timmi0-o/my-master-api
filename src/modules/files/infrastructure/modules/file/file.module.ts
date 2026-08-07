import { Module, forwardRef } from '@nestjs/common';
import { CHECKSUM_CALCULATOR_PORT_TOKEN } from '../../../application/ports/i-checksum-calculator.port';
import { FILE_UPLOADER_PORT_TOKEN } from '../../../application/ports/i-file-uploader.port';
import { IMAGE_VARIANTS_PROCESSOR_PORT_TOKEN } from '../../../application/ports/i-image-variants-processor.port';
import { IMAGE_VARIANTS_QUEUE_PORT_TOKEN } from '../../../application/ports/i-image-variants-queue.port';
import { MIME_DETECTOR_PORT_TOKEN } from '../../../application/ports/i-mime-detector.port';
import { OBJECT_STORAGE_PORT_TOKEN } from '../../../application/ports/i-object-storage.port';
import type { IChecksumCalculatorPort } from '../../../application/ports/i-checksum-calculator.port';
import type { IFileUploaderPort } from '../../../application/ports/i-file-uploader.port';
import type { IImageVariantsProcessorPort } from '../../../application/ports/i-image-variants-processor.port';
import type { IImageVariantsQueuePort } from '../../../application/ports/i-image-variants-queue.port';
import type { IMimeDetectorPort } from '../../../application/ports/i-mime-detector.port';
import type { IObjectStoragePort } from '../../../application/ports/i-object-storage.port';
import { GrantFileAccessUseCase } from '../../../application/use-cases/file-access/grant-file-access.use-case';
import { RevokeFileAccessUseCase } from '../../../application/use-cases/file-access/revoke-file-access.use-case';
import { CreateFilesUseCase } from '../../../application/use-cases/file/create-files.use-case';
import { DeleteFilesUseCase } from '../../../application/use-cases/file/delete-files.use-case';
import { GetFileUseCase } from '../../../application/use-cases/file/get-file.use-case';
import { GetFilesByIdsUseCase } from '../../../application/use-cases/file/get-files-by-ids.use-case';
import { MoveFileUseCase } from '../../../application/use-cases/file/move-file.use-case';
import { PresignedUploadUseCase } from '../../../application/use-cases/file/presigned-upload.use-case';
import { ProcessImageVariantsUseCase } from '../../../application/use-cases/file/process-image-variants.use-case';
import { EnqueueImageVariantsBackfillUseCase } from '../../../application/use-cases/file/enqueue-image-variants-backfill.use-case';
import { ResolveFileDisplayUrlUseCase } from '../../../application/use-cases/file/resolve-file-display-url.use-case';
import { QueryFilesUseCase } from '../../../application/use-cases/file/query-files.use-case';
import { UpdateFileUseCase } from '../../../application/use-cases/file/update-file.use-case';
import { FILE_ACCESS_REPOSITORY_TOKEN } from '../../../domain/repositories/file-access/file-access.repository.tokens';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import { FILE_REPOSITORY_TOKEN } from '../../../domain/repositories/file/file.repository.tokens';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import { FILE_SHARE_REPOSITORY_TOKEN } from '../../../domain/repositories/file-share/file-share.repository.tokens';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import { FOLDER_REPOSITORY_TOKEN } from '../../../domain/repositories/folder/folder.repository.tokens';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import { ChecksumService } from '../../checksum/checksum.service';
import { SharpImageVariantsProcessor } from '../../image-processing/sharp-image-variants.processor';
import { MimeService } from '../../mime/mime.service';
import { PrismaFileAccessRepository } from '../../persistence/repositories/file-access/prisma-file-access.repository';
import { PrismaFileRepository } from '../../persistence/repositories/file/prisma-file.repository';
import { BullMqImageVariantsQueueAdapter } from '../../queues/bullmq-image-variants-queue.adapter';
import { ImageVariantsQueueProcessor } from '../../queues/image-variants.processor';
import { S3ObjectStorageAdapter } from '../../s3/s3-object-storage.adapter';
import { S3UploadService } from '../../s3/s3-upload.service';
import { S3Service } from '../../s3/s3.service';
import { FileShareModule } from '../file-share/file-share.module';
import { FolderModule } from '../folder/folder.module';

@Module({
  imports: [
    forwardRef(() => FolderModule),
    forwardRef(() => FileShareModule),
  ],
  providers: [
    S3Service,
    S3UploadService,
    S3ObjectStorageAdapter,
    SharpImageVariantsProcessor,
    BullMqImageVariantsQueueAdapter,
    MimeService,
    ChecksumService,
    ImageVariantsQueueProcessor,
    {
      provide: FILE_REPOSITORY_TOKEN,
      useClass: PrismaFileRepository,
    },
    {
      provide: FILE_ACCESS_REPOSITORY_TOKEN,
      useClass: PrismaFileAccessRepository,
    },
    {
      provide: FILE_UPLOADER_PORT_TOKEN,
      useExisting: S3UploadService,
    },
    {
      provide: MIME_DETECTOR_PORT_TOKEN,
      useExisting: MimeService,
    },
    {
      provide: CHECKSUM_CALCULATOR_PORT_TOKEN,
      useExisting: ChecksumService,
    },
    {
      provide: OBJECT_STORAGE_PORT_TOKEN,
      useExisting: S3ObjectStorageAdapter,
    },
    {
      provide: IMAGE_VARIANTS_PROCESSOR_PORT_TOKEN,
      useExisting: SharpImageVariantsProcessor,
    },
    {
      provide: IMAGE_VARIANTS_QUEUE_PORT_TOKEN,
      useExisting: BullMqImageVariantsQueueAdapter,
    },
    {
      provide: PresignedUploadUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        uploader: IFileUploaderPort,
      ) => new PresignedUploadUseCase(fileRepo, uploader),
      inject: [FILE_REPOSITORY_TOKEN, FILE_UPLOADER_PORT_TOKEN],
    },
    {
      provide: ResolveFileDisplayUrlUseCase,
      useFactory: (s3Service: S3Service) =>
        new ResolveFileDisplayUrlUseCase(s3Service),
      inject: [S3Service],
    },
    {
      provide: ProcessImageVariantsUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        objectStorage: IObjectStoragePort,
        imageVariantsProcessor: IImageVariantsProcessorPort,
      ) =>
        new ProcessImageVariantsUseCase(
          fileRepo,
          objectStorage,
          imageVariantsProcessor,
        ),
      inject: [
        FILE_REPOSITORY_TOKEN,
        OBJECT_STORAGE_PORT_TOKEN,
        IMAGE_VARIANTS_PROCESSOR_PORT_TOKEN,
      ],
    },
    {
      provide: EnqueueImageVariantsBackfillUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        imageVariantsQueue: IImageVariantsQueuePort,
      ) =>
        new EnqueueImageVariantsBackfillUseCase(fileRepo, imageVariantsQueue),
      inject: [FILE_REPOSITORY_TOKEN, IMAGE_VARIANTS_QUEUE_PORT_TOKEN],
    },
    {
      provide: GetFileUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
        fileShareRepo: IFileShareRepository,
      ) => new GetFileUseCase(fileRepo, fileAccessRepo, fileShareRepo),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
        FILE_SHARE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetFilesByIdsUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
        fileShareRepo: IFileShareRepository,
      ) => new GetFilesByIdsUseCase(fileRepo, fileAccessRepo, fileShareRepo),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
        FILE_SHARE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: QueryFilesUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
        fileShareRepo: IFileShareRepository,
      ) => new QueryFilesUseCase(fileRepo, fileAccessRepo, fileShareRepo),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
        FILE_SHARE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: CreateFilesUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        folderRepo: IFolderRepository,
      ) => new CreateFilesUseCase(fileRepo, folderRepo),
      inject: [FILE_REPOSITORY_TOKEN, FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateFileUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
      ) => new UpdateFileUseCase(fileRepo, fileAccessRepo),
      inject: [FILE_REPOSITORY_TOKEN, FILE_ACCESS_REPOSITORY_TOKEN],
    },
    {
      provide: MoveFileUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        folderRepo: IFolderRepository,
        fileAccessRepo: IFileAccessRepository,
      ) => new MoveFileUseCase(fileRepo, folderRepo, fileAccessRepo),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FOLDER_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteFilesUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
        objectStorage: IObjectStoragePort,
      ) => new DeleteFilesUseCase(fileRepo, fileAccessRepo, objectStorage),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
        OBJECT_STORAGE_PORT_TOKEN,
      ],
    },
    {
      provide: GrantFileAccessUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        accessRepo: IFileAccessRepository,
      ) => new GrantFileAccessUseCase(fileRepo, accessRepo),
      inject: [FILE_REPOSITORY_TOKEN, FILE_ACCESS_REPOSITORY_TOKEN],
    },
    {
      provide: RevokeFileAccessUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        accessRepo: IFileAccessRepository,
      ) => new RevokeFileAccessUseCase(fileRepo, accessRepo),
      inject: [FILE_REPOSITORY_TOKEN, FILE_ACCESS_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    FILE_REPOSITORY_TOKEN,
    FILE_ACCESS_REPOSITORY_TOKEN,
    MIME_DETECTOR_PORT_TOKEN,
    CHECKSUM_CALCULATOR_PORT_TOKEN,
    IMAGE_VARIANTS_QUEUE_PORT_TOKEN,
    OBJECT_STORAGE_PORT_TOKEN,
    PresignedUploadUseCase,
    ProcessImageVariantsUseCase,
    EnqueueImageVariantsBackfillUseCase,
    DeleteFilesUseCase,
    ResolveFileDisplayUrlUseCase,
    GetFilesByIdsUseCase,
    GetFileUseCase,
    QueryFilesUseCase,
    CreateFilesUseCase,
    UpdateFileUseCase,
    MoveFileUseCase,
    GrantFileAccessUseCase,
    RevokeFileAccessUseCase,
  ],
})
export class FileModule {}
