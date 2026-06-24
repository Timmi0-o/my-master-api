import { Module } from '@nestjs/common';
import { CHECKSUM_CALCULATOR_PORT_TOKEN } from './application/ports/i-checksum-calculator.port';
import { FILE_UPLOADER_PORT_TOKEN } from './application/ports/i-file-uploader.port';
import { MIME_DETECTOR_PORT_TOKEN } from './application/ports/i-mime-detector.port';
import { GrantFileAccessUseCase } from './application/use-cases/file-access/grant-file-access.use-case';
import { RevokeFileAccessUseCase } from './application/use-cases/file-access/revoke-file-access.use-case';
import { CreateFileShareUseCase } from './application/use-cases/file-share/create-file-share.use-case';
import { GetFileShareUseCase } from './application/use-cases/file-share/get-file-share.use-case';
import { RevokeFileShareUseCase } from './application/use-cases/file-share/revoke-file-share.use-case';
import { CreateFilesUseCase } from './application/use-cases/file/create-files.use-case';
import { DeleteFilesUseCase } from './application/use-cases/file/delete-files.use-case';
import { FileUploadedUseCase } from './application/use-cases/file/file-uploaded.use-case';
import { GetFileUseCase } from './application/use-cases/file/get-file.use-case';
import { GetFilesByIdsUseCase } from './application/use-cases/file/get-files-by-ids.use-case';
import { MoveFileUseCase } from './application/use-cases/file/move-file.use-case';
import { PresignedUploadUseCase } from './application/use-cases/file/presigned-upload.use-case';
import { QueryFilesUseCase } from './application/use-cases/file/query-files.use-case';
import { UpdateFileUseCase } from './application/use-cases/file/update-file.use-case';
import { CreateFolderUseCase } from './application/use-cases/folder/create-folder.use-case';
import { CreateRootFolderUseCase } from './application/use-cases/folder/create-root-folder.use-case';
import { DeleteFolderUseCase } from './application/use-cases/folder/delete-folder.use-case';
import { GetFolderUseCase } from './application/use-cases/folder/get-folder.use-case';
import { MoveFolderUseCase } from './application/use-cases/folder/move-folder.use-case';
import { UpdateFolderUseCase } from './application/use-cases/folder/update-folder.use-case';
import { FILE_ACCESS_REPOSITORY_TOKEN } from './domain/repositories/file-access/file-access.repository.tokens';
import type { IFileAccessRepository } from './domain/repositories/file-access/i-file-access.repository';
import { FILE_REPOSITORY_TOKEN } from './domain/repositories/file/file.repository.tokens';
import type { IFileRepository } from './domain/repositories/file/i-file.repository';
import { FILE_SHARE_REPOSITORY_TOKEN } from './domain/repositories/file-share/file-share.repository.tokens';
import type { IFileShareRepository } from './domain/repositories/file-share/i-file-share.repository';
import { FOLDER_REPOSITORY_TOKEN } from './domain/repositories/folder/folder.repository.tokens';
import type { IFolderRepository } from './domain/repositories/folder/i-folder.repository';
import { ChecksumService } from './infrastructure/checksum/checksum.service';
import { MimeService } from './infrastructure/mime/mime.service';
import { PrismaFileAccessRepository } from './infrastructure/persistence/repositories/file-access/prisma-file-access.repository';
import { PrismaFileShareRepository } from './infrastructure/persistence/repositories/file-share/prisma-file-share.repository';
import { PrismaFileRepository } from './infrastructure/persistence/repositories/file/prisma-file.repository';
import { PrismaFolderRepository } from './infrastructure/persistence/repositories/folder/prisma-folder.repository';
import { S3UploadService } from './infrastructure/s3/s3-upload.service';
import { S3Service } from './infrastructure/s3/s3.service';
import { FileSharesController } from './presentation/http/controllers/file-shares.controller';
import { FilesController } from './presentation/http/controllers/files.controller';
import { FilesInternalController } from './presentation/http/controllers/files-internal.controller';
import { FoldersController } from './presentation/http/controllers/folders.controller';
import { FilesValidator } from './presentation/http/validation/files.validator';
import { FoldersValidator } from './presentation/http/validation/folders.validator';
import type { IChecksumCalculatorPort } from './application/ports/i-checksum-calculator.port';
import type { IFileUploaderPort } from './application/ports/i-file-uploader.port';
import type { IMimeDetectorPort } from './application/ports/i-mime-detector.port';

@Module({
  controllers: [
    FilesController,
    FoldersController,
    FileSharesController,
    FilesInternalController,
  ],
  providers: [
    FilesValidator,
    FoldersValidator,
    S3Service,
    S3UploadService,
    MimeService,
    ChecksumService,
    {
      provide: FILE_REPOSITORY_TOKEN,
      useClass: PrismaFileRepository,
    },
    {
      provide: FOLDER_REPOSITORY_TOKEN,
      useClass: PrismaFolderRepository,
    },
    {
      provide: FILE_ACCESS_REPOSITORY_TOKEN,
      useClass: PrismaFileAccessRepository,
    },
    {
      provide: FILE_SHARE_REPOSITORY_TOKEN,
      useClass: PrismaFileShareRepository,
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
      provide: PresignedUploadUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        uploader: IFileUploaderPort,
      ) => new PresignedUploadUseCase(fileRepo, uploader),
      inject: [FILE_REPOSITORY_TOKEN, FILE_UPLOADER_PORT_TOKEN],
    },
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
      ) => new DeleteFilesUseCase(fileRepo, fileAccessRepo),
      inject: [FILE_REPOSITORY_TOKEN, FILE_ACCESS_REPOSITORY_TOKEN],
    },
    {
      provide: GetFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new GetFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: CreateFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new CreateFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: CreateRootFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new CreateRootFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new UpdateFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: MoveFolderUseCase,
      useFactory: (folderRepo: IFolderRepository) =>
        new MoveFolderUseCase(folderRepo),
      inject: [FOLDER_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteFolderUseCase,
      useFactory: (
        folderRepo: IFolderRepository,
        fileRepo: IFileRepository,
      ) => new DeleteFolderUseCase(folderRepo, fileRepo),
      inject: [FOLDER_REPOSITORY_TOKEN, FILE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateFileShareUseCase,
      useFactory: (
        fileRepo: IFileRepository,
        shareRepo: IFileShareRepository,
        fileAccessRepo: IFileAccessRepository,
      ) => new CreateFileShareUseCase(fileRepo, shareRepo, fileAccessRepo),
      inject: [
        FILE_REPOSITORY_TOKEN,
        FILE_SHARE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetFileShareUseCase,
      useFactory: (
        shareRepo: IFileShareRepository,
        fileRepo: IFileRepository,
      ) => new GetFileShareUseCase(shareRepo, fileRepo),
      inject: [FILE_SHARE_REPOSITORY_TOKEN, FILE_REPOSITORY_TOKEN],
    },
    {
      provide: RevokeFileShareUseCase,
      useFactory: (
        shareRepo: IFileShareRepository,
        fileRepo: IFileRepository,
        fileAccessRepo: IFileAccessRepository,
      ) => new RevokeFileShareUseCase(shareRepo, fileRepo, fileAccessRepo),
      inject: [
        FILE_SHARE_REPOSITORY_TOKEN,
        FILE_REPOSITORY_TOKEN,
        FILE_ACCESS_REPOSITORY_TOKEN,
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
    PresignedUploadUseCase,
    GetFilesByIdsUseCase,
    CreateRootFolderUseCase,
    FILE_REPOSITORY_TOKEN,
  ],
})
export class FilesModule {}
